import { useEffect, useState } from "react";
import PageNation from "../../components/PageNation";
import type { Comment } from "../../types/comment";
import { Heart, MessageSquare } from "lucide-react";
import { usePostStore } from "../../stores/profileActivityStore";

export default function ActivitiesComments({
	comments,
}: {
	comments: Comment[];
}) {
	const tabs = [
		{ key: "all", label: "전체게시판" },
		{ key: "free", label: "자유게시판" },
		{ key: "elementary", label: "초등학생 게시판" },
		{ key: "middle", label: "중학교 게시판" },
		{ key: "high", label: "고등학교 게시판" },
		{ key: "resources", label: "자료 공유 게시판" },
		{ key: "group", label: "그룹게시판" },
	] as const;

	const parentComments = usePostStore((state) => state.parentComments);
	const commentsPosts = usePostStore((state) => state.commentsPosts);
	const { fetchBoardType } = usePostStore();

	const fetchBoardTypeForAllComments = async () => {
		for (const comment of comments) {
			await fetchBoardType(comment.post_id);
		}
	};

	useEffect(() => {
		fetchBoardTypeForAllComments();
	}, [comments]);

	const commentsPerPage = 6;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(comments.length / commentsPerPage);

	const displayedComments = comments.slice(
		(currentPage - 1) * commentsPerPage,
		currentPage * commentsPerPage,
	);

	console.log(commentsPosts);

	if (!comments.length) return <p>작성한 댓글이 없습니다.</p>;

	return (
		<div>
			{/* 댓글 반복 */}
			{displayedComments.map((comment, idx) => {
				// 1️⃣ 댓글이 속한 게시글 찾기
				const post = commentsPosts.find(
					(p) => p.id === comment.post_id,
				);

				// 2️⃣ 게시글 board_type에 맞는 label 찾기
				const boardLabel = post
					? tabs.find((tab) => tab.key === post.board_type)?.label ||
						"알 수 없음"
					: "알 수 없음";

				return (
					<div
						key={comment.id}
						className={`p-4 flex flex-row justify-between ${idx > 0 ? "border-t border-[#E5E7EB]" : ""}`}
					>
						{/* left */}
						<div className="flex flex-col gap-1">
							<p className="font-bold text-lg">
								{boardLabel}: "{post?.title}"
							</p>
							<p className="text-gray-500">{comment.content}</p>
						</div>
						{/* right */}
						<div className="text-sm text-[#9CA3AF] flex flex-row items-start gap-1">
							<div>{comment.created_at.slice(0, 10)}</div>
							<span>·</span>
							<div className="flex flex-row gap-1 items-center">
								<Heart color="red" size={15} />
								<span>
									{comment.comment_likes?.length || 0}
								</span>
							</div>
							<span>·</span>
							<div className="flex flex-row gap-1 items-center">
								<MessageSquare color="#8B5CF6" size={15} />
								<span>
									{comment.parent_comment_id
										? parentComments.length
										: 0}
								</span>
							</div>
						</div>
					</div>
				);
			})}

			{/* 페이지네이션 */}
			<PageNation
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
