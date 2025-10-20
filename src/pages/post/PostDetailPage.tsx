import { Heart, MessageSquare } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import type { Database } from "../../types/database";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import PostComments from "./PostComments";

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

type DetailPost = Database["public"]["Tables"]["posts"]["Row"] & {
	user?: {
		nickname: string;
	} | null;
	files?:
		| {
				file_path: string;
				file_name: string;
		  }[]
		| undefined;

	likes?: number | null;
};

// 게시글 세부 페이지
export default function PostDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [postData, setPost] = useState<DetailPost | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				//게시물 정보 (작성자 닉네임, 첨부 파일도)
				const { data: post, error: postError } = await supabase
					.from("posts")
					.select(
						"*, user:users(nickname, representative_badge_id(badges(name,icon_url))), files(file_path, file_name)",
					)
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
						"*, user:users(nickname, birth_date, representative_badge_id(badges(name,icon_url))), comment_likes(id)",
					)
					.eq("post_id", id);
				if (commentsError) throw commentsError;

				setPost({ ...post, ...likes });
				setComments(comments);
				setIsLoading(false);
			} catch (e) {
				console.error(e);
			}
		};
		fetchPost();
	}, [id, comments]);

	if (!isLoading) {
		return (
			<>
				<div className="w-250 px-30 py-5">
					<div className="flex justify-between items-center">
						{/* 글 제목 */}
						<h1 className="font-bold text-[32px] text-[#8B5CF6]">
							{postData?.title}
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
						작성자: {postData?.user?.nickname} |{" "}
						{postData?.created_at.slice(0, 10)}
					</p>
					{/* 본문 */}
					<div className="pt-9 pb-15">
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
					<div className="flex gap-2 mb-4">
						{postData?.hash_tag?.map((tag, idx) => (
							<div
								key={idx}
								className="px-2 py-1 rounded-lg bg-[#EDE9FE] font-Regular text-xs text-[#8B5CF6]"
							>
								#{tag}
							</div>
						))}
					</div>
					{/* 댓글 영역 */}
					<PostComments comments={comments} postId={id} />

					<Link
						to={"/posts"}
						className="inline-block mt-7 px-6 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] cursor-pointer"
					>
						← 게시판으로 돌아가기
					</Link>
				</div>
			</>
		);
	}
}
