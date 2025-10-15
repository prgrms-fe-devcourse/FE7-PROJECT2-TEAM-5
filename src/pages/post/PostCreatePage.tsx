import { useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import supabase from "../../utils/supabase";

// 게시글 생성 페이지
export default function PostCreatePage() {
	const navigate = useNavigate();
	// const profile = useAuthStore((state) => state.profile);
	const [boardType, setBoardType] = useState("");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [hashTag, setHashTag] = useState("");
	const [imgFile, setImgFile] = useState("");

	const boardTypes = [
		"자유게시판",
		"초등학생 게시판",
		"중학생 게시판",
		"고등학생 게시판",
		"자료 공유 게시판",
	];

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// if (!boardType || !title || !content || !profile?.id) {
		// 	alert("필수 항목을 작성해주세요");
		// 	return;
		// }
		try {
			const { data, error } = await supabase
				.from("posts")
				.insert([
					{
						boardType,
						title,
						content,
						hashTag,
						// profile_id: profile?.id,
					},
				])
				.select();

			// if (response.data && response.data.id) {
			// 	setNewPostId(response.data.id);
			// 	console.log(
			// 		"게시물 생성 성공 및 ID 가져오기:",
			// 		response.data.id,
			// 	);
			// 	// TODO: 생성된 ID를 사용하여 다른 작업 수행 (예: 다른 API 호출, 목록 새로고침 등)
			// }

			if (error) throw error;
			if (data) {
				alert("게시글이 등록되었습니다.");
				navigate("/postList");
			}
		} catch (e) {
			console.error(e);
		}
	};
	const hanleImgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setImgFile(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	const removeImgFile = () => {
		setImgFile("");
	};
	return (
		<>
			<div className="min-w-250 px-4">
				<h2 className="mb-6 text-[32px] font-bold">글 작성하기</h2>
				<div className="px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
					<form
						method="post"
						className="flex flex-col gap-5.5"
						onSubmit={handleSubmit}
					>
						<div className="relative px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB]">
							<select
								className="w-full peer outline-none user-invalid:border-red-500"
								name="board"
								id="board"
								required
								value={boardType}
								onChange={(e) => setBoardType(e.target.value)}
							>
								<option value="" disabled>
									게시판을 선택해주세요.
								</option>
								{boardTypes.map((bt) => (
									<option key={bt} value={bt}>
										{bt}
									</option>
								))}
							</select>
							<label
								htmlFor="board"
								className="absolute hidden right-4 top-15 text-sm text-red-500 peer-user-invalid:block"
							>
								게시판을 선택하세요.
							</label>
						</div>

						<div className="relative w-full px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500">
							<textarea
								id="title"
								rows={1}
								className="peer w-full resize-none outline-none align-middle"
								required
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<label
								htmlFor="title"
								className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-200 ease-in-out 
								peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6] 
								peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]
							    "
							>
								제목
							</label>
							<label
								htmlFor="title"
								className="absolute hidden right-4 top-15 text-sm text-red-500 peer-user-invalid:block"
							>
								제목을 입력하세요.
							</label>
						</div>

						{imgFile && (
							<div className="relative flex flex-col items-center px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB]">
								<img
									src={imgFile}
									alt="imgFile preview"
									className="max-h-50 object-cover"
								/>
								<button
									type="button"
									className="absolute top-1.5 right-1.5 p-1 rounded-xl text-red-500 bg-[#E5E7EB] cursor-pointer"
									onClick={removeImgFile}
								>
									<X />
								</button>
							</div>
						)}
						{!imgFile && (
							<div className="flex flex-col items-center px-6 py-4 rounded-xl bg-white border-2 border-[#E5E7EB] border-dashed">
								<input
									id="imgFile"
									accept="image/*"
									className="hidden"
									type="file"
									name="imgFile"
									onChange={hanleImgFileUpload}
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
								className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-200 ease-in-out 
								peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6]
								peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]"
							>
								내용
							</label>
							<label
								htmlFor="content"
								className="absolute hidden right-4 top-99 text-sm text-red-500 peer-user-invalid:block"
							>
								내용을 입력하세요.
							</label>
						</div>

						<div className="flex flex-col">
							<div className="relative w-full px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500">
								<textarea
									id="hashTag"
									rows={1}
									className="peer w-full resize-none outline-none align-middle"
									required
									value={hashTag}
									onChange={(e) => setHashTag(e.target.value)}
								/>
								<label
									htmlFor="hashTag"
									className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-200 ease-in-out 
									peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6]
									peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]"
								>
									해시태그
								</label>
							</div>
							<p className="mt-2 text-xs text-[#C8C8C8]">
								예: 수학, AI, 공부법 (각각 태그 입력 후 Enter)
							</p>
						</div>
						<div className="flex justify-end mt-11.5 gap-2">
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
			</div>
		</>
	);
}
