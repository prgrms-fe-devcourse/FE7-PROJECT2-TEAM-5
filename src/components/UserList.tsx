import { ChevronDown } from "lucide-react";
import UserListCard from "./UserListCard";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function UserList() {
	const [isOpen, setIsOpen] = useState(false);

	const [users, setUsers] = useState<any[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const { data, error } = await supabase
					.from("users")
					.select("*");
				if (error) throw error;
				setUsers(data || []);
			} catch (err) {
				console.error("유저 목록 로딩 오류:", err);
			}
		};
		fetchUsers();
	}, []);

	/* 필요한 정보 */
	/* 프로필 이미지, 이름, 소속, 학년(전공 과목), auth_id */
	return (
		<div className="absolute left-10 bottom-0 w-90 bg-white rounded-t-xl flex flex-col">
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
				className={`overflow-y-auto transition-all duration-500 ease-in-out pb-4 ${
					isOpen ? "h-160" : "h-0"
				}`}
			>
				<div className="flex flex-col">
					{users.map((user) => (
						<UserListCard key={user.auth_id} user={user} />
					))}
				</div>
			</div>
		</div>
	);
}
