import { Heart, MessageSquare } from "lucide-react";
import { useState, useMemo } from "react";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";
import { getAge } from "../../utils/getAge";
import { getGrade } from "../../utils/getGrade";
import { useNavigate } from "react-router";
import type { CommentRowForGroup } from "./GroupPostDetailPage";

type Props = {
  comments: CommentRowForGroup[]; 
  postId: string;
  adopted_comment_id: string | null;
  writerId: string | undefined;
  onReload: () => Promise<void>;
};

export default function GroupPostComments({
  comments,
  postId,
  adopted_comment_id,
  writerId,
  onReload,
}: Props) {
  const navigate = useNavigate();
  const [inputComment, setInputComment] = useState("");
  const [mention, setMention] = useState({
    nickname: "",
    userId: "",
    commentId: "",
  });
  const currentUserId = useProfileStore((state) => state.currentUserId);

  // 답글 개수 데이터
  const replyCounts = useMemo(() => {
    const acc: Record<string, string[]> = {};
    comments.forEach((c) => {
      if (c.parent_comment_id) {
        if (!acc[c.parent_comment_id]) acc[c.parent_comment_id] = [];
        acc[c.parent_comment_id].push(c.id);
      }
    });
    return acc;
  }, [comments]);

  const writeComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (!inputComment.trim()) return;

    try {
      if (!mention.userId) {
        const { error } = await supabase.from("comments").insert([
          {
            post_id: postId,
            user_id: currentUserId,
            content: inputComment.trim(),
          },
        ]);
        if (error) throw error;
        setInputComment("");
        await onReload();
      } else {
        const { error } = await supabase.from("comments").insert([
          {
            post_id: postId,
            user_id: currentUserId,
            content: inputComment.trim(),
            parent_comment_id: mention.commentId,
          },
        ]);
        if (error) throw error;
        setInputComment("");
        setMention({ nickname: "", userId: "", commentId: "" });
        await onReload();
      }
    } catch (e) {
      console.error(e);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  
  const pressLike = async (comment: CommentRowForGroup) => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (
      comment.comment_likes?.some((l) => l.user_id === currentUserId)
    ) {
      alert("이미 좋아요를 눌렀습니다.");
      return;
    }
    try {
      const { error } = await supabase
        .from("comment_likes")
        .insert([{ user_id: currentUserId, comment_id: comment.id }]);
      if (error) throw error;
      await onReload();
    } catch (e) {
      console.error(e);
      alert("좋아요 실패");
    }
  };

  
  const createMention = (comment: CommentRowForGroup) => {
    if (comment.user.nickname) {
      setMention({
        nickname: comment.user.nickname,
        userId: comment.user.auth_id,
        commentId: comment.id,
      });
    }
  };

 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && !inputComment) {
      setMention({ nickname: "", userId: "", commentId: "" });
    }
  };

  // 채택
  const adoptComment = async (comment: CommentRowForGroup) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ adopted_comment_id: comment.id })
        .eq("id", postId);
      if (error) throw error;
      await onReload();
      alert("채택되었습니다.");
    } catch (e) {
      console.error(e);
      alert("채택 실패");
    }
  };

  function Comment({ comment }: { comment: CommentRowForGroup }) {
    const adoptedStyle =
      adopted_comment_id === comment.id && "border-1 border-[#EA489A]";

    const canAdopt =
      currentUserId === writerId && 
      currentUserId !== comment.user_id && 
      !adopted_comment_id; 

    return (
      <div
        className={
          "relative z-10 group w-full px-4 py-3 mt-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] " +
          adoptedStyle
        }
      >
        {canAdopt && (
          <button
            type="button"
            onClick={() => adoptComment(comment)}
            className="absolute -top-4 right-4 z-10 hidden group-hover:block hover:bg-[#8B5CF6] hover:text-white px-3 py-1 text-xs border-1 border-[#8B5CF6] rounded-2xl bg-white"
          >
            채택
          </button>
        )}

        {adopted_comment_id === comment.id && (
          <span className="flex items-center absolute -top-4 left-4 z-10 px-3 py-1 text-xs rounded-2xl bg-linear-to-r text-white from-[#EA489A] to-[#FF84C2]">
            채택된 댓글
            <img src="/src/assets/fire.png" className="ml-0.5 mb-0.5" />
          </span>
        )}

        {/* 상단 */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex gap-1 items-center">
            <div className="w-[35px] h-[35px] rounded-full overflow-hidden bg-gray-200">
              <img src="/src/assets/image.png" alt="userImg" />
            </div>
            <div>
            
              <p className="text-sm">
           {comment.user.nickname ?? "unknown"}
           <span className="text-xs text-[#6B7280] ml-1">
             {comment.user.birth_date ? getGrade(getAge(comment.user.birth_date)) : ""}
         </span>
          </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => pressLike(comment)}
              className="flex gap-1 items-start cursor-pointer"
            >
              <Heart color="red" size={15} className="mt-0.5 " />
              <p className="text-[14px]">
                {comment.comment_likes?.length ?? 0}
              </p>
            </button>

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

       
        <p className="mt-3 mb-2 text-sm font-Regular text-[#6B7280]">
          {comment.parent_comment_id && comment.parentNickname && (
            <span className="text-[#8B5CF6] text-sm mr-1 font-medium">
              @{comment.parentNickname}
            </span>
          )}
          {comment.content}
        </p>

        {/* 작성일 */}
        <div className="flex justify-end">
          <p className="text-xs text-[#6B7280]">
            {(comment.created_at ?? "").slice(0, 10)}
          </p>
        </div>
      </div>
    );
  }

  function CommentItem({ items }: { items: CommentRowForGroup[] }) {
    return (
      <>
        {items.map((comment) => (
          <div key={comment.id} className="flex flex-col">
            {!comment.parent_comment_id && <Comment comment={comment} />}
            {replyCounts[comment.id]?.map((rid) => {
              const reply = items.find((c) => c.id === rid);
              return reply ? <Comment key={reply.id} comment={reply} /> : null;
            })}
          </div>
        ))}
      </>
    );
  }

  const adopted = useMemo(
    () => comments.find((c) => c.id === adopted_comment_id),
    [comments, adopted_comment_id]
  );

  return (
    <>
      {(!comments || comments.length === 0) && (
        <div className="text-center text-gray-500 py-12">
          현재 게시물에 등록된 댓글이 없습니다.
        </div>
      )}

      {!!comments?.length && (
        <div className="flex flex-col max-h-100 pr-2 overflow-y-auto">
          {adopted && <Comment comment={adopted} />}
          <CommentItem items={comments} />
        </div>
      )}

      <form className="flex gap-2 mt-4 w-full" onSubmit={writeComment}>
        <div
          className="w-[696px] text-sm px-6 py-3 border-1 border-[#E5E7EB] rounded-xl bg-white"
          onKeyDown={handleKeyDown}
        >
          {mention.nickname && (
            <span className="text-[#8B5CF6] text-sm mr-1 font-medium">
              @{mention.nickname}
            </span>
          )}
          <input
            placeholder="댓글을 작성해주세요."
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

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
