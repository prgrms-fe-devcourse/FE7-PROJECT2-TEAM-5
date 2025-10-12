type PageNationProps = {
	currentPage: number; // 현재 페이지
	totalPages: number; // 총 페이지 수
	onPageChange: (page: number) => void; // 페이지 버튼 클릭 시 호출되는 함수
};

export default function PageNation({
	currentPage,
	totalPages,
	onPageChange,
}: PageNationProps) {
	if (totalPages <= 1) return null; // 페이지가 1개 이하이면 렌더링 안 함

	return (
		<div className="flex justify-center gap-2 mt-4">
			{Array.from({ length: totalPages }, (_, i) => (
				<button
					key={i + 1}
					onClick={() => onPageChange(i + 1)}
					className={`px-3 py-1 rounded-md border cursor-pointer ${
						currentPage === i + 1
							? "bg-violet-500 text-white border-violet-500"
							: "bg-white text-gray-700 border-gray-300"
					}`}
				>
					{i + 1}
				</button>
			))}
		</div>
	);
}
