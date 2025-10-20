import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import supabase from "../../utils/supabase";
import PostTabContainer from "../../components/PostTabContainer";
import PostList from "../../components/PostList";
import PageNation from "../../components/PageNation";
import GroupMembers from "./GroupMembers";

type PostRow = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string | null;
  user_id: string | null;
  group_id: string | null;
  group_board_type: string | null; 
}

type GroupRow = {
  id: string;
  name: string | null;
};


type PostForList = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string | null;
  board_type: string;          
  hash_tag: string[];           
};

export default function GroupPostListPage() {
  const { groupId = "" } = useParams();


  const [activeTab, setActiveTab] = useState<"notice" | "activity" | "attendance" | "members">("notice");

  const tabs = [
    { key: "notice", label: "공지사항" },
    { key: "activity", label: "활동게시판" },
    { key: "attendance", label: "출석" },
    { key: "members", label: "멤버" },
  ] as const;

  const [group, setGroup] = useState<GroupRow | null>(null);
  const [posts, setPosts] = useState<PostForList[]>([]);
  const [loading, setLoading] = useState(true);

  const postsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(posts.length / postsPerPage) || 1,
    [posts.length]
  );

  const displayedPosts = useMemo(
    () =>
      posts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
      ),
    [posts, currentPage]
  );

  const looksLikeUUID = (s: string) =>
    /^[0-9a-fA-F-]{36}$/.test(s) && (s.match(/-/g)?.length ?? 0) === 4;

  
  const resolveGroup = async (raw: string) => {
    const key = decodeURIComponent(raw);
    if (looksLikeUUID(key)) {
      const { data, error } = await supabase
        .from("groups")
        .select("id,name")
        .eq("id", key)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as GroupRow;
    }
    const { data: byName, error: nErr } = await supabase
      .from("groups")
      .select("id,name")
      .eq("name", key)
      .maybeSingle();
    if (nErr) throw nErr;
    if (!byName) throw new Error("그룹을 찾을 수 없습니다.");
    return byName as GroupRow;
  };

  
  const fetchGroupPosts = async (gid: string, board: "notice" | "activity") => {
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,content,created_at,user_id,group_id,group_board_type")
      .eq("group_id", gid)
      .eq("group_board_type", board)
      .order("created_at", { ascending: false });

    if (error) throw error;

    
    const mapped: PostForList[] = (data ?? []).map((p: PostRow) => ({
      id: p.id,
      title: p.title ?? "",
      content: p.content ?? "",
      created_at: p.created_at ?? "",
      user_id: p.user_id,
      board_type: p.group_board_type ?? board, 
      hash_tag: [], 
    }));
    return mapped;
  };

  
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setCurrentPage(1);

        const g = await resolveGroup(groupId);
        if (!alive) return;
        setGroup(g);

        if (activeTab === "notice" || activeTab === "activity") {
          const list = await fetchGroupPosts(g.id, activeTab);
          if (!alive) return;
          setPosts(list);
        } else {
          
          setPosts([]);
        }
      } catch (e) {
        console.error(e);
        if (alive) {
          setGroup(null);
          setPosts([]);
          alert("그룹 정보를 불러오지 못했어요.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [groupId, activeTab]);

  return (
    <div className="w-[920px]">
     
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-[32px] font-bold tracking-tight">
          {group?.name ?? "그룹"}
        </h2>

      
        {group && (activeTab === "notice" || activeTab === "activity") && (
          <Link
            to={`/groups/${group.id}/posts/create`}
            className="inline-flex h-9 items-center rounded-xl bg-[#8B5CF6] px-4 text-sm font-medium text-white hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            새 글 작성
          </Link>
        )}
      </div>

     
      <div className="mt-6">
      <PostTabContainer
      activeTab={activeTab}
      setActiveTab={(k) =>
      setActiveTab(k as "notice" | "activity" | "attendance" | "members")
      }
      title=""
      tabs={tabs}
       />
      </div>


    
      {!loading && (
        <>
          {(activeTab === "notice" || activeTab === "activity") ? (
            <>
              <div className="border-t border-gray-300 mt-2 pt-6">
                <PostList posts={displayedPosts as any} />
              </div>

              <PageNation
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : activeTab === "attendance" ? (
           
            <div className="mt-6">
              
            </div>
          ) : (
            <div className="mt-6">
              <GroupMembers />
            </div>
          )}
        </>
      )}
    </div>
  );
}
