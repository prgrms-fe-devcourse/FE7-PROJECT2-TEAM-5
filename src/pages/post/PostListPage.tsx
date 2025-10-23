// 게시글 리스트 페이지
import { useEffect, useState } from "react";
import PostTabContainer from "../../components/PostTabContainer";
import PostList from "../../components/PostList";
import PageNation from "../../components/PageNation";
import { usePostsStore } from "../../stores/postsStore";
import PostListSkeleton from "../../components/loading/post/PostListSkeleton";

export default function PostListPage() {
	const [activeTab, setActiveTab] = useState<string>("all");

	const tabs = [
		{ key: "all", label: "전체게시판" },
		{ key: "free", label: "자유게시판" },
		{ key: "elementary", label: "초등학생 게시판" },
		{ key: "middle", label: "중학교 게시판" },
		{ key: "high", label: "고등학교 게시판" },
		{ key: "resources", label: "자료 공유 게시판" },
	] as const;

	const posts = usePostsStore((state) => state.posts);
	const isLoading = usePostsStore((state) => state.isLoading);
	const fetchPosts = usePostsStore((state) => state.fetchPosts);

	useEffect(() => {
		fetchPosts(activeTab);
	}, [activeTab]);

	const postsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(posts.length / postsPerPage);

	const displayedPosts = posts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage,
	);

	if (isLoading)
		return (
			<div className="w-250 px-10">
				<PostListSkeleton />
			</div>
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
