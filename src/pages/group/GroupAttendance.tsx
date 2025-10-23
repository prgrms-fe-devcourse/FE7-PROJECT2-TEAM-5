import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";

type GroupRow = { id: string; name: string | null };
type Badge = { id: string; name: string; icon_url: string | null };
type CommentVM = {
	id: string;
	content: string;
	created_at: string;
	user_id: string;
	user: {
		nickname: string;
		profile_image_url?: string | null;
		representative_badge_id?: string | null;
		major?: string | null;
		badge?: Badge | null;
	};
};

const looksLikeUUID = (s: string) =>
	/^[0-9a-fA-F-]{36}$/.test(s) && (s.match(/-/g)?.length ?? 0) === 4;

const fmtKoreanDate = (d: Date) => {
	const w = ["일", "월", "화", "수", "목", "금", "토"];
	return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${w[d.getDay()]}요일`;
};
const toISODate = (d: Date) => d.toISOString().slice(0, 10);

export default function GroupAttendancePage() {
	const navigate = useNavigate();
	const { groupId: rawGroupId = "" } = useParams();

	const currentUserId = useProfileStore((s) => s.currentUserId);
	const isLoggedIn = useProfileStore((s) => s.isLoggedIn);
	const myProfile = useProfileStore((s) => s.profile);

	const [group, setGroup] = useState<GroupRow | null>(null);
	const [postId, setPostId] = useState<string>("");
	const [comments, setComments] = useState<CommentVM[]>([]);
	const [input, setInput] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const today = useMemo(() => new Date(), []);
	const todayISO = useMemo(() => toISODate(today), [today]);
	const todayKorean = useMemo(() => fmtKoreanDate(today), [today]);

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

	const ensureAttendancePost = async (
		gid: string,
		dateISO: string,
		authorId: string,
	) => {
		const titleKey = `${dateISO} 출석`;
		const contentDisplay = `${fmtKoreanDate(new Date(dateISO))} 출석`;
		const { data: found, error: selErr } = await supabase
			.from("posts")
			.select("id")
			.eq("group_id", gid)
			.eq("board_type", "group")
			.eq("group_board_type", "attendance")
			.eq("title", titleKey)
			.order("created_at", { ascending: false })
			.limit(1);
		if (selErr) throw selErr;
		if (found && found.length > 0 && found[0]?.id)
			return found[0].id as string;

		const { data: created, error: insErr } = await supabase
			.from("posts")
			.insert([
				{
					board_type: "group",
					group_board_type: "attendance",
					group_id: gid,
					title: titleKey,
					content: contentDisplay,
					user_id: authorId,
					hash_tag: [],
				},
			])
			.select("id")
			.limit(1);
		if (insErr) throw insErr;
		const newId = created?.[0]?.id as string | undefined;
		if (!newId) throw new Error("출석 게시글 생성 실패");
		return newId;
	};

	const fetchCommentsWithAuthor = async (pid: string) => {
		const { data, error } = await supabase
			.from("comments")
			.select(
				`
        id, content, created_at, user_id,
        users(
          nickname,
          profile_image_url,
          representative_badge_id,
          major
        )
      `,
			)
			.eq("post_id", pid)
			.order("created_at", { ascending: true });
		if (error) throw error;

		const base: CommentVM[] = (data ?? []).map((c: any) => ({
			id: c.id,
			content: c.content,
			created_at: c.created_at,
			user_id: c.user_id,
			user: {
				nickname: c.users?.nickname ?? "unknown",
				profile_image_url: c.users?.profile_image_url ?? null,
				representative_badge_id:
					c.users?.representative_badge_id ?? null,
				major:
					c.users?.major ??
					(c.user_id === currentUserId
						? ((myProfile as any)?.major ?? null)
						: null),
				badge: null,
			},
		}));

		const badgeLogIds = Array.from(
			new Set(
				base
					.map((b) => b.user.representative_badge_id)
					.filter(Boolean) as string[],
			),
		);

		const badgeIdByLogId = new Map<string, string>();
		if (badgeLogIds.length > 0) {
			const { data: logs, error: logErr } = await supabase
				.from("badge_logs")
				.select("id, badge_id")
				.in("id", badgeLogIds);
			if (logErr) throw logErr;
			for (const row of logs ?? []) {
				if (row?.id && row?.badge_id)
					badgeIdByLogId.set(row.id, row.badge_id);
			}
		}

		const needLatestForUser = new Set(
			base
				.filter((b) => !b.user.representative_badge_id)
				.map((b) => b.user_id),
		);

		const latestBadgeIdByUser = new Map<string, string>();
		if (needLatestForUser.size > 0) {
			const { data: allLogs, error: allErr } = await supabase
				.from("badge_logs")
				.select("user_id,badge_id,created_at")
				.in("user_id", Array.from(needLatestForUser))
				.order("created_at", { ascending: false });
			if (allErr) throw allErr;
			for (const row of allLogs ?? []) {
				const uid = row.user_id as string;
				if (!latestBadgeIdByUser.has(uid) && row.badge_id) {
					latestBadgeIdByUser.set(uid, row.badge_id as string);
				}
			}
		}

		const badgeIds = new Set<string>();
		for (const item of base) {
			const logId = item.user.representative_badge_id;
			if (logId && badgeIdByLogId.has(logId))
				badgeIds.add(badgeIdByLogId.get(logId)!);
		}
		for (const [, bid] of latestBadgeIdByUser) badgeIds.add(bid);

		const badgeById = new Map<string, Badge>();
		if (badgeIds.size > 0) {
			const { data: badges, error: bErr } = await supabase
				.from("badges")
				.select("id, name, icon_url")
				.in("id", Array.from(badgeIds));
			if (bErr) throw bErr;
			for (const b of badges ?? []) {
				badgeById.set(b.id, {
					id: b.id,
					name: b.name,
					icon_url: b.icon_url ?? null,
				});
			}
		}

		for (const item of base) {
			const logId = item.user.representative_badge_id;
			let badgeId: string | undefined;
			if (logId && badgeIdByLogId.has(logId))
				badgeId = badgeIdByLogId.get(logId)!;
			if (!badgeId && latestBadgeIdByUser.has(item.user_id))
				badgeId = latestBadgeIdByUser.get(item.user_id)!;
			if (badgeId) item.user.badge = badgeById.get(badgeId) ?? null;
		}

		return base;
	};

	const submitAttendanceComment = async () => {
		const content = input.trim();
		if (!content) return;
		if (!postId || !group?.id) return;
		if (!isLoggedIn || !currentUserId) {
			alert("로그인이 필요합니다.");
			return;
		}
		try {
			setSubmitting(true);
			const { data: dup, error: dupErr } = await supabase
				.from("comments")
				.select("id")
				.eq("post_id", postId)
				.eq("user_id", currentUserId)
				.maybeSingle();
			if (dupErr) throw dupErr;
			if (dup) {
				alert("이미 출석하셨습니다.");
				return;
			}
			const optimistic: CommentVM = {
				id: `tmp_${Date.now()}`,
				content,
				created_at: new Date().toISOString(),
				user_id: currentUserId,
				user: {
					nickname: (myProfile as any)?.nickname ?? "me",
					profile_image_url:
						(myProfile as any)?.profile_image_url ?? null,
					representative_badge_id:
						(myProfile as any)?.representative_badge_id ?? null,
					major: (myProfile as any)?.major ?? null,
					badge: null,
				},
			};
			setComments((prev) => [...prev, optimistic]);
			setInput("");
			const { error: insErr } = await supabase
				.from("comments")
				.insert([{ post_id: postId, user_id: currentUserId, content }]);
			if (insErr) throw insErr;
			const refreshed = await fetchCommentsWithAuthor(postId);
			setComments(refreshed);
		} catch (e) {
			console.error("[attendance submit error]", e);
			alert("출석 등록에 실패했습니다.");
			if (postId) {
				try {
					const refreshed = await fetchCommentsWithAuthor(postId);
					setComments(refreshed);
				} catch {}
			}
		} finally {
			setSubmitting(false);
		}
	};

	const assertMembership = async (gid: string, uid: string) => {
		const { data, error } = await supabase
			.from("group_members")
			.select("id")
			.eq("group_id", gid)
			.eq("user_id", uid)
			.maybeSingle();
		if (error) throw error;
		return !!data;
	};

	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				if (!isLoggedIn || !currentUserId) {
					alert("로그인 후 이용할 수 있습니다.");
					navigate("/groups", { replace: true });
					return;
				}
				const g = await resolveGroup(rawGroupId);
				if (!alive) return;
				setGroup(g);
				const isMember = await assertMembership(g.id, currentUserId);
				if (!isMember) {
					alert("이 그룹의 멤버만 출석을 볼 수 있어요.");
					navigate("/groups", { replace: true });
					return;
				}
				const pid = await ensureAttendancePost(
					g.id,
					todayISO,
					currentUserId,
				);
				if (!alive) return;
				setPostId(pid);
				const list = await fetchCommentsWithAuthor(pid);
				if (!alive) return;
				setComments(list);
			} catch (e) {
				console.error("[attendance init error]", e);
				alert("출석 데이터를 불러오지 못했습니다.");
				navigate("/groups", { replace: true });
			}
		})();
		return () => {
			alive = false;
		};
	}, [rawGroupId, navigate, isLoggedIn, currentUserId, todayISO]);

	return (
		<div className="w-[920px] mx-auto">
			<div className="mt-6 mb-4 border-b border-gray-200 pb-3">
				<h3 className="text-[20px] font-semibold">
					{todayKorean} 출석 현황
				</h3>
			</div>

			{comments.length === 0 ? (
				<p className="text-center text-gray-500 py-16">
					아직 아무도 출석하지 않았습니다…
				</p>
			) : (
				<ul className="space-y-3">
					{comments.map((c) => (
						<li
							key={c.id}
							className="rounded-xl bg-white border border-gray-200 px-4 py-3 shadow-sm"
						>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
										{c.user.profile_image_url ? (
											<img
												src={c.user.profile_image_url}
												alt={c.user.nickname}
												className="h-8 w-8 object-cover"
											/>
										) : null}
									</div>
									<div>
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{c.user.nickname}
											</span>
											{c.user.badge ? (
												<span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded ">
													{c.user.badge.icon_url ? (
														<img
															src={
																c.user.badge
																	.icon_url
															}
															alt={
																c.user.badge
																	.name
															}
															className="h-3 w-3 object-contain"
														/>
													) : null}
													{c.user.badge.name}
												</span>
											) : null}
											{c.user.major ? (
												<span className="text-[12px] text-gray-500">
													{c.user.major}
												</span>
											) : null}
										</div>
										<p className="text-[13px] text-gray-600 mt-1 break-words">
											{c.content}
										</p>
									</div>
								</div>
								<span className="text-[12px] text-gray-400 mt-1">
									{new Date(c.created_at).toLocaleDateString(
										"ko-KR",
									)}
								</span>
							</div>
						</li>
					))}
				</ul>
			)}

			<div className="flex items-center gap-2 mt-6">
				<input
					type="text"
					placeholder="댓글을 작성해주세요."
					className="flex-1 h-10 rounded-xl border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-300"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.nativeEvent.isComposing)
							submitAttendanceComment();
					}}
				/>
				<button
					type="button"
					onClick={submitAttendanceComment}
					disabled={submitting || !input.trim()}
					className="h-10 px-4 rounded-xl bg-[#8B5CF6] text-white text-sm hover:bg-[#7C3AED] disabled:opacity-60"
				>
					{submitting ? "등록 중…" : "등록"}
				</button>
			</div>
		</div>
	);
}
// dddddd
