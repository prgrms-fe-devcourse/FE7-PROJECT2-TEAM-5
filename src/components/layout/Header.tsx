import { Link } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { useState } from "react";
import NotificationSidebar from "../NotificationSidebar";

export default function Header() {
	const isLoggedIn = useProfileStore((state) => state.isLoggedIn);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);

	const handleNotificationToggle = () => {
		setIsNotificationOpen(!isNotificationOpen);
	};

	return (
		<>
			<header className="z-10 w-full h-[70px] px-6 flex justify-between items-center border-b border-[#E6E9EE] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
				<Link to="/" className="text-xl font-bold text-[#8B5CF6]">
					StudyHub
				</Link>
				<nav className="flex flex-row gap-6 text-[#6B7280] font-medium">
					<Link to="/search">검색</Link>
					<Link to="/posts">게시판</Link>
					<Link to="/groups">그룹</Link>
					{isLoggedIn ? (
						<>
							<button
								onClick={handleNotificationToggle}
								className="cursor-pointer flex items-center gap-2 hover:text-[#8B5CF6] transition-colors"
							>
								알림
							</button>
							<Link to="/msg/1">메시지</Link>
							<Link to="/profile/me">프로필</Link>
						</>
					) : (
						<></>
					)}
					<button className="cursor-pointer">다크모드</button>
				</nav>
			</header>

			{/* 알림 사이드바 */}
			<NotificationSidebar
				isOpen={isNotificationOpen}
				onClose={() => setIsNotificationOpen(false)}
			/>
		</>
	);
}
