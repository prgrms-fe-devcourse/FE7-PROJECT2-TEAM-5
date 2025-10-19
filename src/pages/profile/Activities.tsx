import { useEffect, useState } from "react";
import ActivitiesTab from "./ActivitiesTab";
import ActivitiesPosts from "./ActivitiesPosts";
import ActivitiesComments from "./ActivitiesComments";
import { usePostStore } from "../../stores/postStore";
import type { Post } from "../../types/post";
import type { Comment } from "../../types/comment";

export default function Activities({ userId }: { userId: string }) {
	const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
	const { allPosts, allComments } = usePostStore();
	const [userPosts, setUserPosts] = useState<Post[]>([]);
	const [userComments, setUserComments] = useState<Comment[]>([]);

	// userId와 같은 user_id를 가진 게시글, 댓글만 필터링
	useEffect(() => {
		if (allPosts && allComments && userId) {
			const filteredPosts = allPosts.filter(
				(post) => post.user_id === userId,
			);

			const filteredComments = allComments.filter(
				(comment) => comment.user_id === userId,
			);

			setUserPosts(filteredPosts);
			setUserComments(filteredComments);
		}
	}, [allPosts, allComments, userId]);

	return (
		<div>
			<h3 className="text-xl font-bold text-violet-500 pb-2">
				활동 내역
			</h3>

			{/* 탭 버튼 + 내용 */}
			<ActivitiesTab activeTab={activeTab} setActiveTab={setActiveTab} />

			{/* 탭 내용 */}
			<div className="mt-4">
				{activeTab === "posts" ? (
					<ActivitiesPosts posts={userPosts} />
				) : (
					<ActivitiesComments comments={userComments} />
				)}
			</div>
		</div>
	);
}
