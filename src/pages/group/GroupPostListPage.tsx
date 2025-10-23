import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import supabase from "../../utils/supabase";
import PostTabContainer from "../../components/PostTabContainer";
import PostList from "../../components/PostList";
import PageNation from "../../components/PageNation";
import GroupAttendancePage from "./GroupAttendance";
import GroupMembers from "./GroupMembers";
import { useProfileStore } from "../../stores/profileStore";
import type { Friend } from "../../types/friend";
import { useMemberStore } from "../../stores/memberStore";
import PostListSkeleton from "../../components/loading/post/PostListSkeleton";
import GroupMemberSkeleton from "../../components/loading/group/GroupMemberSkeleton";
import GroupAttendanceSkeleton from "../../components/loading/group/GroupAttendanceSkeleton";

type GroupRow = {
	id: string;
	name: string | null;
};

const TABS = [
	{ key: "notice", label: "공지사항" },
	{ key: "activity", label: "활동게시판" },
	{ key: "attendance", label: "출석" },
	{ key: "members", label: "멤버" },
] as const;

const looksLikeUUID = (s: string) =>
	/^[0-9a-fA-F-]{36}$/.test(s) && (s.match(/-/g)?.length ?? 0) === 4;

export default function GroupPostListPage() {
	const navigate = useNavigate();
	const { groupId: groupParam = "" } = useParams();

	const [activeTab, setActiveTab] = useState<string>(TABS[0].key);
	const [group, setGroup] = useState<GroupRow | null>(null);
	const [members, setMembers] = useState<Friend[]>([]);
	const [posts, setPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const isLoggedIn = useProfileStore((s) => s.isLoggedIn);
	const currentUserId = useProfileStore((s) => s.currentUserId);
	const { fetchUserFollowings } = useMemberStore();

	const postsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = useMemo(
		() => Math.ceil(posts.length / postsPerPage),
		[posts.length],
	);

	const displayedPosts = useMemo(
		() =>
			posts.slice(
				(currentPage - 1) * postsPerPage,
				currentPage * postsPerPage,
			),
		[posts, currentPage, postsPerPage],
	);

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

	const fetchGroupPosts = async (gid: string, tab: string) => {
		if (tab === "attendance" || tab === "members") return [] as any[];

		let query = supabase
			.from("posts")
			.select(
				`
        id, user_id, board_type, title, content, created_at,
        adopted_comment_id, hash_tag, group_id, group_board_type,
        users(nickname),
        likes:post_likes(id),
        comments:comments!comments_post_id_fkey(id)
        `,
			)
			.eq("group_id", gid)
			.eq("board_type", "group")
			.order("created_at", { ascending: false });

		if (tab === "notice") query = query.eq("group_board_type", "notice");
		if (tab === "activity")
			query = query.eq("group_board_type", "activity");

		const { data, error } = await query;
		if (error) throw error;

		return (data ?? []) as any[];
	};

	useEffect(() => {
		let alive = true;

		(async () => {
			try {
				setLoading(true);
				setCurrentPage(1);

				const {
					data: { session },
				} = await supabase.auth.getSession();
				const uid = session?.user?.id ?? null;

				if (!uid) {
					alert("로그인 후 이용할 수 있습니다.");
					navigate("/groups", { replace: true });
					return;
				}

				const g = await resolveGroup(groupParam);
				if (!alive) return;
				setGroup(g);

				const { data: membership, error: mErr } = await supabase
					.from("group_members")
					.select("*")
					.eq("group_id", g.id)
					.eq("user_id", uid)
					.maybeSingle();

				if (mErr) throw mErr;
				if (!membership) {
					alert("이 그룹의 멤버만 접근할 수 있어요.");
					navigate("/groups", { replace: true });
					return;
				}

				if (activeTab === "members") {
					const memberList = await fetchUserFollowings(uid, g.id);
					if (!memberList) return;
					setMembers(memberList);
				}

				const list = await fetchGroupPosts(g.id, activeTab);
				if (!alive) return;
				setPosts(list);
			} catch (e) {
				console.error("[group list error]", e);
				if (alive) {
					setGroup(null);
					setPosts([]);
					alert("그룹 게시글을 불러오지 못했어요.");
					navigate("/groups", { replace: true });
				}
			} finally {
				if (alive) setLoading(false);
			}
		})();

		return () => {
			alive = false;
		};
	}, [
		groupParam,
		activeTab,
		isLoggedIn,
		currentUserId,
		navigate,
		fetchUserFollowings,
	]);

	return (
		<div className="w-[920px]">
			{loading ? (
				activeTab === "notice" || activeTab === "activity" ? (
					<PostListSkeleton />
				) : activeTab === "attendance" ? (
					<GroupAttendanceSkeleton />
				) : (
					<GroupMemberSkeleton />
				)
			) : (
				<>
					<div className="flex items-center justify-between">
						<h2 className="text-[28px] md:text-[32px] font-semibold tracking-tight">
							{group?.name ?? "그룹"}
						</h2>

						{activeTab !== "attendance" &&
							activeTab !== "members" &&
							group?.id && (
								<button
									type="button"
									onClick={() =>
										navigate(
											`/groups/${group.id}/posts/create`,
										)
									}
									className="inline-flex h-9 items-center rounded-xl bg-[#8B5CF6] px-4 text-sm font-medium text-white hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-violet-300"
								>
									새 글 작성
								</button>
							)}
					</div>

					{/* 탭 */}
					<div className="mt-4">
						<PostTabContainer
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							title=""
							tabs={
								TABS as unknown as {
									key: string;
									label: string;
								}[]
							}
						/>
					</div>

					<div className="border-t border-gray-300 mt-2 pt-6">
						{(activeTab === "notice" ||
							activeTab === "activity") && (
							<div>
								{posts.length === 0 ? (
									<p className="mt-12 text-center text-sm text-gray-500">
										게시글이 없습니다.
									</p>
								) : (
									<PostList
										posts={displayedPosts as any}
										groupId={group?.id}
									/>
								)}

								<PageNation
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={setCurrentPage}
								/>
							</div>
						)}

						{activeTab === "attendance" && <GroupAttendancePage />}

						{activeTab === "members" && (
							<GroupMembers
								members={members}
								userId={currentUserId!}
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
}
