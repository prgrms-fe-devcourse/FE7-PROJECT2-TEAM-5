import { useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";

// 게시글 생성 페이지
export default function PostCreatePage() {
	const navigate = useNavigate();
	const profile = useProfileStore((state) => state.profile);
	const [boardType, setBoardType] = useState("");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [inputTag, setInputTag] = useState<string>("");
	const [hashTag, setHashTag] = useState<string[]>([]);
	const [imgFiles, setImgFiles] = useState<string[]>([]);

	const boardTypes = [
		"자유게시판",
		"초등학생 게시판",
		"중학생 게시판",
		"고등학생 게시판",
		"자료 공유 게시판",
	];

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!boardType || !title || !content || !profile?.auth_id) {
			alert("필수 항목을 작성해주세요");
			return;
		}
		try {
			const { data, error } = await supabase
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
				.select();

			if (error) throw error;
			if (data) {
				alert("게시글이 등록되었습니다.");
				navigate("/postList");
			}
		} catch (e) {
			console.error(e);
		}
	};

	const handleImgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			Array.from(files).map((file) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					setImgFiles((prev) => [
						...prev,
						e.target?.result as string,
					]);
				};
				reader.readAsDataURL(file);
			});
		}
		console.log(imgFiles);
	};

	const removeImgFiles = () => {
		setImgFiles([]);
	};
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
			if (!hashTag.includes(tag)) {
				let hashTags = [...hashTag, tag];
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
									<option key={bt} value={bt}>
										{bt}
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
							<input
								id="title"
								className="peer w-full resize-none outline-none align-middle"
								required
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<label
								htmlFor="title"
								className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-100 ease-in-out 
								peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6] 
								peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]
							    "
							>
								제목
							</label>
							<label
								htmlFor="title"
								className="absolute hidden left-6 -top-2 bg-white text-sm text-red-500 peer-user-invalid:block "
							>
								내용을 입력하세요.
							</label>
						</div>

						{imgFiles[0] && (
							<div className="relative flex flex-col items-center px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB]">
								<div className="relative pb-2">
									<img
										src={imgFiles[0]}
										alt={"image" + 0}
										className="relative z-2 max-h-50 min-h-30 object-cover bg-white"
									/>
									{imgFiles.length > 1 && (
										<img
											src={imgFiles[0]}
											alt={"image" + 0}
											className="absolute top-2 left-2 z-1 max-h-50 min-h-30 object-cover opacity-50"
										/>
									)}
									<div className="absolute z-2 -bottom-2 -right-4 px-3.5 py-1.5 text-xm text-[#6B7280] font-bold bg-white border-1 border-[#E5E7EB] rounded-3xl">
										{imgFiles.length}
									</div>
								</div>

								<button
									type="button"
									className="absolute top-1.5 right-1.5 p-1 rounded-xl text-red-500 border-1 border-[#E5E7EB] cursor-pointer"
									onClick={removeImgFiles}
								>
									<X size={18} />
								</button>
							</div>
						)}
						{!imgFiles[0] && (
							<div className="flex flex-col items-center px-6 py-4 rounded-xl bg-white border-2 border-[#E5E7EB] border-dashed">
								<input
									id="imgFile"
									accept="image/*"
									className="hidden"
									type="file"
									name="imgFile"
									onChange={handleImgFileUpload}
									multiple
								/>
								<p className="text-[#6B7280]">Upload image</p>
								<label
									htmlFor="imgFile"
									className="px-6 py-4 rounded-xl text-[#6B7280] bg-[#E5E7EB] cursor-pointer"
								>
									Choose Img File
								</label>
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
										<input
											id="hashTag"
											type="text"
											className="peer w-full resize-none outline-none"
											value={inputTag}
											onChange={(e) =>
												setInputTag(e.target.value)
											}
											onKeyDown={(e) => activeEnter(e)}
										/>
										<label
											htmlFor="hashTag"
											className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-100 ease-in-out 
											peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6]
											peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]"
										>
											해시태그
										</label>
									</div>
								)}
								{hashTag.length >= 10 && (
									<div>
										<input
											id="hashTag"
											type="text"
											className="peer w-full resize-none outline-none text-[#C8C8C8]"
											readOnly
											value={
												"해시태그는 10개까지 입력이 가능합니다."
											}
											onChange={(e) =>
												setInputTag(e.target.value)
											}
											onKeyDown={(e) => activeEnter(e)}
										/>
									</div>
								)}
							</div>
							<p className="mt-2 text-xs text-[#C8C8C8]">
								예: 수학, AI, 공부법 (각각 태그 입력 s후 Enter)
							</p>
							<div className="flex flex-wrap gap-2 mt-2 max-w-[920px]">
								{hashTag.map((tag, index) => (
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
							to="/postList"
							className="px-4 py-2.5 text-sm rounded-xl bg-white text-[#8B5CF6]
						font-Regular hover:bg-[#B08DFF] hover:text-white cursor-pointer border-1 border-[#8B5CF6]"
						>
							삭제
						</Link>
						<button
							type="submit"
							className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6]  hover:bg-[#B08DFF] cursor-pointer"
						>
							등록
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
