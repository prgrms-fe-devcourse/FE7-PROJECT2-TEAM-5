export default function TabContainer() {
	return (
		<div className="flex w-full p-0">
			{/* 탭 네비게이션 - 버튼들을 가로로 배열 */}
			<div className="flex space-x-2">
				{/* 개인 정보 */}
				<button
					className={`px-4 py-2 cursor-pointer
                        bg-violet-500 text-white rounded-md
                        text-base font-normal text-center`}
				>
					개인 정보
				</button>

				{/* 활동 내역 */}
				<button
					className={`px-4 py-2 cursor-pointer
                        bg-white text-violet-500 font-normal text-center`}
				>
					활동 내역
				</button>

				{/* 친구 목록 */}
				<button
					className={`px-4 py-2 cursor-pointer
                        bg-white text-violet-500 font-normal text-center`}
				>
					친구 목록
				</button>
			</div>
		</div>
	);
}