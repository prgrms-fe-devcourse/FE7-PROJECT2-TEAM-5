import { useState } from "react";
import { Link } from "react-router";
import PageNation from "../../components/PageNation";
import type { Post } from "../../types/post";

export default function ActivitiesPosts({ posts }: { posts: Post[] }) {
	if (!posts.length) return <p>작성한 게시글이 없습니다.</p>;

	const postsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(posts.length / postsPerPage);

	const displayedPosts = posts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage,
	);

	return (
		<div>
			{/* 게시글 반복 */}
			{displayedPosts.map((post, idx) => (
				<Link to={`/post/${post.id}`}>
					<div
						key={post.id}
						className={`p-4 flex flex-row justify-between ${
							idx > 0 ? "border-t border-[#E5E7EB]" : ""
						}`}
					>
						{/* left */}
						<div className="flex flex-col gap-1">
							<p className="font-bold text-lg">{post.title}</p>
							<p className="text-gray-500">{post.content}</p>
							<div className="mt-1.5 flex flex-row items-center gap-1">
								{post.hash_tag!.map((tag, index) => (
									<span
										key={index}
										className="px-2 py-1 bg-[#F291C2] rounded-full text-white text-xs"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
						{/* right */}
						<div className="text-sm text-[#9CA3AF]">
							2025-09-20 · 좋아요 12 · 댓글 5
						</div>
					</div>
				</Link>
			))}

			{/* 페이지네이션 */}
			<PageNation
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
