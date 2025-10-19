import { Heart, MessageSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import type { Database } from "../../types/database";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

type comment = Database["public"]["Tables"]["comments"]["Row"] & {
	user: { nickname?: string; birth_date: string };
	comment_likes?: string[] | null;
};

type DetailPost = Database["public"]["Tables"]["posts"]["Row"] & {
	user?: {
		nickname: string;
	} | null;
	files?: string[] | null;
	likes?: number | null;
	comments?: comment[];
};

// 게시글 세부 페이지
export default function PostDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [post, setPost] = useState<DetailPost | null>(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				//게시물 정보 (작성자 닉네임, 첨부 파일도)
				const { data: post, error: postError } = await supabase
					.from("posts")
					.select("*, user:users(nickname), files(file_path)")
					.eq("id", id)
					.single();
				if (postError) throw postError;

				//게시물 좋아요 개수
				const { data: likes, error: likesError } = await supabase
					.from("post_likes")
					.select("*", { count: "exact", head: true })
					.eq("post_id", id);
				if (likesError) throw likesError;

				//댓글과 댓글 작성자 정보 및 댓글 좋아요 (뱃지 현재 착용 뱃지 컬럼이 없는 것 같아서 아직 안가져옴)
				const { data: comments, error: commentsError } = await supabase
					.from("comments")
					.select(
						"*, user:users(nickname, birth_date), comment_likes(id)",
					)
					.eq("post_id", id);
				if (commentsError) throw commentsError;

				setPost({ ...post, ...likes, ...comments });
				setIsLoading(false);
			} catch (e) {
				console.error(e);
			}
		};
		fetchPost();
	}, [id]);

	if (!isLoading) {
		return (
			<>
				<div className="w-250 px-30 py-5">
					<div className="flex justify-between items-center">
						{/* 글 제목 */}
						<h1 className="font-bold text-[32px] text-[#8B5CF6]">
							{post?.title}
						</h1>
						{/* 작성자만 보이는 수정, 삭제 버튼 */}
						<div className="flex gap-2">
							<button
								type="button"
								className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] cursor-pointer"
							>
								수정
							</button>
							<button
								type="button"
								className="px-4 py-2.5 text-sm text-[#8B5CF6] rounded-xl bg-white border-1 border-[#8B5CF6] cursor-pointer"
							>
								삭제
							</button>
						</div>
					</div>
					{/* 작성자, 작성일 */}
					<p className="text-sm text-[#6B7280]">
						작성자: {post?.user?.nickname} |{" "}
						{p ost?.created_at.slice(0, 10)}
					</p>
					{/* 본문 */}
					<div className="pt-9 pb-15">
						<pre>{post?.content}</pre>
					</div>
					{/* 댓글 영역 */}

					<div className="flex flex-col gap-y-3 h-80 pr-2 overflow-y-auto ">
						{/* 댓글 1 */}
						<div className="flex flex-col gap-y-3">
							{/* 원 댓글 1 */}
							<div className="w-full px-4 py-3 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
								{/* 글 제목과 좋아요, 댓글 수 */}
								<div className="flex justify-between items-start mb-1">
									<div className="flex gap-1 items-center">
										<div className="w-[35px] h-[35px]">
											<img
												src="/src/assets/image.png"
												alt="userImg"
											/>
										</div>
										<div>
											<p className="text-xs font-medium">
												🏆 초보 수학 마스터
											</p>
											<p className="text-sm">
												홍길동
												<span className="text-xs text-[#6B7280] ml-1">
													중학교 1학년
												</span>
											</p>
										</div>
									</div>

									{/* 좋아요, 댓글 수 */}
									<div className="flex gap-3">
										{/* 좋아요 개수 표시*/}
										<div className="flex gap-1 items-top">
											<Heart
												color="red"
												size={15}
												className="mt-0.5"
											/>
											<p className="text-[14px]">2</p>
										</div>
										{/* 댓글 개수 표시 */}
										<div className="flex gap-1 items-top">
											<MessageSquare
												color="#8B5CF6"
												size={15}
												className="mt-0.5"
											/>
											<p className="text-[14px]">2</p>
										</div>
									</div>
								</div>
								{/* 댓글 내용 */}
								<p className="mt-3 mb-2 text-sm font-Regular text-[#6B7280]">
									cos(A+B) = cosAcosB - sinAsinB 입니다!
								</p>
								{/* 답글 버튼, 작성일 */}
								<div className="flex justify-between">
									<button
										type="button"
										className="text-xs text-[#6B7280] cursor-pointer"
									>
										답글달기
									</button>
									<p className="text-xs text-[#6B7280]">
										2025-10-10
									</p>
								</div>
							</div>
							{/* 대댓글은 아래로 추가 */}
							<div className="w-full px-4 py-3 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
								{/* 글 제목과 좋아요, 댓글 수 */}
								<div className="flex justify-between items-start mb-1">
									<div className="flex gap-1 items-center">
										<div className="w-[35px] h-[35px]">
											<img
												src="/src/assets/image.png"
												alt="userImg"
											/>
										</div>
										<div>
											<p className="text-xs font-medium">
												🏆 초보 수학 마스터
											</p>
											<p className="text-sm">
												홍길동
												<span className="text-xs text-[#6B7280] ml-1">
													중학교 1학년
												</span>
											</p>
										</div>
									</div>

									{/* 좋아요, 댓글 수 */}
									<div className="flex gap-3">
										{/* 좋아요 개수 표시*/}
										<div className="flex gap-1 items-top">
											<Heart
												color="red"
												size={15}
												className="mt-0.5"
											/>
											<p className="text-[14px]">2</p>
										</div>
										{/* 대댓글이므로 댓글 개수 표시 X
									<div className="flex gap-1 items-top">
										<img
											className="object-none"
											src="/src/assets/SpeechBubble.png"
											alt="SpeechBubble"
										/>
										<p className="text-[14px]">2</p>
									</div> */}
									</div>
								</div>
								{/* 댓글 내용, 작성일 */}
								<div className="flex justify-between items-end">
									<p className="mt-3 text-sm font-Regular text-[#6B7280]">
										<span className="mr-1 text-[#8B5CF6] ">
											@홍길동
										</span>
										cos(A+B) = cosAcosB - sinAsinB 입니다!
									</p>
									<p className="text-xs text-[#6B7280]">
										2025-10-10
									</p>
								</div>
							</div>
						</div>
						{/* 댓글 1 */}
						<div className="flex flex-col gap-y-3">
							{/* 원 댓글 1 */}
							<div className="w-full px-4 py-3 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
								{/* 글 제목과 좋아요, 댓글 수 */}
								<div className="flex justify-between items-start mb-1">
									<div className="flex gap-1 items-center">
										<div className="w-[35px] h-[35px]">
											<img
												src="/src/assets/image.png"
												alt="userImg"
											/>
										</div>
										<div>
											<p className="text-xs font-medium">
												🏆 초보 수학 마스터
											</p>
											<p className="text-sm">
												홍길동
												<span className="text-xs text-[#6B7280] ml-1">
													중학교 1학년
												</span>
											</p>
										</div>
									</div>

									{/* 좋아요, 댓글 수 */}
									<div className="flex gap-3">
										{/* 좋아요 개수 표시*/}
										<div className="flex gap-1 items-top">
											<Heart
												color="red"
												size={15}
												className="mt-0.5"
											/>
											<p className="text-[14px]">2</p>
										</div>
										{/* 댓글 개수 표시 */}
										<div className="flex gap-1 items-top">
											<MessageSquare
												color="#8B5CF6"
												size={15}
												className="mt-0.5"
											/>
											<p className="text-[14px]">2</p>
										</div>
									</div>
								</div>
								{/* 댓글 내용 */}
								<p className="mt-3 mb-2 text-sm font-Regular text-[#6B7280]">
									cos(A+B) = cosAcosB - sinAsinB 입니다!
								</p>
								{/* 답글 버튼, 작성일 */}
								<div className="flex justify-between">
									<button
										type="button"
										className="text-xs text-[#6B7280] cursor-pointer"
									>
										답글달기
									</button>
									<p className="text-xs text-[#6B7280]">
										2025-10-10
									</p>
								</div>
							</div>
							{/* 대댓글은 아래로 추가 */}
							<div className="w-full px-4 py-3 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
								{/* 글 제목과 좋아요, 댓글 수 */}
								<div className="flex justify-between items-start mb-1">
									<div className="flex gap-1 items-center">
										<div className="w-[35px] h-[35px]">
											<img
												src="/src/assets/image.png"
												alt="userImg"
											/>
										</div>
										<div>
											<p className="text-xs font-medium">
												🏆 초보 수학 마스터
											</p>
											<p className="text-sm">
												홍길동
												<span className="text-xs text-[#6B7280] ml-1">
													중학교 1학년
												</span>
											</p>
										</div>
									</div>

									{/* 좋아요, 댓글 수 */}
									<div className="flex gap-3">
										{/* 좋아요 개수 표시*/}
										<div className="flex gap-1 items-top">
											<Heart
												color="red"
												size={15}
												className="mt-0.5"
											/>
											<p className="text-[14px]">2</p>
										</div>
										{/* 대댓글이므로 댓글 개수 표시 X
									<div className="flex gap-1 items-center">
										<img
											className="object-none"
											src="/src/assets/SpeechBubble.png"
											alt="SpeechBubble"
										/>
										<p className="text-[14px]">2</p>
									</div> */}
									</div>
								</div>
								{/* 댓글 내용, 작성일 */}
								<div className="flex justify-between items-center">
									<p className="mt-3 text-sm font-Regular text-[#6B7280]">
										<span className="mr-1 text-[#8B5CF6] ">
											@홍길동
										</span>
										cos(A+B) = cosAcosB - sinAsinB 입니다!
									</p>
									<p className="text-xs text-[#6B7280]">
										2025-10-10
									</p>
								</div>
							</div>
						</div>
					</div>

					<form className="flex gap-2 mt-4 w-full ">
						<input
							type="textarea"
							placeholder="댓글을 작성해주세요."
							className="w-[696px] text-sm px-6 py-3 border-1 border-[#E5E7EB] rounded-xl focus:outline-none bg-white"
						/>
						<button
							type="button"
							className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] cursor-pointer"
						>
							등록
						</button>
					</form>
					<button
						type="button"
						className="mt-7 px-6 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] cursor-pointer"
					>
						← 게시판으로 돌아가기
					</button>
				</div>
			</>
		);
	}
}
