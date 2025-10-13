import { Link } from "react-router";
export default function ProfileCard() {
	return (
		// 왼쪽 영역 - 프로필 카드
		<div className="flex flex-col items-center relative">
			{/* 프로필 이미지 영역 */}
			<div className="z-99 w-30 h-30">
				<div className="w-full h-full bg-[#09a32b] rounded-xl hover:bg-[rgba(0,0,0,0.4)] cursor-pointer">
					<img src={""} alt="profile" />
				</div>
			</div>
			{/* 텍스트 컨텐츠 */}
			<div className="flex flex-col items-center absolute w-full bg-white top-15 rounded-xl shadow-xl pt-15 pb-10">
				{/* 이름 및 뱃지 */}
				<div className="flex flex-col items-center pt-6">
					<div className="text-sm font-medium text-gray-800">
						🏆 초보 수학 마스터
					</div>
					<div className="text-3xl font-bold text-gray-800 mt-1">
						홍길동
					</div>
					<div className="text-base font-normal text-gray-500 mt-2.5">
						학생 · 고등학교 2학년
					</div>
				</div>

				{/* 프로필 수정 버튼 */}
				<Link
					to="/profile/1/edit"
					className="bg-violet-500 rounded-xl text-center mt-5 px-4 py-2 cursor-pointer text-base font-normal text-white"
				>
					프로필 수정
				</Link>

				{/* 친구/게시글/댓글 통계 */}
				<div className="flex justify-between gap-[50px] pt-6">
					{/* 친구 통계 */}
					<div className="flex flex-col items-center">
						<div className="text-xl font-medium text-violet-500">
							7
						</div>
						<div className="text-sm font-medium text-gray-500">
							친구
						</div>
					</div>

					{/* 게시글 통계 */}
					<div className="flex flex-col items-center">
						<div className="text-xl font-medium text-violet-500">
							120
						</div>
						<div className="text-sm font-medium text-gray-500">
							게시글
						</div>
					</div>

					{/* 댓글 통계 */}
					<div className="flex flex-col items-center">
						<div className="text-xl font-medium text-violet-500">
							67
						</div>
						<div className="text-sm font-medium text-gray-500">
							댓글
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
