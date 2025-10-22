import { useState } from "react";
import supabase from "../../utils/supabase";
import PostList from "../../components/PostList";
import type { Post } from "../../types/post";
import PageNation from "../../components/PageNation";
import type { Friend } from "../../types/friend";
import MemberCard from "../../components/MemberCard";

export default function SearchPage() {
	const [searchKeyword, setSearchKeyword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [searchPostResult, setSearchPostResult] = useState<Post[]>([]);
	const [searchUserResult, setSearchUserResult] = useState<User[]>([]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const keyword = searchKeyword.trim();
		if (!keyword || keyword === " ") {
			setSearchUserResult([]);
			setSearchPostResult([]);
			setIsLoading(false);
			return;
		}
		try {
			setIsLoading(true);
			if (keyword[0] === "@") {
				const { data: users, error: userError } = await supabase
					.from("users")
					.select("*")
					.ilike("nickname", "%" + keyword.slice(1) + "%")
					.order("is_online", { ascending: false });

				if (userError) throw userError;
				if (users) {
					setSearchUserResult(users);
				}

				//유사 닉네임을 가진 유저의 id와 동일한가 or 매개변수 맵핑
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
			} else if (keyword[0] === "#") {
				const { data: posts, error } = await supabase
					.from("posts")
					.select(
						"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
					)
					.is("group_id", null)
					.contains("hash_tag", [keyword.slice(1)])
					.order("created_at", { ascending: false });

				if (error) throw error;
				if (posts) {
					setSearchPostResult(posts);
					setSearchUserResult([]);
					setIsLoading(false);
				}
			} else {
				const { data: posts, error } = await supabase
					.from("posts")
					.select(
						"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
					)
					.is("group_id", null)
					.ilike("title", "%" + keyword + "%")
					.order("created_at", { ascending: false });

				if (error) throw error;
				if (posts) {
					setSearchPostResult(posts);
					setSearchUserResult([]);
					setIsLoading(false);
				}
			}
		} catch (e) {
			console.error(e);
		}
	};
	//그룹에 사용한 거 그냥 가져옴
	const users: Friend[] = searchUserResult.map((user) => ({
		id: crypto.randomUUID(),
		created_at: new Date().toISOString(),
		follower_id: "",
		following_id: user.auth_id,
		users: {
			auth_id: user.auth_id,
			nickname: user.nickname,
			profile_image_url: user.profile_image_url ?? null,
			is_online: user.is_online,
		},
	}));

	const [currentPage, setCurrentPage] = useState(1);
	const resultPerPage = 4;
	const totalPages = Math.ceil(
		((users.length ?? 0) + (searchPostResult.length ?? 0)) / resultPerPage,
	);
	console.log("슬라이스 시작", searchPostResult, searchUserResult);
	// // 현재 노출되는 게시글, 유저 아이템
	let displayedUsers: Friend[] = [];
	let displayedPosts: Post[] = [];

	const userPageCount = Math.ceil(users.length / resultPerPage);
	if (currentPage > userPageCount) {
		displayedPosts = searchPostResult.slice(
			(currentPage - 1) * resultPerPage - users.length,
			currentPage * resultPerPage - users.length,
		);
	} else if (currentPage === userPageCount) {
		displayedUsers = users.slice((currentPage - 1) * resultPerPage);

		displayedPosts = searchPostResult.slice(
			((currentPage === 0 ? 2 : currentPage) - 1) * resultPerPage -
				users.length +
				(users.length % resultPerPage),
			(currentPage === 0 ? 1 : currentPage) * resultPerPage -
				users.length,
		);
	} else {
		displayedUsers = users.slice(
			(currentPage - 1) * resultPerPage,
			currentPage * resultPerPage,
		);
	}

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
						{/* 검색 결과가 없을 때 */}
						{users.length === 0 &&
							searchPostResult.length === 0 && (
								<div className="text-center text-gray-500 py-12">
									검색 결과가 없습니다.
								</div>
							)}
						{/* 멤버 영역 */}
						{displayedUsers.length > 0 &&
							displayedUsers.map((user) => (
								<div
									key={user.id}
									className="bg-white rounded-xl mb-2"
								>
									<MemberCard friend={user} />
								</div>
							))}
						{/* 게시판 영역 */}
						{displayedPosts.length > 0 && (
							<PostList posts={displayedPosts} />
						)}
						{/* 페이지 네이션 */}
						<PageNation
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
						/>
					</div>
				)}
			</div>
		</>
	);
}
