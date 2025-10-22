import { Heart, MessageSquare, Smile } from "lucide-react";
import type { Comment } from "../../types/comment";
import { useEffect, useRef, useState } from "react";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";
import { getAge } from "../../utils/getAge";
import { getGrade } from "../../utils/getGrade";
import { useNavigate } from "react-router";
import basicImage from "../../assets/basic_image.png";
import Button from "../../components/Button";

type PostCommentsProps = {
	comments: Comment[] | null;
	postId: string | undefined;
	adopted_comment_id: string | null;
	writerId: string | undefined;
};

export default function PostComments(props: PostCommentsProps) {
	const navigate = useNavigate();
	const [inputComment, setInputComment] = useState("");
	const [mention, setMention] = useState({
		nickname: "",
		userId: "",
		commentId: "",
	});
	const currentUserId = useProfileStore((state) => state.currentUserId);

	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const emojiPickerRef = useRef<HTMLDivElement | null>(null);

	const emojis = [
		"😀",
		"😃",
		"😄",
		"😁",
		"😆",
		"😅",
		"😂",
		"🤣",
		"😊",
		"😇",
		"🙂",
		"🙃",
		"😉",
		"😌",
		"😍",
	];

	const addEmoji = (emoji: string) => {
		setInputComment(inputComment + emoji);
		setShowEmojiPicker(false);
	};

	// 이모지 창 바깥 영역 클릭 시 닫음
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				emojiPickerRef.current &&
				!emojiPickerRef.current.contains(event.target as Node)
			) {
				setShowEmojiPicker(false);
			}
		};

		if (showEmojiPicker) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showEmojiPicker]);

	const writeComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!currentUserId) {
			alert("로그인이 필요합니다.");
			navigate("/login");
			return;
		}
		if (inputComment.trim() === "") return;
		try {
			if (!mention.userId) {
				const { data: commentData, error } = await supabase
					.from("comments")
					.insert([
						{
							post_id: props.postId,
							user_id: currentUserId,
							content: inputComment,
						},
					])
					.select();

				if (error) throw error;
				if (commentData) {
					alert("댓글이 등록되었습니다.");
					setInputComment("");
					location.reload();
				}
			} else {
				const { data: commentData, error } = await supabase
					.from("comments")
					.insert([
						{
							post_id: props.postId,
							user_id: currentUserId,
							content: inputComment,
							parent_comment_id: mention.commentId,
						},
					])
					.select();

				if (error) throw error;
				if (commentData) {
					alert("댓글이 등록되었습니다.");
					setInputComment("");
					location.reload();
				}
			}
		} catch (e) {
			console.error(e);
		}
	};

	//답글 개수 데이터
	const replyCounts: Record<string, string[]> = {};
	props.comments?.forEach((c) => {
		if (c.parent_comment_id) {
			if (!replyCounts[c.parent_comment_id]) {
				replyCounts[c.parent_comment_id] = [];
			}
			replyCounts[c.parent_comment_id].push(c.id);
		}
	});

	//댓글 좋아요 기능
	const pressLike = async (comment: Comment) => {
		if (!currentUserId) {
			alert("로그인이 필요합니다.");
			navigate("/login");
			return;
		}
		if (
			currentUserId &&
			comment?.comment_likes?.some(
				(like) => like.user_id === currentUserId,
			)
		) {
			alert("이미 좋아요를 눌렀습니다.");
			return;
		}
		try {
			const { data, error } = await supabase
				.from("comment_likes")
				.insert([{ user_id: currentUserId, comment_id: comment?.id }])
				.select();
			if (error) throw error;
			if (data) {
				alert("좋아요 완료");
				location.reload();
			}
		} catch (error) {
			console.error(error);
		}
	};

	//답글 쓰기 기능
	const createMention = (comment: Comment) => {
		if (comment.user?.nickname) {
			setMention({
				nickname: comment.user.nickname,
				userId: comment.user.auth_id,
				commentId: comment.id,
			});
		}
	};

	//답글 대상자 지우기 (input에 값이 아무것도 없고 백스페이스를 누를 경우 작동)
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Backspace" && !inputComment) {
			setMention({ nickname: "", userId: "", commentId: "" });
		}
	};

	//채택 기능
	const adoptComment = async (comment: Comment) => {
		try {
			const { data, error } = await supabase
				.from("posts")
				.update({ adopted_comment_id: comment.id })
				.eq("id", props.postId)
				.select();
			if (error) throw error;
			if (data) {
				alert("채택되었습니다.");

				location.reload();
			}
		} catch (e) {
			console.error(e);
		}
	};

	function Comment({ comment }: { comment: Comment }) {
		console.log(comment);
		const adoptedStyle =
			props.adopted_comment_id === comment.id &&
			"border-1 border-[#EA489A]";
		// if (props.adopted_comment_id === comment.id) {
		// 	adoptedStyle = "border-[#EA489A]";
		// }
		return (
			<div
				className={
					"relative z-10 group w-full px-4 py-3 mt-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] " +
					adoptedStyle
				}
			>
				{/* 작성자가 아니거나, 작성자가 작성한 댓글이거나, 이미 채택된 댓글이 있으면 hover되지 않음. */}
				{!(currentUserId === comment.user_id) &&
					currentUserId === props.writerId &&
					!props.adopted_comment_id && (
						<Button
							type="button"
							onClick={() => adoptComment(comment)}
							className="absolute -top-4 right-4 z-10 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-[#8B5CF6] hover:text-white px-3 py-1 text-xs border-1 border-[#8B5CF6] rounded-2xl bg-white"
						>
							채택
						</Button>
					)}

				{props.adopted_comment_id === comment.id && (
					<span className="flex items-center absolute -top-4 left-4 z-10 px-3 py-1 text-xs rounded-2xl bg-linear-to-r text-white from-[#EA489A] to-[#FF84C2]">
						채택된 댓글
						<img
							src="/src/assets/fire.png"
							className="ml-0.5 mb-0.5"
						/>
					</span>
				)}
				{/* 글 제목과 좋아요, 댓글 수 */}
				<div className="flex justify-between items-start mb-1">
					<div className="flex gap-1 items-center">
						<div className="w-[35px] h-[35px] object-cover">
							<img
								className="w-full h-full rounded-full"
								src={
									comment.user?.profile_image_url ??
									basicImage
								}
								alt="userImg"
							/>
						</div>
						<div>
							{comment.user?.representative_badge_id && (
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
								{comment.user?.nickname}
								<span className="text-xs text-[#6B7280] ml-1">
									{getGrade(getAge(comment.user?.birth_date))}
								</span>
							</p>
						</div>
					</div>

					{/* 좋아요, 댓글 수 */}
					<div className="flex gap-3">
						{/* 좋아요 개수 표시*/}
						<button
							type="button"
							onClick={() => pressLike(comment)}
							className="flex gap-1 items-start cursor-pointer"
						>
							<Heart color="red" size={15} className="mt-0.5 " />
							<p className="text-[14px]">
								{comment.comment_likes?.length}
							</p>
						</button>
						{/* 댓글 개수 표시 */}
						{!comment.parent_comment_id && (
							<button
								type="button"
								onClick={() => createMention(comment)}
								className="flex gap-1 items-start cursor-pointer"
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
					</div>
				</div>
				{/* 댓글 내용 */}
				<p className="mt-3 mb-2 text-sm font-Regular text-[#6B7280]">
					{comment.parent_comment_id && (
						<span className="text-[#8B5CF6] text-sm mr-1 font-medium">
							@{comment.parentNickname}
						</span>
					)}
					{comment.content}
				</p>
				{/*작성일 */}

				<div className="flex justify-end">
					<p className="text-xs text-[#6B7280]">
						{comment.created_at.slice(0, 10)}
					</p>
				</div>
			</div>
		);
	}

	function CommentItem({ comments }: { comments: Comment[] }) {
		return (
			<>
				{comments.map((comment) => (
					<div key={comment.id} className="flex flex-col">
						{/* 원 댓글 */}
						{!comment.parent_comment_id && (
							<Comment comment={comment} />
						)}

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

	const adoptedComment = props.comments?.filter(
		(c) => c.id === props.adopted_comment_id,
	);

	return (
		<>
			<div className="h-full flex flex-col justify-between">
				{/* 댓글이 없는 경우 */}
				{!props.comments || props.comments.length === 0 ? (
					<div className="text-center text-gray-500 py-12">
						현재 게시물에 등록된 댓글이 없습니다.
					</div>
				) : (
					<div className="flex flex-col pr-2 overflow-y-auto scrollbar-custom">
						{/* 채택된 댓글 */}
						{adoptedComment && adoptedComment[0] && (
							<Comment comment={adoptedComment[0]} />
						)}
						{adoptedComment?.length === 0 && (
							<div className="text-center text-gray-500 py-10">
								채택된 댓글이 없습니다.
							</div>
						)}
						<div className="border-t border-gray-300 mt-3.5" />

						{/* 일반 댓글 */}
						<CommentItem comments={props.comments} />
					</div>
				)}

				{/* 댓글 작성 폼 */}
				<form
					className="flex gap-2 mt-4 w-full"
					onSubmit={writeComment}
				>
					<div className="relative flex-1 text-sm px-6 py-3 border-1 border-[#E5E7EB] rounded-xl bg-white">
						{mention.nickname && (
							<span className="text-[#8B5CF6] text-sm mr-1 font-medium">
								@{mention.nickname}
							</span>
						)}
						<input
							placeholder="댓글을 작성해주세요."
							value={inputComment}
							onChange={(e) => setInputComment(e.target.value)}
							onKeyDown={handleKeyDown}
							className="w-full focus:outline-none"
						/>
						{/* 이모지 버튼 */}
						<Button
							type="button"
							className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5CF6]"
							onClick={() => setShowEmojiPicker((prev) => !prev)}
						>
							<Smile size={20} />
						</Button>

						{/* 이모지 피커 */}
						{showEmojiPicker && (
							<div
								ref={emojiPickerRef}
								className="absolute z-30 bottom-full right-0 mb-2 bg-white border rounded-lg shadow-md p-2 grid grid-cols-10 gap-1"
							>
								{emojis.map((emoji) => (
									<Button
										key={emoji}
										type="button"
										onClick={() => addEmoji(emoji)}
										className="text-lg hover:bg-gray-100 rounded p-1"
									>
										{emoji}
									</Button>
								))}
							</div>
						)}
					</div>

					<Button
						type="submit"
						className="px-4 py-2 text-sm text-white rounded-xl bg-[#8B5CF6]"
					>
						등록
					</Button>
				</form>
			</div>
		</>
	);
}
