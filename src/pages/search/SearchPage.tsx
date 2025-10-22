import { useState } from "react";
import supabase from "../../utils/supabase";
import PostList from "../../components/PostList";
import type { Post } from "../../types/post";
import PageNation from "../../components/PageNation";
export default function SearchPage() {
	const [searchKeyword, setSearchKeyword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [searchResult, setSearchResult] = useState<Post[]>([]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setSearchKeyword(searchKeyword.trim());
		if (!searchKeyword || searchKeyword === " ") {
			setSearchResult([]);
			setIsLoading(false);
			return;
		}
		try {
			setIsLoading(true);
			if (searchKeyword[0] === "@") {
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
					setSearchResult(posts);
					setIsLoading(false);
				}
			} else if (searchKeyword[0] === "#") {
				const { data: posts, error } = await supabase
					.from("posts")
					.select(
						"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
					)
					.is("group_id", null)
					.contains("hash_tag", [searchKeyword])
					.order("created_at", { ascending: false });

				if (error) throw error;
				if (posts) {
					setSearchResult(posts);
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
					setSearchResult(posts);
					setIsLoading(false);
				}
			}
		} catch (e) {
			console.error(e);
		}
	};

	const postsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(searchResult.length / postsPerPage);

	const displayedPosts = searchResult.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage,
	);

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
						{/* 게시판 영역 */}
						<PostList posts={displayedPosts} isSearchPage={true} />
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
