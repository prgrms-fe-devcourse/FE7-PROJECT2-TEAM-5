import { Link } from "react-router";

export default function Header() {
	return (
		<>
			<header className="z-10 w-full h-[70px] px-6 flex justify-between items-center border-b border-[#E6E9EE] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
				<Link to="/" className="text-xl font-bold text-[#8B5CF6]">
					StudyHub
				</Link>
				<div className="flex flex-row gap-6 text-[#6B7280] font-medium">
					<Link to="/search">검색</Link>
					<Link to="/">알림</Link>
					<Link to="/msg/1">메시지</Link>
					<Link to="/profile">프로필</Link>
					<Link to="/">다크모드</Link>
				</div>
			</header>
		</>
	);
}
