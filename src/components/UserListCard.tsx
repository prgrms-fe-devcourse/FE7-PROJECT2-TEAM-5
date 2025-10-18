import { Link } from "react-router";

export default function UserListCard() {
	return (
		<>
			<Link to={`/profile/해당 프로필 유저 Id`}>
				<div className="flex flex-row justify-between items-center py-4 px-5 hover:bg-[#F1F3F5]">
					{/* left */}
					<div className="flex flex-row items-center gap-2.5">
						{/* 이미지 */}
						<div className="relative w-12 h-12 bg-amber-300 rounded-lg">
							{/* 온라인 */}
							<div className="absolute right-0 bottom-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
							{/* 오프라인 */}
							{/* <div className="absolute right-0 bottom-0 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div> */}
						</div>
						{/* 정보 */}
						<div className="flex flex-col gap-1 text-sm">
							{/* 이름 */}
							<div>홍길동</div>
							{/* 소속, 학년 (선생님은 전공) */}
							<div>학생, 3학년</div>
						</div>
					</div>
					{/* right */}
					<div className="space-x-2 text-xs">
						<button className="cursor-pointer px-2 py-1 bg-violet-500 text-white rounded hover:bg-violet-600">
							팔로우
						</button>
						<button className="cursor-pointer px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
							메시지
						</button>
					</div>
				</div>
			</Link>
		</>
	);
}
