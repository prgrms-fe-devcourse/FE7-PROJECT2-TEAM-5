import { Link } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { useState } from "react";
import NotificationSidebar from "../NotificationSidebar";
import { useNotifications } from "../../hooks/useNotifications";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";

export default function Header() {
	const isLoggedIn = useProfileStore((state) => state.isLoggedIn);
	const { notifications } = useNotifications();
	const { hasUnreadMessages } = useUnreadMessages();
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
							{/* 알림 */}
							<button
								onClick={handleNotificationToggle}
								className="cursor-pointer flex items-center gap-2 hover:text-[#8B5CF6] transition-colors relative"
							>
								알림
								{notifications.length > 0 && (
									<div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse"></div>
								)}
							</button>
							{/* 메시지 */}
							<Link
								to="/msg"
								className="cursor-pointer flex items-center gap-2 hover:text-[#8B5CF6] transition-colors relative"
							>
								메시지
								{/* 레드닷 */}
								{hasUnreadMessages && (
									<div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse"></div>
								)}
							</Link>
							<Link to="/profile/me">프로필</Link>
						</>
					) : (
						<></>
					)}
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
