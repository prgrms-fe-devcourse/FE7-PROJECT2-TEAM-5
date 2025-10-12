import { Link } from "react-router";
export default function ProfileCard() {
	return (
		// 왼쪽 영역 - 프로필 카드
		<div className="flex flex-col items-center bg-white rounded-xl shadow-xl p-8 space-y-4 h-full">
			{/* 프로필 이미지 영역 */}
			<div className="relative w-40 h-40 cursor-pointer">
				<div className="w-full h-full bg-[#9a4848] rounded-xl" />
				<div className="absolute inset-0 bg-[#00000066] rounded-xl" />

				{/* 카메라/수정 아이콘 */}
				<div className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-xl border border-solid border-[#e6e9ee] flex items-center justify-center">
					<img
						className="w-[15px] h-[15px] object-cover"
						alt="Write"
						src={""}
					/>
				</div>
			</div>

			{/* 이름 및 뱃지 */}
			<div className="flex flex-col items-center pt-4">
				<div className="text-sm font-medium text-gray-800">
					🏆 초보 수학 마스터
				</div>
				<div className="text-3xl font-bold text-gray-800">홍길동</div>
				<div className="text-base font-normal text-gray-500 mt-1">
					학생 · 고등학교 2학년
				</div>
			</div>

			{/* 프로필 수정 버튼 */}
			<Link to="/profile/1/edit">
				<button className="w-[110px] h-[39px] bg-violet-500 rounded-xl flex items-center justify-center mt-4 cursor-pointer">
					<div className="text-base font-normal text-white">
						프로필 수정
					</div>
				</button>
			</Link>

			{/* 친구/게시글/댓글 통계 */}
			<div className="flex justify-between w-[191px] h-[51px] pt-4 ">
				{/* 친구 통계 */}
				<div className="flex flex-col items-center w-[50px]">
					<div className="text-xl font-medium text-violet-500">7</div>
					<div className="text-sm font-medium text-gray-500">
						친구
					</div>
				</div>

				{/* 게시글 통계 */}
				<div className="flex flex-col items-center w-[50px]">
					<div className="text-xl font-medium text-violet-500">
						120
					</div>
					<div className="text-sm font-medium text-gray-500">
						게시글
					</div>
				</div>

				{/* 댓글 통계 */}
				<div className="flex flex-col items-center w-[50px]">
					<div className="text-xl font-medium text-violet-500">
						67
					</div>
					<div className="text-sm font-medium text-gray-500">
						댓글
					</div>
				</div>
			</div>
		</div>
	);
}
