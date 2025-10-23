import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";
import Input from "../../components/Input";
import InputFile from "../../components/InputFile";
import { updateGroupActivity } from "../../utils/groupActivity";

type GroupRow = {
	id: string;
	name: string | null;
};

type BoardKey = "notice" | "activity";

const BOARD_OPTIONS: { key: BoardKey; label: string }[] = [
	{ key: "notice", label: "그룹-공지사항" },
	{ key: "activity", label: "그룹-활동게시판" },
];

const looksLikeUUID = (s: string) =>
	/^[0-9a-fA-F-]{36}$/.test(s) && (s.match(/-/g)?.length ?? 0) === 4;

export default function GroupPostCreatePage() {
	const navigate = useNavigate();
	const { groupId: rawGroupId = "" } = useParams();
	const profile = useProfileStore((s) => s.profile);
	const [boardType, setBoardType] = useState<BoardKey>("notice");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [inputTag, setInputTag] = useState("");
	const [hashTag, setHashTag] = useState<string[]>([]);
	const [imgFiles, setImgFiles] = useState<
		{ file: string; fileName: string }[]
	>([]);

	const [group, setGroup] = useState<GroupRow | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

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

	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				setLoading(true);
				const g = await resolveGroup(rawGroupId);
				if (!alive) return;
				setGroup(g);
			} catch (e) {
				console.error(e);
				alert("그룹 정보를 불러오지 못했어요.");
				navigate("/groups");
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, [rawGroupId, navigate]);

	const commitTag = () => {
		const tag = inputTag.trim();
		if (!tag) return;
		if (hashTag.length >= 10) return;
		if (hashTag.includes(tag)) {
			setInputTag("");
			return;
		}
		setHashTag((prev) => [...prev, tag]);
		setInputTag("");
	};

	const onTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.nativeEvent.isComposing) {
			e.preventDefault();
			commitTag();
		}
	};

	const removeTag = (index: number) =>
		setHashTag((prev) => [
			...prev.slice(0, index),
			...prev.slice(index + 1),
		]);

	// 제출
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!group?.id) {
			alert("그룹 정보가 없습니다.");
			return;
		}
		if (!title.trim() || !content.trim()) {
			alert("제목/내용을 입력하세요.");
			return;
		}
		if (!profile?.auth_id) {
			alert("로그인이 필요합니다.");
			return;
		}

		try {
			setSubmitting(true);

			// 1) 게시글 생성
			const { data: postData, error: postError } = await supabase
				.from("posts")
				.insert([
					{
						board_type: "group",
						group_id: group.id,
						group_board_type: boardType,
						title,
						content,
						hash_tag: hashTag,
						user_id: profile.auth_id,
					},
				])
				.select("id")
				.limit(1);

			if (postError) throw postError;
			const newPostId = postData?.[0]?.id as string | undefined;
			if (!newPostId) throw new Error("게시글 ID를 가져오지 못했습니다.");

			// 그룹 활동 시간 업데이트
			await updateGroupActivity(group.id);

			if (imgFiles.length > 0) {
				const rows = imgFiles.map((f) => ({
					post_id: newPostId,
					file_path: f.file,
					file_name: f.fileName,
				}));
				const { error: filesErr } = await supabase
					.from("files")
					.insert(rows);
				if (filesErr) throw filesErr;
			}

			alert("게시글이 등록되었습니다.");

			navigate(`/groups/${group.id}/posts`, { replace: true });
		} catch (e) {
			console.error(e);
			alert("등록에 실패했어요. 권한/RLS 정책을 확인해 주세요.");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="min-w-250 px-4">
				<h2 className="mb-6 text-[32px] font-bold">
					그룹 게시판 작성하기
				</h2>
				<p className="text-sm text-gray-500">불러오는 중…</p>
			</div>
		);
	}

	return (
		<div className="min-w-250 px-4">
			<h2 className="mb-6 text-[32px] font-bold">그룹 게시판 작성하기</h2>

			<form method="post" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-5.5 px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					{/* 게시판 선택 */}
					<div className="relative px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB]">
						<select
							className="w-full peer outline-none user-invalid:border-red-500"
							name="board"
							id="board"
							required
							value={boardType}
							onChange={(e) =>
								setBoardType(e.target.value as BoardKey)
							}
						>
							{BOARD_OPTIONS.map((bt) => (
								<option key={bt.key} value={bt.key}>
									{bt.label}
								</option>
							))}
						</select>
						<label
							htmlFor="board"
							className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-100 ease-in-out 
              peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6] 
              peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]"
						>
							게시판
						</label>
						<label
							htmlFor="board"
							className="absolute hidden left-6 -top-2 text-sm bg-white text-red-500 peer-user-invalid:block"
						>
							게시판을 선택하세요.
						</label>
					</div>

					{/* 제목 */}
					<div className="relative w-full px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500">
						<Input
							id="title"
							required
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							validationText="제목을 입력하세요"
						>
							제목
						</Input>
					</div>

					<InputFile
						imgFiles={imgFiles}
						setImgFiles={setImgFiles}
						isMulti={true}
					/>

					{/* 내용 */}
					<div className="relative w-full px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500">
						<textarea
							id="content"
							rows={15}
							className="peer w-full resize-none outline-none align-middle"
							required
							wrap="hard"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
						<label
							htmlFor="content"
							className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-100 ease-in-out 
              peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6]
              peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]"
						>
							내용
						</label>
						<label
							htmlFor="content"
							className="absolute hidden left-6 -top-2 bg-white text-sm text-red-500 peer-user-invalid:block "
						>
							내용을 입력하세요.
						</label>
					</div>

					{/* 해시태그 */}
					<div className="flex flex-col">
						<div className="relative w-full px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500">
							{hashTag.length < 10 ? (
								<Input
									id="hashTag"
									type="text"
									value={inputTag}
									onChange={(e) =>
										setInputTag(e.target.value)
									}
									onKeyDown={onTagKeyDown}
								>
									해시태그
								</Input>
							) : (
								<Input
									id="hashTag"
									type="text"
									readOnly
									value={
										"해시태그는 10개까지 입력이 가능합니다."
									}
								/>
							)}
						</div>
						<p className="mt-2 text-xs text-[#C8C8C8]">
							예: 수학, AI, 공부법 (각각 태그 입력 후 Enter)
						</p>
						<div className="flex flex-wrap gap-2 mt-2 max-w-[920px]">
							{hashTag.map((tag, index) => (
								<div key={`${tag}-${index}`}>
									<button
										id="tag"
										type="button"
										className="px-3 py-2 bg-[#EDE9FE] text-[#8B5CF6] text-sm rounded-lg text-left break-all cursor-pointer"
										onClick={() => removeTag(index)}
									>
										#{tag} x
									</button>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* 하단 버튼 */}
				<div className="flex justify-end mt-7 gap-2">
					<button
						type="button"
						onClick={() => navigate(`/groups/${group?.id}/posts`)} // ✅ 그룹 페이지로
						className="px-4 py-2.5 text-sm rounded-xl bg-white text-[#8B5CF6]
            font-Regular hover:bg-[#B08DFF] hover:text-white cursor-pointer border-1 border-[#8B5CF6]"
					>
						삭제
					</button>

					<button
						type="submit"
						disabled={submitting}
						className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] hover:bg-[#B08DFF] cursor-pointer disabled:opacity-60"
					>
						{submitting ? "등록 중…" : "등록"}
					</button>
				</div>
			</form>
		</div>
	);
}
