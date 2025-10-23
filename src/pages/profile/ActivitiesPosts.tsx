import { useState } from "react";
import { Link } from "react-router";
import PageNation from "../../components/PageNation";
import { Heart, MessageSquare } from "lucide-react";
import { useActPostStore } from "../../stores/profileActivityStore";

export default function ActivitiesPosts() {
	const { userPosts } = useActPostStore();
	if (!userPosts) return <p>작성한 게시글이 없습니다.</p>;

	const postsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(userPosts.length / postsPerPage);

	const displayedPosts = userPosts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage,
	);

	return (
		<div>
			{/* 게시글 반복 */}
			{displayedPosts.map((post, idx) => (
				<Link to={`/posts/${post.id}`}>
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
										#{tag}
									</span>
								))}
							</div>
						</div>
						{/* right */}
						<div className="text-sm text-[#9CA3AF] flex flex-row items-start gap-1">
							<div>{post.created_at.slice(0, 10)}</div>
							<span>·</span>
							<div className="flex flex-row gap-1 items-center">
								<Heart color="red" size={15} />
								<span>
									{post.post_likes
										? post.post_likes.length
										: "0"}
								</span>
							</div>
							<span>·</span>
							<div className="flex flex-row gap-1 items-center">
								<MessageSquare color="#8B5CF6" size={15} />
								<span>
									{post.comments ? post.comments.length : "0"}
								</span>
							</div>
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
