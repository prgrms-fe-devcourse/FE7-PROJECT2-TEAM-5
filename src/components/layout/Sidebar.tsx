export default function Sidebar() {
	return (
		<>
			<aside className="w-[290px] p-5 border-r border-[#E6E9EE]">
				{/* 프로필 */}
				<div className="flex flex-col items-center mb-5">
					{/* 프로필 사진(기본 이미지) */}
					<img
						src="/src/assets/image.png"
						alt="MyProfile"
						className="w-25 h-25 rounded-full mx-auto mb-2"
					/>
					{/* 닉네임 */}
					<h2 className="text-xl font-medium mb-[10px]">닉네임</h2>
					{/* 닉네임 아래 박스 */}
					<div className="w-[250px] h-[50px] bg-[#F7FAFC] rounded-lg flex items-center justify-center font-medium text-[18px] text-[#6B7280]">
						로그인 후 확인 가능
					</div>
				</div>
				{/* 전체 게시판 */}
				<div className="mb-5">
					{/* 제목 */}
					<div className="w-full mb-2.5 border-b border-[#222222] pb-3.5 flex justify-between">
						<h3 className="font-medium">전체 게시판</h3>
						<button className="cursor-pointer">
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect
									x="5"
									y="12"
									width="12"
									height="2"
									transform="rotate(-90 5 12)"
									fill="#00A9A5"
								/>
								<rect
									y="5"
									width="12"
									height="2"
									fill="#00A9A5"
								/>
							</svg>
						</button>
					</div>
					{/* 내용 */}
					{/* 게시판 맵핑해서 맵으로 돌릴 예정 div -> Link로 수정 */}
					<div className="flex flex-col gap-[5px]">
						<div className="cursor-pointer w-full h-10 rounded-lg px-[30px] flex items-center bg-[#00A9A5] text-white">
							자유 게시판
						</div>
						<div className="cursor-pointer w-full h-10 rounded-lg px-[30px] flex items-center hover:bg-[#DBF8F7]">
							초등학생
						</div>
						<div className="cursor-pointer w-full h-10 rounded-lg px-[30px] flex items-center hover:bg-[#DBF8F7]">
							중학생
						</div>
						<div className="cursor-pointer w-full h-10 rounded-lg px-[30px] flex items-center hover:bg-[#DBF8F7]">
							고등학생
						</div>
						<div className="cursor-pointer w-full h-10 rounded-lg px-[30px] flex items-center hover:bg-[#DBF8F7]">
							스터디 그룹
						</div>
					</div>
				</div>
				{/* 선생님 게시판 => 선생님만 보이게 할건지*/}
				<div className="mb-5">
					{/* 제목 */}
					<div className="w-full mb-2.5 border-b border-[#222222] pb-3.5 flex justify-between">
						<h3 className="font-medium">선생님 게시판</h3>
						<button className="cursor-pointer">
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect
									x="5"
									y="12"
									width="12"
									height="2"
									transform="rotate(-90 5 12)"
									fill="#00A9A5"
								/>
								<rect
									y="5"
									width="12"
									height="2"
									fill="#00A9A5"
								/>
							</svg>
						</button>
					</div>
					{/* 내용 */}
					{/* 게시판 맵핑해서 맵으로 돌릴 예정 div -> Link로 수정 */}
					<div className="cursor-pointer w-full h-10 rounded-lg px-[30px] flex items-center hover:bg-[#DBF8F7]">
						수업 자료 공유
					</div>
				</div>
				{/* 실시간 접속 */}
				<div className="">
					{/* 접속 */}
					<div className="flex items-end gap-[5px] w-full mb-2.5 border-b border-[#222222] pb-3.5">
						<h3 className="font-medium">실시간 접속</h3>
						<span className="font-medium text-[14px]">00명</span>
					</div>
					{/* 접속자 명단 */}
					<div className="w-full h-[200px] border border-[#E6E9EE] pl-[15px] py-[15px]">
						{/* 내용 inner */}
						<div className="w-full h-full flex flex-col gap-4 overflow-y-auto">
							{/* 접속자 => map 수정 */}
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#10B981"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">고길동</h4>
									<span className="text-[12px]">
										초등학교 6학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#EF4444"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">김길동</h4>
									<span className="text-[12px]">
										중학교 3학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#10B981"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">고길동</h4>
									<span className="text-[12px]">
										초등학교 6학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#EF4444"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">김길동</h4>
									<span className="text-[12px]">
										중학교 3학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#10B981"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">고길동</h4>
									<span className="text-[12px]">
										초등학교 6학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#EF4444"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">김길동</h4>
									<span className="text-[12px]">
										중학교 3학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#10B981"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">고길동</h4>
									<span className="text-[12px]">
										초등학교 6학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#EF4444"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">김길동</h4>
									<span className="text-[12px]">
										중학교 3학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#10B981"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">고길동</h4>
									<span className="text-[12px]">
										초등학교 6학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#EF4444"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">김길동</h4>
									<span className="text-[12px]">
										중학교 3학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#10B981"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">고길동</h4>
									<span className="text-[12px]">
										초등학교 6학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#EF4444"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">김길동</h4>
									<span className="text-[12px]">
										중학교 3학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#10B981"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">고길동</h4>
									<span className="text-[12px]">
										초등학교 6학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#EF4444"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">김길동</h4>
									<span className="text-[12px]">
										중학교 3학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#10B981"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">고길동</h4>
									<span className="text-[12px]">
										초등학교 6학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#EF4444"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">김길동</h4>
									<span className="text-[12px]">
										중학교 3학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#10B981"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">고길동</h4>
									<span className="text-[12px]">
										초등학교 6학년
									</span>
								</div>
							</div>
							<div className="flex gap-1 items-center">
								<div className="w-6 h-6 relative">
									<img
										src="/src/assets/image.png"
										alt="Profile"
										className="w-full h-full"
									/>
									<svg
										width="5"
										height="5"
										viewBox="0 0 5 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 right-0"
									>
										<circle
											cx="2.5"
											cy="2.5"
											r="2.5"
											fill="#EF4444"
										/>
									</svg>
								</div>
								<div className="flex gap-1 items-end">
									<h4 className="text-[14px]">김길동</h4>
									<span className="text-[12px]">
										중학교 3학년
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}
