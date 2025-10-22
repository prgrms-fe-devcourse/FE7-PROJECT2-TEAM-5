import { useState } from "react";
import { Heart, MessageSquare } from "lucide-react";
import PageNation from "../../components/PageNation";
import { useActPostStore } from "../../stores/profileActivityStore";
import { Link } from "react-router";

export default function ActivitiesComments() {
	const { userComments } = useActPostStore();

	const tabs = [
		{ key: "all", label: "전체게시판" },
		{ key: "free", label: "자유게시판" },
		{ key: "elementary", label: "초등학생 게시판" },
		{ key: "middle", label: "중학교 게시판" },
		{ key: "high", label: "고등학교 게시판" },
		{ key: "resources", label: "자료 공유 게시판" },
		{ key: "group", label: "그룹게시판" },
	] as const;

	// 페이지네이션 관련
	const commentsPerPage = 5;
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(userComments.length / commentsPerPage);
	const displayedComments = userComments.slice(
		(currentPage - 1) * commentsPerPage,
		currentPage * commentsPerPage,
	);

	console.log(displayedComments);

	if (!userComments.length) return <p>작성한 댓글이 없습니다.</p>;
	return (
		<div>
			{/* 댓글 목록 */}
			{displayedComments.map((comment, idx) => {
				const boardLabel = comment.post
					? (tabs.find((tab) => tab.key === comment.post?.board_type)
							?.label ?? "알 수 없음")
					: "알 수 없음";

				const replyCount = userComments.filter(
					(c) => c.parent_comment_id !== comment.id,
				).length;

				return (
					<Link to={`/posts/${comment.post_id}`}>
						<div
							key={comment.id}
							className={`p-4 flex flex-row justify-between ${
								idx > 0 ? "border-t border-[#E5E7EB]" : ""
							}`}
						>
							{/* left: 게시판명 + 댓글 내용 */}
							<div className="flex-1 flex flex-col gap-1">
								<p className="font-bold text-lg">
									{boardLabel}: "
									{comment.post?.title ?? "제목 없음"}"
								</p>
								<p className="text-gray-500 line-clamp-2">
									{!comment.parent_comment_id ? (
										comment.content
									) : (
										<div className="space-x-2">
											<span className="text-[#8B5CF6] font-medium">
												@{comment.user?.nickname}
											</span>
											<span>{comment.content}</span>
										</div>
									)}
									{}
								</p>
							</div>

							{/* right: 날짜, 좋아요, 대댓글 수 */}
							<div className="text-sm text-[#9CA3AF] flex flex-row items-start gap-1">
								<div>{comment.created_at.slice(0, 10)}</div>
								<span>·</span>

								<div className="flex flex-row gap-1 items-center">
									<Heart color="red" size={15} />
									<span>
										{comment.comment_likes?.length ?? 0}
									</span>
								</div>

								{!comment.parent_comment_id && (
									<>
										<span>·</span>
										<div className="flex flex-row gap-1 items-center">
											<MessageSquare
												color="#8B5CF6"
												size={15}
											/>
											<span>{replyCount}</span>
										</div>
									</>
								)}
							</div>
						</div>
					</Link>
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
