// 게시글 리스트 페이지
import { useEffect, useState } from "react";
import PostTabContainer from "../../components/PostTabContainer";
import PostList from "../../components/PostList";
import PageNation from "../../components/PageNation";
import type { Database } from "../../types/database";
import supabase from "../../utils/supabase";
// import PageNation from "../../components/PageNation";

type Post = Database["public"]["Tables"]["posts"]["Row"];
export default function PostListPage() {
	const [activeTab, setActiveTab] = useState<string>("all");

	const tabs = [
		{ key: "all", label: "전체게시판" },
		{ key: "free", label: "자유게시판" },
		{ key: "elementary", label: "초등학생 게시판" },
		{ key: "middle", label: "중학교 게시판" },
		{ key: "high", label: "고등학교 게시판" },
	] as const;

	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const getPosts = async () => {
			setIsLoading(true);
			if (activeTab === "all") {
				try {
					const { data: posts, error } = await supabase
						.from("posts")
						.select(
							"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
						)
						.order("created_at", { ascending: false });

					if (error) throw error;
					setPosts(posts);
				} catch (e) {
					console.error(e);
				} finally {
					setIsLoading(false);
				}
			} else {
				try {
					const { data: posts, error } = await supabase
						.from("posts")
						.select(
							"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
						)
						.eq("board_type", activeTab)
						.order("created_at", { ascending: false });

					if (error) throw error;
					setPosts(posts);
				} catch (e) {
					console.error(e);
				} finally {
					setIsLoading(false);
				}
			}
			console.log(posts);
		};
		getPosts();
	}, [activeTab]);

	const postsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(posts.length / postsPerPage);

	const displayedPosts = posts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage,
	);

	return (
		<>
			<div className="w-[920px]">
				<PostTabContainer
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					title="게시판"
					tabs={tabs}
				/>
				{!isLoading && (
					<>
						{/* 게시판 영역 */}
						<div className="border-t border-gray-300 mt-2 pt-6">
							<PostList posts={displayedPosts} />
						</div>

						{/* <PageNation /> */}
						<PageNation
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
						/>
					</>
				)}
			</div>
		</>
	);
}
