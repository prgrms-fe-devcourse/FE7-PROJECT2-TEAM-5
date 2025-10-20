import { Heart, MessageSquare } from "lucide-react";
import type { Database } from "../../types/database";
import { useState } from "react";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { getAge } from "../../utils/getAge";
import { getGrade } from "../../utils/getGrade";

type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
	user: {
		nickname?: string;
		birth_date: Date;
		representative_badge_id: {
			badges: {
				name: string;
				icon_url: string;
			};
		};
	};
	comment_likes?: string[] | null;
};
type PostCommentsProps = {
	comments: Comment[] | null | undefined;
	postId: string | undefined;
};

export default function PostComments(props: PostCommentsProps) {
	const navigate = useNavigate();
	const [inputComment, setInputComment] = useState("");
	const [mention, setMention] = useState("");
	const user = useProfileStore((state) => state.currentUserId);

	const writeComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (inputComment.trim() === "") return;
		try {
			console.log(props.postId, user);
			const { data: commentData, error } = await supabase
				.from("comments")
				.insert([
					{
						post_id: props.postId,
						user_id: user,
						content: inputComment,
					},
				])
				.select();

			if (error) throw error;
			if (commentData) {
				alert("댓글이 등록되었습니다.");
				setInputComment("");
				navigate("/posts/" + props.postId);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const replyCounts: Record<string, string[]> = {};
	props.comments?.forEach((c) => {
		if (c.parent_comment_id) {
			if (!replyCounts[c.parent_comment_id]) {
				replyCounts[c.parent_comment_id] = [];
			}
			replyCounts[c.parent_comment_id].push(c.id);
		}
	});

	// const commentData = props.comments?.map((comment) => ({
	// 	...comment,
	// 	reply_count: replyCounts[comment.id] ? replyCounts[comment.id] : 0,
	// }));

	function Comment({ comment }: { comment: Comment }) {
		return (
			<div className="w-full px-4 py-3 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
				{/* 글 제목과 좋아요, 댓글 수 */}
				<div className="flex justify-between items-start mb-1">
					<div className="flex gap-1 items-center">
						<div className="w-[35px] h-[35px]">
							<img src="/src/assets/image.png" alt="userImg" />
						</div>
						<div>
							{comment.user.representative_badge_id && (
								<p className="text-xs font-medium">
									<img
										src={
											comment.user.representative_badge_id
												.badges.icon_url
										}
									/>
									{comment.user.representative_badge_id.badges
										.name ?? ""}
								</p>
							)}
							<p className="text-sm">
								{comment.user.nickname}
								<span className="text-xs text-[#6B7280] ml-1">
									{getGrade(getAge(comment.user.birth_date))}
								</span>
							</p>
						</div>
					</div>

					{/* 좋아요, 댓글 수 */}
					<div className="flex gap-3">
						{/* 좋아요 개수 표시*/}
						<button
							type="button"
							className="flex gap-1 items-top cursor-pointer"
						>
							<Heart color="red" size={15} className="mt-0.5" />
							<p className="text-[14px]">
								{comment.comment_likes?.length}
							</p>
						</button>
						{/* 댓글 개수 표시 */}
						{!comment.parent_comment_id && (
							<button
								type="button"
								className="flex gap-1 items-top cursor-pointer"
							>
								<MessageSquare
									color="#8B5CF6"
									size={15}
									className="mt-0.5"
								/>
								<p className="text-[14px]">
									{replyCounts[comment.id]?.length ?? 0}
								</p>
							</button>
						)}
						{comment.parent_comment_id && (
							<button
								type="button"
								className="flex gap-1 items-top"
							>
								<MessageSquare
									color="#8B5CF6"
									size={15}
									className="mt-0.5"
								/>
								<p className="text-[14px]">
									{replyCounts[comment.id].length}
								</p>
							</button>
						)}
					</div>
				</div>
				{/* 댓글 내용 */}
				<p className="mt-3 mb-2 text-sm font-Regular text-[#6B7280]">
					{comment.content}
				</p>
				{/* 답글 버튼, 작성일 */}
				{!comment.parent_comment_id && (
					<div className="flex justify-between">
						<button
							type="button"
							className="text-xs text-[#6B7280] cursor-pointer"
						>
							답글달기
						</button>
						<p className="text-xs text-[#6B7280]">
							{comment.created_at.slice(0, 10)}
						</p>
					</div>
				)}
				{comment.parent_comment_id && (
					<div className="flex justify-end">
						<p className="text-xs text-[#6B7280]">
							{comment.created_at}
						</p>
					</div>
				)}
			</div>
		);
	}

	function CommentItem({ comments }: { comments: Comment[] }) {
		return (
			<>
				{comments.map((comment) => (
					<div key={comment.id} className="flex flex-col gap-y-3">
						{/* 원 댓글 */}
						<Comment comment={comment} />

						{/* 대댓글 */}
						{replyCounts[comment.id]?.map((replyId) => {
							const replyComment = comments.find(
								(c) => c.id === replyId,
							);
							return replyComment ? (
								<Comment
									key={replyComment.id}
									comment={replyComment}
								/>
							) : null;
						})}
					</div>
				))}
			</>
		);
	}

	return (
		<>
			{(!props.comments || props.comments.length === 0) && (
				<div className="text-center text-gray-500 py-12">
					현재 게시물에 등록된 댓글이 없습니다.
				</div>
			)}
			{props.comments && props.comments.length > 0 && (
				<div className="flex flex-col gap-y-3 max-h-100 pr-2 overflow-y-auto ">
					{/* 댓글 1 */}
					<CommentItem comments={props.comments} />
				</div>
			)}
			<form className="flex gap-2 mt-4 w-full " onSubmit={writeComment}>
				<input
					type="textarea"
					placeholder="댓글을 작성해주세요."
					value={inputComment}
					onChange={(e) => setInputComment(e.target.value)}
					className="w-[696px] text-sm px-6 py-3 border-1 border-[#E5E7EB] rounded-xl focus:outline-none bg-white"
				/>
				<button
					type="submit"
					className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] cursor-pointer"
				>
					등록
				</button>
			</form>
		</>
	);
}
