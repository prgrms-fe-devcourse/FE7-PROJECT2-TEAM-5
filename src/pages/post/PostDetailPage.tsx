import { Heart, MoveLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import supabase from "../../utils/supabase";
import PostComments from "./PostComments";
import { useProfileStore } from "../../stores/profileStore";
import { usePostStore } from "../../stores/postStore";
import PostDetailSkeleton from "../../components/loading/post/PostDetailSkeleton";
import Button from "../../components/Button";

// 게시글 세부 페이지
export default function PostDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const isLoading = usePostStore((state) => state.isLoading);
	const postData = usePostStore((state) => state.post);
	const isLiked = usePostStore((state) => state.isLiked);
	const comments = usePostStore((state) => state.comments);
	const fetchPost = usePostStore((state) => state.fetchPost);
	const updateLike = usePostStore((state) => state.updateLike);

	useEffect(() => {
		const loadPost = async () => {
			if (id && currentUserId) {
				await fetchPost(id, currentUserId);
			}
		};
		loadPost();
	}, [id, currentUserId]);

	const pressLike = () => {
		if (!currentUserId) {
			alert("로그인이 필요합니다.");
			navigate("/login");
			return;
		}
		if (
			postData?.post_likes?.some(
				(like) => like.user_id === currentUserId,
			) ||
			isLiked === true
		) {
			alert("이미 좋아요를 눌렀습니다.");
			return;
		}
		if (id) {
			updateLike(id, currentUserId);
			alert("좋아요 완료");
		}
	};

	const deletePost = async () => {
		console.log(postData?.id);
		try {
			const { error } = await supabase
				.from("posts")
				.delete()
				.eq("id", postData?.id);
			if (error) throw error;
			alert("게시물이 삭제되었습니다");
			navigate("/posts");
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<>
			{isLoading ? (
				<PostDetailSkeleton />
			) : (
				<>
					<div className="max-w-[1200px] h-[750px] flex flex-row gap-15 overflow-hidden">
						{/* Left */}
						<div className="max-w-[800px] w-[760px]">
							{/* Top */}
							<div className="flex flex-row justify-between">
								<Link
									to={"/posts"}
									className="flex flex-row relative group px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] cursor-pointer overflow-hidden"
								>
									<MoveLeft size={20} />
									<span className="ml-1 inline-block transition-all duration-300 ease-in-out max-w-0 overflow-hidden align-middle group-hover:max-w-xs whitespace-nowrap">
										게시판으로 돌아가기
									</span>
								</Link>
								{/* 작성자만 보이는 수정, 삭제 버튼 */}
								{postData?.user_id === currentUserId && (
									<div className="flex gap-2">
										<Link
											to={"/posts/create/" + id}
											className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] cursor-pointer"
										>
											수정
										</Link>
										<button
											type="button"
											onClick={() => {
												deletePost();
											}}
											className="px-4 py-2.5 text-sm text-[#8B5CF6] rounded-xl bg-white border-1 border-[#8B5CF6] cursor-pointer"
										>
											삭제
										</button>
									</div>
								)}
							</div>
							<div className="group mt-5 h-[700px] overflow-y-auto scrollbar-custom">
								<div className="flex flex-row items-center justify-between">
									{/* 글 제목 */}
									<h1 className="font-bold text-[32px] text-[#8B5CF6]">
										{postData?.title}
									</h1>
									<Button
										className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform"
										type="button"
										onClick={() => {
											pressLike();
										}}
									>
										{isLiked ? (
											<Heart
												color="white"
												size={40}
												className="p-2 bg-[#EA489A] border-1 border-[#EA489A] rounded-4xl"
											/>
										) : (
											<Heart
												color="#EA489A"
												size={40}
												className="p-2 bg-white border-1 border-[#EA489A] rounded-4xl"
											/>
										)}
									</Button>
								</div>
								{/* 작성자, 작성일 */}
								<p className="mt-2 text-sm text-[#6B7280]">
									작성자: {postData?.user?.nickname} |{" "}
									{postData?.created_at.slice(0, 10)}
								</p>
								{/* 본문 */}
								<div className="my-8">
									<pre>{postData?.content}</pre>
									<div className="mt-2">
										{postData?.files?.map((file) => (
											<img
												key={file.file_path}
												src={file.file_path}
												alt={file.file_name}
												className="max-h-80"
											/>
										))}
									</div>
								</div>
								{/* 해시태그 */}
								<div className="flex gap-2">
									{postData?.hash_tag?.map((tag, idx) => (
										<div
											key={idx}
											className="px-2 py-1 rounded-lg bg-[#EDE9FE] font-Regular text-xs text-[#8B5CF6]"
										>
											#{tag}
										</div>
									))}
								</div>
							</div>
						</div>
						{/* Right */}
						<div className="w-[500px]">
							{/* 댓글 영역 */}
							<PostComments
								comments={comments}
								postId={id}
								adopted_comment_id={
									postData?.adopted_comment_id ?? null
								}
								writerId={postData?.user_id}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
}
