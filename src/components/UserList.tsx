import { ChevronDown } from "lucide-react";
import UserListCard from "./UserListCard";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useSetOnlineStatus } from "../hooks/useSetOnlineStatus";
import { useOnlineUsers } from "../hooks/useOnlineUsers";

export default function UserList({
	currentUserId,
}: {
	currentUserId: string | null;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const { userList } = useOnlineUsers();

	useSetOnlineStatus(currentUserId ? currentUserId : "");

	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname]);

	console.log(userList);

	return (
		<div className="fixed left-10 bottom-0 w-90 bg-white rounded-t-xl flex flex-col">
			{/* 헤더 */}
			<div
				className="cursor-pointer flex flex-row justify-between items-center px-5 py-3 w-full bg-violet-500 rounded-t-xl"
				onClick={() => setIsOpen(!isOpen)}
			>
				<h3 className="text-lg text-white font-bold">온라인 사용자</h3>
				<ChevronDown
					className={`text-white transition-transform duration-300 ${
						isOpen ? "rotate-0" : "rotate-180"
					}`}
					size={28}
					strokeWidth={3}
				/>
			</div>

			{/* 슬라이딩 리스트 */}
			<div
				className={` transition-all duration-500 ease-in-out ${
					isOpen ? "h-160 overflow-y-auto" : "h-0 overflow-y-hidden"
				}`}
			>
				<div className="flex flex-col">
					{userList.map((user) => (
						<UserListCard key={user.auth_id} user={user} />
					))}
				</div>
			</div>
		</div>
	);
}
