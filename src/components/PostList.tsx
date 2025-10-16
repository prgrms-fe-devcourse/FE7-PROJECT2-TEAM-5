import { Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router";

type Post = {
	id: number;
	title: string;
	content: string;
	author: string;
	likes: number;
	comments: number;
	tags: string[];
	date: string;
};

type PostListProps = {
	posts: Post[];
};

function PostItem({ post }: { post: Post }) {
	return (
		<Link to={`/post/${post.id}`}>
			<div className="w-full mb-2 px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)] transition-shadow">
				{/* 제목 + 좋아요/댓글 */}
				<div className="flex justify-between items-start mb-1">
					<div>
						<h2 className="text-[18px] font-bold text-[#8B5CF6]">
							{post.title}
						</h2>
						<p className="text-[14px] font-Regular text-[#1F2937]">
							작성자: {post.author}
						</p>
					</div>
					<div className="flex gap-3">
						<div className="flex gap-1 items-center">
							<Heart color="red" size={15} />
							<p className="text-[14px]">{post.likes}</p>
						</div>
						<div className="flex gap-1 items-center">
							<MessageSquare color="#8B5CF6" size={15} />
							<p className="text-[14px]">{post.comments}</p>
						</div>
					</div>
				</div>

				{/* 내용 */}
				<p className="text-xs font-Regular text-[#6B7280] line-clamp-2 mb-3">
					{post.content}
				</p>

				{/* 해시태그 + 날짜 */}
				<div className="flex justify-between items-end">
					<div className="flex flex-wrap gap-2">
						{post.tags.map((tag, idx) => (
							<div
								key={idx}
								className="px-2 py-1 rounded-lg bg-[#EDE9FE] font-Regular text-xs text-[#8B5CF6]"
							>
								#{tag}
							</div>
						))}
					</div>
					<p className="text-[14px] text-[#6B7280]">{post.date}</p>
				</div>
			</div>
		</Link>
	);
}

export default function PostList({ posts }: PostListProps) {
	if (posts.length === 0) {
		return (
			<div className="text-center text-gray-500 py-12">
				게시글이 없습니다.
			</div>
		);
	}

	return (
		<div className="w-full">
			{posts.map((post) => (
				<PostItem key={post.id} post={post} />
			))}
		</div>
	);
}
