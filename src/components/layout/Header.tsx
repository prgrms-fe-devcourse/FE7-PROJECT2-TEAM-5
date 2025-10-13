import { Link } from "react-router";

export default function Header() {
	return (
		<>
			<header className="z-10 w-full h-[70px] px-6 flex justify-between items-center border-b border-[#E6E9EE] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
				<Link to="/" className="text-xl font-bold text-[#8B5CF6]">
					StudyHub
				</Link>
				<nav className="flex flex-row gap-6 text-[#6B7280] font-medium">
					<Link to="/search">검색</Link>
					<Link to="/postList">게시판</Link>
					<Link to="/">그룹</Link>
					<button className="cursor-pointer">알림</button>
					<Link to="/msg/1">메시지</Link>
					<Link to="/profile/1">프로필</Link>
					<button className="cursor-pointer">다크모드</button>
				</nav>
			</header>
		</>
	);
}
