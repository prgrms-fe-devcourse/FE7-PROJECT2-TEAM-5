import { Link } from "react-router";

// 게시글 생성 페이지
export default function PostCreatePage() {
	return (
		<>
			<div className="min-w-250 px-10">
				<h2 className="mb-7 text-[32px] font-bold">글 작성하기</h2>
				<form method="post" className="flex flex-col gap-5">
					<select
						className="px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500"
						name="board"
						id="board"
						required
					>
						<option value="" disabled selected>
							게시판을 선택해주세요.
						</option>
						<option value="student">자유게시판</option>
						<option value="teacher">초등학생 게시판</option>
						<option value="parent">중학생 게시판</option>
						<option value="parent">고등학생 게시판</option>
						<option value="parent">자료 공유 게시판</option>
					</select>
					<input
						placeholder="글 제목을 입력하세요."
						className="px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500"
						required
						type="textarea"
					/>
					<div className="flex flex-col items-center px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] border-dashed">
						<input
							id="chooseImg"
							accept="image/*"
							className="hidden"
							type="file"
							name="chooseImg"
						/>
						<p className="text-[#6B7280]">Upload image</p>
						<label
							htmlFor="chooseImg"
							className="px-6 py-4 rounded-xl text-[#6B7280] bg-[#E5E7EB] cursor-pointer"
						>
							Choose File
						</label>
					</div>
					<textarea
						placeholder="내용을 작성하세요."
						rows={15}
						className="w-full h-full px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] resize-none outline-none user-invalid:border-red-500"
						required
						wrap="hard"
					></textarea>
					<div className="flex flex-col">
						<input
							placeholder="태그 입력 후 Enter"
							className="px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none"
							type="textatea"
						/>
						<p className="mt-2 text-xs text-[#C8C8C8]">
							예: 수학, AI, 공부법 (단어 각각 엔터로 추가)
						</p>
					</div>
					<div className="flex justify-end mt-11.5 gap-2">
						<Link
							to="/postList"
							className="px-4 py-2.5 text-sm rounded-xl bg-white text-[#8B5CF6]
						font-Regular hover:bg-[#B08DFF] hover:text-white cursor-pointer"
						>
							삭제
						</Link>
						<button
							type="submit"
							className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6] hover:bg-[#B08DFF] cursor-pointer"
						>
							등록
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
