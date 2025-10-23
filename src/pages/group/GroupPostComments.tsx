import { Heart, MessageSquare, Smile } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";
import { getAge } from "../../utils/getAge";
import { getGrade } from "../../utils/getGrade";
import { useNavigate } from "react-router";
import type { CommentRowForGroup } from "./GroupPostDetailPage";
import basicImage from "../../assets/basic_image.png";
import Button from "../../components/Button";

type Props = {
  comments?: CommentRowForGroup[] | null; 
  postId: string;
  adopted_comment_id: string | null;
  writerId: string;
  onReload: () => Promise<void>;
};

export default function GroupPostComments({
  comments = [],           
  postId,
  adopted_comment_id,
  writerId,
  onReload,
}: Props) {
  const navigate = useNavigate();
  const [inputComment, setInputComment] = useState("");
  const [mention, setMention] = useState({ nickname: "", userId: "", commentId: "" });
  const currentUserId = useProfileStore((s) => s.currentUserId);


  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const emojis = ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍"];

  const addEmoji = (emoji: string) => {
    setInputComment((v) => v + emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  
  const replyCounts = useMemo(() => {
    const acc: Record<string, string[]> = {};
    const list = Array.isArray(comments) ? comments : [];
    list.forEach((c) => {
      if (!c?.parent_comment_id) return;
      if (!acc[c.parent_comment_id]) acc[c.parent_comment_id] = [];
      acc[c.parent_comment_id].push(c.id);
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
    const text = inputComment.trim();
    if (!text) return;
    try {
      if (!mention.userId) {
        const { error } = await supabase.from("comments").insert([
          { post_id: postId, user_id: currentUserId, content: text },
        ]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("comments").insert([
          { post_id: postId, user_id: currentUserId, content: text, parent_comment_id: mention.commentId },
        ]);
        if (error) throw error;
        setMention({ nickname: "", userId: "", commentId: "" });
      }
      setInputComment("");
      await onReload();
      alert("댓글이 등록되었습니다.");
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
    if (comment.comment_likes?.some((l) => l.user_id === currentUserId)) {
      alert("이미 좋아요를 눌렀습니다.");
      return;
    }
    try {
      const { error } = await supabase
        .from("comment_likes")
        .insert([{ user_id: currentUserId, comment_id: comment.id }]);
      if (error) throw error;
      await onReload();
      alert("좋아요 완료");
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
      adopted_comment_id === comment.id ? "border-1 border-[#EA489A]" : "";

    const canAdopt =
      !!writerId &&
      !!currentUserId &&
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
          <Button
            type="button"
            onClick={() => adoptComment(comment)}
            className="absolute -top-4 right-4 z-10 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-[#8B5CF6] hover:text-white px-3 py-1 text-xs border-1 border-[#8B5CF6] rounded-2xl bg-white"
          >
            채택
          </Button>
        )}

        {adopted_comment_id === comment.id && (
          <span className="flex items-center absolute -top-4 left-4 z-10 px-3 py-1 text-xs rounded-2xl bg-linear-to-r text-white from-[#EA489A] to-[#FF84C2]">
            채택된 댓글
            <img src="/src/assets/fire.png" className="ml-0.5 mb-0.5" />
          </span>
        )}

        <div className="flex justify-between items-start mb-1">
          <div className="flex gap-1 items-center">
            <div className="w-[35px] h-[35px]">
              <img
                className="w-full h-full rounded-full object-cover"
                src={basicImage}
                alt="userImg"
              />
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
              <Heart color="red" size={15} className="mt-0.5" />
              <p className="text-[14px]">{comment.comment_likes?.length ?? 0}</p>
            </button>

            {!comment.parent_comment_id && (
              <button
                type="button"
                onClick={() => createMention(comment)}
                className="flex gap-1 items-start cursor-pointer"
              >
                <MessageSquare color="#8B5CF6" size={15} className="mt-0.5" />
                <p className="text-[14px]">{replyCounts[comment.id]?.length ?? 0}</p>
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

        <div className="flex justify-end">
          <p className="text-xs text-[#6B7280]">{(comment.created_at ?? "").slice(0, 10)}</p>
        </div>
      </div>
    );
  }

  function CommentItem({ items }: { items: CommentRowForGroup[] }) {
    const list = Array.isArray(items) ? items : []; // ✅ 방어
    return (
      <>
        {list.map((comment) => (
          <div key={comment.id} className="flex flex-col">
            {!comment.parent_comment_id && <Comment comment={comment} />}
            {replyCounts[comment.id]?.map((rid) => {
              const reply = list.find((c) => c.id === rid); // ✅ items.find 안전
              return reply ? <Comment key={reply.id} comment={reply} /> : null;
            })}
          </div>
        ))}
      </>
    );
  }


  const adopted = useMemo(() => {
    const list = Array.isArray(comments) ? comments : [];
    return list.find((c) => c.id === adopted_comment_id) ?? null;
  }, [comments, adopted_comment_id]);

  return (
    <div className="h-full flex flex-col">
      {!Array.isArray(comments) || comments.length === 0 ? (
        <div className="text-center text-gray-500 py-12">현재 게시물에 등록된 댓글이 없습니다.</div>
      ) : (
        <div className="flex-1 flex flex-col pr-2 overflow-y-auto scrollbar-custom">
          {adopted ? (
            <Comment comment={adopted} />
          ) : (
            <div className="text-center text-gray-500 py-10">채택된 댓글이 없습니다.</div>
          )}
          <div className="border-t border-gray-300 mt-3.5" />
          <CommentItem items={comments} />
        </div>
      )}

      <form className="flex gap-2 mt-4 w-full" onSubmit={writeComment}>
        <div
          className="relative flex-1 text-sm px-6 py-3 border-1 border-[#E5E7EB] rounded-xl bg-white"
          onKeyDown={handleKeyDown}
        >
          {mention.nickname && (
            <span className="text-[#8B5CF6] text-sm mr-1 font-medium">@{mention.nickname}</span>
          )}
          <input
            placeholder="댓글을 작성해주세요."
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
            className="w-full focus:outline-none"
          />
          <Button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5CF6]"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={20} />
          </Button>

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

        <Button type="submit" className="px-4 py-2 text-sm text-white rounded-xl bg-[#8B5CF6]">
          등록
        </Button>
      </form>
    </div>
  );
}
