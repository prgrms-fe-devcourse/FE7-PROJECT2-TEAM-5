import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";
import GroupPostComments from "./GroupPostComments";

type FileRow = { file_path: string; file_name: string | null };

type UserMini = {
  auth_id: string;
  nickname: string | null;
  birth_date: string | null;
  representative_badge_id: string | null;
};

type CommentLikeRow = { id: string; user_id: string };

export type CommentRowForGroup = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id: string | null;
  user: UserMini;
  comment_likes?: CommentLikeRow[];
  parentNickname?: string;
};

type PostRow = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string | null;
  user_id: string | null;
  group_id: string | null;
  group_board_type: string | null;
  users?: { nickname: string | null } | null;
  files?: FileRow[];
  adopted_comment_id: string | null;
};

export default function GroupPostDetailPage() {
  const navigate = useNavigate();
  const { groupId = "", postId = "" } = useParams();
  const currentUserId = useProfileStore((s) => s.currentUserId);

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostRow | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<CommentRowForGroup[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        if (!groupId || !postId) {
          navigate("/groups", { replace: true });
          return;
        }

        const { data: postData, error: postErr } = await supabase
          .from("posts")
          .select(
            `
            id, title, content, created_at, user_id, group_id, group_board_type, adopted_comment_id,
            users(nickname),
            files:files(file_path, file_name)
          `
          )
          .eq("id", postId)
          .eq("group_id", groupId)
          .maybeSingle();

        if (postErr) throw postErr;
        if (!postData) {
          alert("게시글을 찾을 수 없습니다.");
          navigate(`/groups/${groupId}/posts`, { replace: true });
          return;
        }

        let liked = false;
        if (currentUserId) {
          const { data: has, error: likeErr } = await supabase
            .from("post_likes")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", currentUserId)
            .maybeSingle();
          if (!likeErr && has) liked = true;
        }

        const { data: rawComments, error: cErr } = await supabase
          .from("comments")
          .select(
            `
            id, post_id, user_id, content, created_at, parent_comment_id,
            users:users(auth_id, nickname, birth_date, representative_badge_id),
            comment_likes(id, user_id)
          `
          )
          .eq("post_id", postId)
          .order("created_at", { ascending: true });

        if (cErr) throw cErr;

        const rows: CommentRowForGroup[] = (rawComments ?? []).map((c: any) => ({
          id: c.id,
          post_id: c.post_id,
          user_id: c.user_id,
          content: c.content ?? "",
          created_at: c.created_at ?? "",
          parent_comment_id: c.parent_comment_id ?? null,
          user: {
            auth_id: c.users?.auth_id ?? "",
            nickname: c.users?.nickname ?? null,
            birth_date: c.users?.birth_date ?? null,
            representative_badge_id: c.users?.representative_badge_id ?? null,
          },
          comment_likes: c.comment_likes ?? [],
        }));

        const nickMap = new Map(rows.map((r) => [r.id, r.user.nickname ?? "unknown"]));
        const hydrated = rows.map((r) =>
          r.parent_comment_id ? { ...r, parentNickname: nickMap.get(r.parent_comment_id) ?? "" } : r
        );

        if (!alive) return;
        setPost(postData as any);
        setIsLiked(liked);
        setComments(hydrated);
      } catch (e) {
        console.error("[group detail load error]", e);
        alert("게시글을 불러오지 못했습니다.");
        navigate(`/groups/${groupId}/posts`, { replace: true });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [groupId, postId, currentUserId, navigate]);

  const onLike = async () => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (!post) return;
    try {
      const { data: has, error: likeErr } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", currentUserId)
        .maybeSingle();
      if (likeErr) throw likeErr;
      if (has) {
        alert("이미 좋아요를 눌렀습니다.");
        setIsLiked(true);
        return;
      }
      const { error } = await supabase
        .from("post_likes")
        .insert([{ post_id: post.id, user_id: currentUserId }]);
      if (error) throw error;
      setIsLiked(true);
      alert("좋아요 완료");
    } catch (e) {
      console.error("[like error]", e);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  if (loading) return <p className="mt-5 text-sm text-gray-500">불러오는 중…</p>;
  if (!post) return null;

  const writerId = (post.user_id ?? "") as string;

  return (
    <div className="max-w-[1200px] h-[750px] flex flex-row gap-15 overflow-hidden">
     
      <div className="max-w-[800px] w-[760px]">
     
        <div className="flex flex-row justify-between">
          <Link
            to={`/groups/${groupId}/posts`}
            className="flex flex-row relative group px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] cursor-pointer overflow-hidden"
          >
            <span className="mr-1">←</span>
            <span className="inline-block transition-all duration-300 ease-in-out max-w-0 overflow-hidden align-middle group-hover:max-w-xs whitespace-nowrap">
              그룹으로 돌아가기
            </span>
          </Link>

          {post.user_id === currentUserId && (
            <div className="flex gap-2">
              <Link
                to={`/posts/create/${post.id}`}
                className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6]"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("정말 삭제하시겠어요?")) return;
                  try {
                    const { error } = await supabase.from("posts").delete().eq("id", post.id);
                    if (error) throw error;
                    alert("삭제되었습니다.");
                    navigate(`/groups/${groupId}/posts`);
                  } catch (e) {
                    console.error(e);
                    alert("삭제에 실패했습니다.");
                  }
                }}
                className="px-4 py-2.5 text-sm text-[#8B5CF6] rounded-xl bg-white border-1 border-[#8B5CF6]"
              >
                삭제
              </button>
            </div>
          )}
        </div>

       
        <div className="group mt-5 h-[700px] overflow-y-auto scrollbar-custom">
          <div className="flex flex-row items-center justify-between">
            <h1 className="font-bold text-[32px] text-[#8B5CF6]">
              {post.title ?? "(제목 없음)"}
            </h1>
            <button
              type="button"
              onClick={onLike}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="좋아요"
            >
              {isLiked ? (
                <Heart
                  color="white"
                  size={40}
                  className="p-2 bg-[#EA489A] border-1 border-[#EA489A] rounded-4xl align-middle"
                />
              ) : (
                <Heart
                  color="#EA489A"
                  size={40}
                  className="p-2 bg-white border-1 border-[#EA489A] rounded-4xl align-middle"
                />
              )}
            </button>
          </div>

          <p className="mt-2 text-sm text-[#6B7280]">
            작성자: {post.users?.nickname ?? "unknown"} | {(post.created_at ?? "").slice(0, 10)}
          </p>

          <div className="my-8">
            {post.content && <pre className="whitespace-pre-wrap">{post.content}</pre>}
            <div className="mt-2 space-y-3">
              {(post.files ?? []).map((f) => (
                <img
                  key={f.file_path}
                  src={f.file_path}
                  alt={f.file_name ?? ""}
                  className="max-h-80 rounded-xl border border-gray-100 object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

     
      <div className="w-[500px] h-[700px] flex flex-col">
        <GroupPostComments
          comments={comments ?? []}
          postId={post.id}
          adopted_comment_id={post.adopted_comment_id ?? null}
          writerId={writerId}
          onReload={async () => {
            const { data: raw, error } = await supabase
              .from("comments")
              .select(
                `
                id, post_id, user_id, content, created_at, parent_comment_id,
                users:users(auth_id, nickname, birth_date, representative_badge_id),
                comment_likes(id, user_id)
              `
              )
              .eq("post_id", postId)
              .order("created_at", { ascending: true });
            if (error) return;

            const rows: CommentRowForGroup[] = (raw ?? []).map((c: any) => ({
              id: c.id,
              post_id: c.post_id,
              user_id: c.user_id,
              content: c.content ?? "",
              created_at: c.created_at ?? "",
              parent_comment_id: c.parent_comment_id ?? null,
              user: {
                auth_id: c.users?.auth_id ?? "",
                nickname: c.users?.nickname ?? null,
                birth_date: c.users?.birth_date ?? null,
                representative_badge_id: c.users?.representative_badge_id ?? null,
              },
              comment_likes: c.comment_likes ?? [],
            }));

            const nickById = new Map(rows.map((r) => [r.id, r.user.nickname ?? "unknown"]));
            const hydrated = rows.map((r) =>
              r.parent_comment_id
                ? { ...r, parentNickname: nickById.get(r.parent_comment_id) ?? "" }
                : r
            );
            setComments(hydrated);
          }}
        />
      </div>
    </div>
  );
}
