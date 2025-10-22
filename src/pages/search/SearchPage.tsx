import { useState } from "react";
import supabase from "../../utils/supabase";
import PostList from "../../components/PostList";
import type { Post } from "../../types/post";
import PageNation from "../../components/PageNation";
import type { Friend } from "../../types/friend";
import MemberCard from "../../components/MemberCard";
// import { useMemberStore } from "../../stores/memberStore";
import { useProfileStore } from "../../stores/profileStore";

export default function SearchPage() {
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [searchPostResult, setSearchPostResult] = useState<Post[]>([]);
	const [searchUserResult, setSearchUserResult] = useState<User[]>([]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setSearchKeyword(searchKeyword.trim());
		if (!searchKeyword || searchKeyword === " ") {
			setSearchPostResult([]);
			setIsLoading(false);
			return;
		}
		try {
			setIsLoading(true);
			if (searchKeyword[0] === "@") {
				const { data: users, error: userError } = await supabase
					.from("users")
					.select("*")
					.ilike("nickname", "%" + searchKeyword.slice(1) + "%");

				if (userError) throw userError;
				if (users) {
					setSearchUserResult(users);
					setIsLoading(false);
				}

				const nicfilter = users
					.map((user) => `user_id.eq.${user.auth_id}`)
					.join(",");

				const { data: posts, error: postError } = await supabase
					.from("posts")
					.select(
						"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
					)
					.is("group_id", null)
					.or(nicfilter)
					.order("created_at", { ascending: false });

				if (postError) throw postError;
				if (posts) {
					setSearchPostResult(posts);
					setIsLoading(false);
				}
			} else if (searchKeyword[0] === "#") {
				const { data: posts, error } = await supabase
					.from("posts")
					.select(
						"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
					)
					.is("group_id", null)
					.contains("hash_tag", [searchKeyword.slice(1)])
					.order("created_at", { ascending: false });

				if (error) throw error;
				if (posts) {
					setSearchPostResult(posts);
					setIsLoading(false);
				}
			} else {
				const { data: posts, error } = await supabase
					.from("posts")
					.select(
						"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
					)
					.is("group_id", null)
					.ilike("title", "%" + searchKeyword + "%")
					.order("created_at", { ascending: false });

				if (error) throw error;
				if (posts) {
					setSearchPostResult(posts);
					setIsLoading(false);
				}
			}
		} catch (e) {
			console.error(e);
		}
	};
	console.log(searchPostResult, searchUserResult);
	const users: Friend[] = searchUserResult.map((user) => ({
		id: crypto.randomUUID(), // 임의 id
		created_at: new Date().toISOString(), // 임의 created_at
		follower_id: "", // 그룹 멤버라서 팔로우 정보 없음
		following_id: user.auth_id,
		users: {
			auth_id: user.auth_id,
			nickname: user.nickname,
			profile_image_url: user.profile_image_url ?? null,
			is_online: user.is_online,
		},
	}));

	// const [currentPage, setCurrentPage] = useState(1);
	// const resultPerPage = 4;
	// const totalPages = Math.ceil(
	// 	(users.length ?? 0 + searchPostResult.length) / resultPerPage,
	// );

	// // 현재 노출되는 유저 아이템
	// let displayedUsers: Friend[] = [];
	// if (currentPage >= users.length / resultPerPage + 1) {
	// 	displayedUsers = [];
	// } else if (currentPage * resultPerPage > users.length) {
	// 	displayedUsers = users.slice((currentPage - 1) * resultPerPage);
	// } else {
	// 	displayedUsers = users.slice(
	// 		(currentPage - 1) * resultPerPage,
	// 		currentPage * resultPerPage,
	// 	);
	// }

	// //걸친 구간 남은 아이템 수 계산
	// let userRestItemIdx = 0;
	// if (currentPage === users.length / resultPerPage + 1)
	// 	userRestItemIdx = users.length % resultPerPage;

	// // 현재 노출되는 게시글 아이템
	// let displayedPosts: Post[] = [];
	// if (currentPage < users.length / resultPerPage + 1) {
	// 	displayedUsers = [];
	// } else {
	// 	displayedPosts = searchPostResult.slice(
	// 		(currentPage - 1) * resultPerPage - users.length + userRestItemIdx,
	// 		currentPage * resultPerPage - users.length,
	// 	);
	// }

	const handleUnfollow = (friendId: string) => {
		if (currentUserId) {
			console.log(friendId + "팔로우 취소");
		}
	};
	return (
		<>
			<div className="mx-auto">
				<h1 className="font-bold text-[24px] text-[#8B5CF6] mb-[15px] ">
					검색
				</h1>
				{/*검색 바와 검색 버튼*/}
				<form
					className="flex rounded-xl shadow-[0_3px_6px_rgba(0,0,0,0.05)] "
					onSubmit={handleSubmit}
				>
					<input
						type="textarea"
						id="serchBar"
						value={searchKeyword}
						onChange={(e) => setSearchKeyword(e.target.value)}
						placeholder="게시글 제목, @이름, #해시태그 검색 가능..."
						className="w-[862px] text-[14px] px-6 py-4 focus:outline-none rounded-l-xl bg-white"
					/>
					<button
						type="submit"
						className="p-4 rounded-r-xl bg-[#8B5CF6]
                        text-white font-Medium text-[14px] hover:bg-[#B08DFF] cursor-pointer"
					>
						검색
					</button>
				</form>

				{/* 검색 결과 영역 */}
				{isLoading && (
					<div className="border-t border-gray-300 mt-2 pt-6">
						로딩중...
					</div>
				)}
				{!isLoading && (
					<div className="border-t border-gray-300 mt-2 pt-6">
						{/* 멤버 영역 */}
						{users.length > 0 &&
							users.map((user) => (
								<div className="bg-white rounded-xl mb-2">
									<MemberCard
										friend={user}
										onUnfollow={handleUnfollow}
									/>
								</div>
							))}
						{/* 게시판 영역 */}
						{searchPostResult.length > 0 && (
							<PostList
								posts={searchPostResult}
								isSearchPage={true}
							/>
						)}
						{/* 페이지 네이션 */}
						{/* <PageNation
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
						/> */}
					</div>
				)}
			</div>
		</>
	);
}
