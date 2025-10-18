import { useState } from "react";
import PageNation from "../../components/PageNation";
import type { Comment } from "../../types/comment";

export default function ActivitiesComments({
	comments,
}: {
	comments: Comment[];
}) {
	const commentsPerPage = 6;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(comments.length / commentsPerPage);

	const displayedComments = comments.slice(
		(currentPage - 1) * commentsPerPage,
		currentPage * commentsPerPage,
	);

	console.log(comments);

	if (!comments.length) return <p>작성한 댓글이 없습니다.</p>;

	return (
		<div>
			{/* 댓글 반복 */}
			{displayedComments.map((comment, idx) => (
				<div
					key={comment.id}
					className={`p-4 flex flex-row justify-between ${
						idx > 0 ? "border-t border-[#E5E7EB]" : ""
					}`}
				>
					{/* left */}
					<div className="flex flex-col gap-1">
						<p className="font-bold text-lg">
							{comment.post_id}: "{comment.content}"
						</p>
						<p className="text-gray-500">{comment.content}</p>
					</div>
					{/* right */}
					<div className="text-sm text-[#9CA3AF]">
						2025-09-20 · 좋아요 12 · 댓글 5
					</div>
				</div>
			))}

			{/* 페이지네이션 */}
			<PageNation
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
