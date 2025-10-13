import { useState } from "react";
import PageNation from "../../components/PageNation";

type Comment = {
	id: number;
	category: string;
	postTitle: string;
	content: string;
	info: string; // "날짜 · 좋아요"
};

export default function ActivitiesComments() {
	const dummyComments: Comment[] = [
		{
			id: 1,
			category: "해당 카테고리",
			postTitle: "게시글 제목",
			content: "작성한 댓글 내용",
			info: "2025-09-20 · 좋아요 12",
		},
		{
			id: 2,
			category: "자유게시판",
			postTitle: "시험 잘 보는 법",
			content: "저도 아침에 일찍 일어나서 공부하니 효과 좋더라고요! 🔥",
			info: "2025-09-20 · 좋아요 12",
		},
		{
			id: 3,
			category: "공지사항",
			postTitle: "새 학기 일정 안내",
			content: "이번 학기 일정 확인했습니다.",
			info: "2025-09-19 · 좋아요 3",
		},
		{
			id: 4,
			category: "스터디",
			postTitle: "영어 스터디 모집",
			content: "참여하고 싶습니다!",
			info: "2025-09-18 · 좋아요 5",
		},
		{
			id: 5,
			category: "자유게시판",
			postTitle: "독서 토론",
			content: "저도 참여하고 싶습니다.",
			info: "2025-09-17 · 좋아요 2",
		},
		{
			id: 6,
			category: "수학 게시판",
			postTitle: "문제풀이 질문",
			content: "저도 같은 문제에서 막혔습니다.",
			info: "2025-09-16 · 좋아요 1",
		},
		{
			id: 7,
			category: "수학 게시판",
			postTitle: "문제풀이 질문",
			content: "저도 같은 문제에서 막혔습니다.",
			info: "2025-09-16 · 좋아요 1",
		},
	];

	const commentsPerPage = 6;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(dummyComments.length / commentsPerPage);

	const displayedComments = dummyComments.slice(
		(currentPage - 1) * commentsPerPage,
		currentPage * commentsPerPage,
	);

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
							{comment.category}: "{comment.postTitle}"
						</p>
						<p className="text-gray-500">{comment.content}</p>
					</div>
					{/* right */}
					<div className="text-sm text-[#9CA3AF]">{comment.info}</div>
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
