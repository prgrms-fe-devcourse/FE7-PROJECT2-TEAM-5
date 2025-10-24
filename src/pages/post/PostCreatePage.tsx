import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";
import Input from "../../components/Input";
import { updateGroupActivity } from "../../utils/groupActivity";
import InputFile from "../../components/InputFile";
import FileUpload from "../../components/FileUpload";
import { checkAndGrantBadge } from "../../hooks/useBadgeHook";
import { uploadFile } from "../../utils/fileUpload";

// 게시글 생성 페이지
export default function PostCreatePage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const profile = useProfileStore((state) => state.profile);
	const [boardType, setBoardType] = useState("");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [inputTag, setInputTag] = useState<string>("");
	const [hashTag, setHashTag] = useState<string[]>([]);
	const [imgFiles, setImgFiles] = useState<
		{ file: string; fileName: string }[]
	>([]);
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

	let boardTypes = [
		{ key: "free", label: "자유게시판" },
		{ key: "elementary", label: "초등학생 게시판" },
		{ key: "middle", label: "중학교 게시판" },
		{ key: "high", label: "고등학교 게시판" },
	];
	if (profile && profile.role === "teacher") {
		boardTypes.push({ key: "resources", label: "자료 공유 게시판" });
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!boardType || !title || !content || !profile?.auth_id) {
			alert("필수 항목을 작성해주세요");
			return;
		}
		try {
			if (id) {
				// 기존 게시글 수정
				const { data, error } = await supabase
					.from("posts")
					.update({
						board_type: boardType,
						title,
						content,
						hash_tag: hashTag,
					})
					.eq("id", id)
					.eq("user_id", profile?.auth_id)
					.select();

				const { error: fileDeleteError } = await supabase
					.from("files")
					.delete()
					.eq("post_id", id);
				if (fileDeleteError) throw fileDeleteError;

				// 기존 이미지 파일 처리
				for (const file of imgFiles) {
					const { data: fileData, error: fileError } = await supabase
						.from("files")
						.insert([
							{
								post_id: id,
								file_path: file.file,
								file_name: file.fileName,
							},
						])
						.select();
					if (fileError) throw fileError;
					if (!fileData) {
						alert("이미지 파일 등록 실패");
					}
				}

				// 새로 업로드된 파일 처리
				for (const uploadedFile of uploadedFiles) {
					const uploadResult = await uploadFile(uploadedFile, id);
					if (uploadResult) {
						const { data: fileData, error: fileError } =
							await supabase
								.from("files")
								.insert([
									{
										post_id: id,
										file_path: uploadResult.filePath,
										file_name: uploadResult.fileName,
									},
								])
								.select();
						if (fileError) throw fileError;
						if (!fileData) {
							alert("파일 등록 실패");
						}
					}
				}

				if (error) throw error;

				if (data) {
					// 그룹 게시글인 경우 그룹 활동 시간 업데이트
					if (boardType === "group" && data[0]?.group_id) {
						await updateGroupActivity(data[0].group_id);
					}

					alert("게시글이 수정되었습니다.");

					navigate("/posts/" + id);
				}
			} else {
				// 신규 게시글 등록
				const { data: postData, error: postError } = await supabase
					.from("posts")
					.insert([
						{
							board_type: boardType,
							title,
							content,
							hash_tag: hashTag,
							user_id: profile?.auth_id,
						},
					])
					.select()
					.single();

				// 그룹 게시글인 경우 그룹 활동 시간 업데이트
				if (boardType === "group" && postData?.group_id) {
					await updateGroupActivity(postData.group_id);
				}

				// 기존 이미지 파일 처리
				for (const file of imgFiles) {
					const { data: fileData, error: fileError } = await supabase
						.from("files")
						.insert([
							{
								post_id: postData?.id,
								file_path: file.file,
								file_name: file.fileName,
							},
						])
						.select();
					if (fileError) throw fileError;
					if (!fileData) {
						alert("이미지 파일 등록 실패");
					}
				}

				// 새로 업로드된 파일 처리
				for (const uploadedFile of uploadedFiles) {
					const uploadResult = await uploadFile(
						uploadedFile,
						postData.id,
					);
					if (uploadResult) {
						const { data: fileData, error: fileError } =
							await supabase
								.from("files")
								.insert([
									{
										post_id: postData.id,
										file_path: uploadResult.filePath,
										file_name: uploadResult.fileName,
									},
								])
								.select();
						if (fileError) throw fileError;
						if (!fileData) {
							alert("파일 등록 실패");
						}
					}
				}

				if (postError) throw postError;

				if (postData) {
					alert("게시글이 등록되었습니다.");
					console.log(postData);

					// 게시글 등록 후 뱃지 체크
					await checkAndGrantBadge(profile.auth_id);

					navigate("/posts/" + postData.id);
				}
			}
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		if (id) {
			const fetchPost = async () => {
				try {
					const { data: posts, error } = await supabase
						.from("posts")
						.select("*")
						.eq("id", id)
						.single();
					if (error) throw error;
					if (posts) {
						setTitle(posts.title);
						setBoardType(posts.board_type);
						setContent(posts.content);
						setHashTag(posts.hash_tag);
					}
					const { data: flies, error: fileError } = await supabase
						.from("files")
						.select("file_path, file_name")
						.eq("post_id", id);
					if (fileError) throw fileError;
					console.log(flies);

					// if (flies && flies.length > 0) {
					// 	setImgFiles((prev) => [
					// 		...prev,
					// 		...flies.map((file) => ({
					// 			file: file.file_path,
					// 			fileName: file.file_name,
					// 		})),
					// 	]);
					// }
				} catch (e) {
					console.error(e);
				}
			};
			fetchPost();
		} else {
			setTitle("");
			setBoardType("");
			setContent("");
			setHashTag([]);
		}
	}, [id]);
	const removeTag = (index: number) => {
		const newHashTag = [
			...hashTag.slice(0, index),
			...hashTag.slice(index + 1),
		];
		setHashTag(newHashTag);
	};
	const activeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const tag = inputTag.trim();
		if (tag && e.key === "Enter" && !e.nativeEvent.isComposing) {
			e.preventDefault();
			if (hashTag && !hashTag.includes(tag)) {
				let hashTags = [...hashTag, tag.replace(/ /g, "")];
				setHashTag(hashTags);
				setInputTag("");
			} else {
				alert("중복된 태그입니다.");
			}
		}
	};
	return (
		<>
			<div className="min-w-250 px-4">
				<h2 className="mb-6 text-[32px] font-bold">글 작성하기</h2>

				<form method="post" onSubmit={handleSubmit}>
					<div className="flex flex-col gap-5.5 px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
						<div className="relative px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB]">
							<select
								className="w-full peer outline-none user-invalid:border-red-500"
								name="board"
								id="board"
								required
								value={boardType}
								onChange={(e) => setBoardType(e.target.value)}
							>
								<option value="" disabled></option>
								{boardTypes.map((bt) => (
									<option key={bt.key} value={bt.key}>
										{bt.label}
									</option>
								))}
							</select>
							<label
								htmlFor="board"
								className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-100 ease-in-out 
								peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6] 
								peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]
							    "
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

						{/* 이미지 업로드 */}
						<InputFile
							imgFiles={imgFiles}
							setImgFiles={setImgFiles}
							isMulti={true}
						/>

						{/* 자료공유 게시판일 때만 파일 업로드 표시 */}
						{boardType === "resources" && (
							<div>
								<h3 className="text-lg font-semibold text-gray-800 mb-3">
									파일 첨부
								</h3>
								<FileUpload
									uploadedFiles={uploadedFiles}
									setUploadedFiles={setUploadedFiles}
									isMulti={true}
									maxFileSizeMB={10}
									label="자료 파일을 업로드하세요"
								/>
							</div>
						)}

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

						<div className="flex flex-col">
							<div className="relative w-full px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500">
								{hashTag.length < 10 && (
									<div>
										<Input
											id="hashTag"
											type="text"
											value={inputTag}
											onChange={(e) =>
												setInputTag(e.target.value)
											}
											onKeyDown={(e) => activeEnter(e)}
										>
											해시태그
										</Input>
									</div>
								)}
								{hashTag.length >= 10 && (
									<div>
										<Input
											id="hashTag"
											type="text"
											readOnly
											value={
												"해시태그는 10개까지 입력이 가능합니다."
											}
											onChange={(e) =>
												setInputTag(e.target.value)
											}
											onKeyDown={(e) => activeEnter(e)}
										></Input>
									</div>
								)}
							</div>
							<p className="mt-2 text-xs text-[#C8C8C8]">
								예: 수학, AI, 공부법 (각각 태그 입력 후 Enter)
							</p>
							<div className="flex flex-wrap gap-2 mt-2 max-w-[920px]">
								{hashTag &&
									hashTag.map((tag, index) => (
										<div key={tag}>
											<button
												id="tag"
												type="button"
												className="px-3 py-2 bg-[#EDE9FE] text-[#8B5CF6] text-sm rounded-lg text-left break-all cursor-pointer"
												onClick={() => removeTag(index)}
											>
												{"#" + tag} x
											</button>
										</div>
									))}
							</div>
						</div>
					</div>
					<div className="flex justify-end mt-7 gap-2">
						<Link
							to="/posts"
							className="px-4 py-2.5 text-sm rounded-xl bg-white text-[#8B5CF6]
						font-Regular hover:bg-[#B08DFF] hover:text-white cursor-pointer border-1 border-[#8B5CF6]"
						>
							취소
						</Link>
						<button
							type="submit"
							className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6]  hover:bg-[#B08DFF] cursor-pointer"
						>
							{id ? "수정" : "등록"}
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
