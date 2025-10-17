import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import GroupCard from "./GroupCard";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

type GroupRow = {
  id: string;
  created_at: string | null;
  name: string | null;
  profile_image_url: string | null;
  bio: string | null;
};

type GroupView = GroupRow & {
  member_count: number;
  joined: boolean;
};

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "방금";
  const diff = Date.now() - t;
  const h = Math.floor(diff / 3600_000);
  if (h < 1) return "방금";
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}

async function safeGetUser() {
  const { data, error } = await supabase.auth.getUser();
  if (
    error &&
    (error.message?.includes("Auth session missing") ||
      (error as any).status === 400)
  ) {
    return null;
  }
  return data.user ?? null;
}

// 전체 그룹 + 멤버수 + 내 가입여부
async function fetchAll(): Promise<GroupView[]> {
  const user = await safeGetUser();
  const myId = user?.id ?? null;

  const { data: groups, error: gErr } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });
  if (gErr) throw gErr;

  const ids = groups.map((g) => g.id);
  if (ids.length === 0) return [];

  const { data: members, error: mErr } = await supabase
    .from("group_members")
    .select("group_id, user_id")
    .in("group_id", ids);
  if (mErr) throw mErr;

  const countMap = new Map<string, number>();
  const joinedSet = new Set<string>();

  for (const row of members) {
    countMap.set(row.group_id, (countMap.get(row.group_id) ?? 0) + 1);
    if (row.user_id === myId) joinedSet.add(row.group_id);
  }

  return groups.map((g) => ({
    ...(g as GroupRow),
    member_count: countMap.get(g.id) ?? 0,
    joined: joinedSet.has(g.id),
  }));
}

// 내가 가입한 그룹
async function fetchMine(): Promise<GroupView[]> {
  const user = await safeGetUser();
  if (!user) return [];

  const { data: links, error: lErr } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id);
  if (lErr) throw lErr;

  const ids = links.map((r) => r.group_id);
  if (ids.length === 0) return [];

  const { data: groups, error: gErr } = await supabase
    .from("groups")
    .select("*")
    .in("id", ids);
  if (gErr) throw gErr;

  const { data: members, error: mErr } = await supabase
    .from("group_members")
    .select("group_id")
    .in("group_id", ids);
  if (mErr) throw mErr;

  const countMap = new Map<string, number>();
  for (const row of members) {
    countMap.set(row.group_id, (countMap.get(row.group_id) ?? 0) + 1);
  }

  return groups.map((g) => ({
    ...(g as GroupRow),
    member_count: countMap.get(g.id) ?? 0,
    joined: true,
  }));
}

/** ============== 참여/탈퇴 요청 ============== */
async function reqJoin(groupId: string) {
  const user = await safeGetUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const { error } = await supabase
    .from("group_members")
    .insert({ group_id: groupId, user_id: user.id });
  if (error && (error as any).code !== "23505") throw error; 
}
async function reqLeave(groupId: string) {
  const user = await safeGetUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);
  if (error) throw error;
}

export default function GroupPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allGroups, setAll] = useState<GroupView[]>([]);
  const [myGroups, setMine] = useState<GroupView[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [all, mine] = await Promise.all([fetchAll(), fetchMine()]);
        if (!alive) return;
        setAll(all);
        setMine(mine);
      } catch (e: any) {
        if (!alive) return;
        const msg = String(e?.message ?? "");
        if (
          msg.includes("Auth session missing") ||
          (e as any)?.status === 400
        ) {
          setError(null);
        } else {
          setError("그룹을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  
  const toggleJoin = async (g: GroupView, wantJoin: boolean) => {
  // 낙관적 업데이트
  setAll((prev) =>
    prev.map((x) =>
      x.id === g.id
        ? {
            ...x,
            member_count: x.member_count + (wantJoin ? 1 : -1),
            joined: wantJoin,
          }
        : x,
    ),
  );

  setMine((prev) =>
    wantJoin
      ? prev.some((x) => x.id === g.id)
        ? prev
        : [
            ...prev,
            {
              ...g,
              joined: true,
              member_count: g.member_count + 1,
            },
          ]
      : prev.filter((x) => x.id !== g.id),
  );

  try {
    if (wantJoin) await reqJoin(g.id);
    else await reqLeave(g.id);
  } catch {
    // 실패 시 롤백: 서버 기준으로 재조회
    const [all, mine] = await Promise.all([fetchAll(), fetchMine()]);
    setAll(all);
    setMine(mine);
    alert("요청이 실패했어요. 다시 시도해주세요.");
  }
};
void toggleJoin;
  const adaptForCard = (g: GroupView) => ({
    group_id: g.id,
    title: g.name ?? "이름 없음",
    bio: g.bio ?? "소개가 없습니다.",
    recent_act: g.created_at ? timeAgo(g.created_at) : "방금",
    members: g.member_count,
    groups_img_url: g.profile_image_url ?? "",
  });

  const mySection = useMemo(() => myGroups, [myGroups]);

  return (
    <div className="max-w-[1280px] min-w-250 mx-auto px-6 md:px-8">
      {/* 내가 활동 중인 그룹 */}
      <section className="mt-8 md:mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            내가 활동 중인 그룹
          </h2>

          <Link
            to="/groups/create"
            className="inline-flex h-9 items-center rounded-xl bg-[#8B5CF6] px-4 text-sm font-medium text-white hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            그룹 만들기
          </Link>
        </div>

        {loading ? (
          <p className="mt-5 text-sm text-gray-500">불러오는 중…</p>
        ) : mySection.length === 0 ? (
          <div className="mt-5">
            <p>참여한 그룹이 없습니다.</p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mySection.map((g) => {
              const card = adaptForCard(g);
              return (
                <div key={g.id} className="space-y-2">
                  <GroupCard group={card} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 전체 그룹 */}
      <section className="mt-12 md:mt-16">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          전체 그룹
        </h2>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-5 text-sm text-gray-500">불러오는 중…</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {allGroups.map((g) => {
              const card = adaptForCard(g);
              return (
                <div key={g.id} className="space-y-2">
                  <Link to={`${card.title}/posts`}>
                    <GroupCard group={card} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
