import { Heart, MoveLeft, Download, File } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import PostComments from "./PostComments";
import { useProfileStore } from "../../stores/profileStore";
import { usePostStore } from "../../stores/postStore";
import PostDetailSkeleton from "../../components/loading/post/PostDetailSkeleton";
import Button from "../../components/Button";
import supabase from "../../utils/supabase";
import { downloadFile, getFileUrl } from "../../utils/fileDownload";

// 게시글 세부 페이지
export default function PostDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const profile = useProfileStore((state) => state.profile);
	const isLoading = usePostStore((state) => state.isLoading);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const postData = usePostStore((state) => state.post);
	const isLiked = usePostStore((state) => state.isLiked);
	const comments = usePostStore((state) => state.comments);
	const fetchPost = usePostStore((state) => state.fetchPost);
	const updateLike = usePostStore((state) => state.updateLike);
	const deletePost = usePostStore((state) => state.deletePost);
	const resetPostStore = usePostStore((state) => state.resetPostStore);

	// 파일 다운로드 권한 확인 함수
	const canDownloadFile = () => {
		// 선생님만 파일을 다운로드할 수 있음
		return profile?.role === "teacher";
	};

	useEffect(() => {
		const checkAuth = async () => {
			// Supabase 세션 직접 확인
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				alert("로그인이 필요합니다.");
				navigate("/login");
				return;
			}

			setIsCheckingAuth(false);

			// 게시글 로드
			if (id) {
				await fetchPost(id, session.user.id);
			}
		};

		checkAuth();
	}, [id, navigate, fetchPost]);

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

	return (
		<>
			{isLoading || isCheckingAuth ? (
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
												deletePost(postData.id);
												navigate("/posts");
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
											resetPostStore();
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
									<div className="max-w-xl">
										<pre className="w-full break-words whitespace-pre-wrap">
											{postData?.content}
										</pre>
									</div>
									{/* 첨부파일 섹션 */}
									{postData?.files &&
										postData.files.length > 0 && (
											<div className="mt-6">
												<h3 className="text-lg font-semibold text-gray-800 mb-3">
													첨부파일
												</h3>
												<div className="space-y-2">
													{postData.files.map(
														(file, index) => {
															const isImage =
																file.file_name.match(
																	/\.(jpg|jpeg|png|gif)$/i,
																);
															const fileUrl =
																getFileUrl(
																	file.file_path,
																);

															return (
																<div
																	key={index}
																	className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
																>
																	<div className="flex items-center space-x-3">
																		{isImage ? (
																			<img
																				src={
																					fileUrl
																				}
																				alt={
																					file.file_name
																				}
																				className="w-12 h-12 object-cover rounded"
																				onError={(
																					e,
																				) => {
																					// 이미지 로드 실패 시 파일 아이콘으로 대체
																					e.currentTarget.style.display =
																						"none";
																					e.currentTarget.nextElementSibling?.classList.remove(
																						"hidden",
																					);
																				}}
																			/>
																		) : null}
																		<div
																			className={`w-12 h-12 bg-gray-200 rounded flex items-center justify-center ${isImage ? "hidden" : ""}`}
																		>
																			<File
																				size={
																					20
																				}
																				className="text-gray-500"
																			/>
																		</div>
																		<div>
																			<p className="text-sm font-medium text-gray-900">
																				{
																					file.file_name
																				}
																			</p>
																			<p className="text-xs text-gray-500">
																				첨부파일
																			</p>
																		</div>
																	</div>
																	{canDownloadFile() ? (
																		<button
																			type="button"
																			onClick={() =>
																				downloadFile(
																					file.file_path,
																					file.file_name,
																				)
																			}
																			className="flex items-center space-x-2 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
																		>
																			<Download
																				size={
																					16
																				}
																			/>
																			<span>
																				다운로드
																			</span>
																		</button>
																	) : (
																		<div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 bg-gray-200 rounded-lg">
																			<Download
																				size={
																					16
																				}
																			/>
																			<span>
																				선생님만
																				다운로드
																				가능
																			</span>
																		</div>
																	)}
																</div>
															);
														},
													)}
												</div>
											</div>
										)}
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
								onCommentAdded={() => {
									// 댓글 추가 후 게시글 정보 새로고침
									if (id && currentUserId) {
										fetchPost(id, currentUserId);
									}
								}}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
}
