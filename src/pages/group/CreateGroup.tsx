// pages/group/CreateGroup.tsx
export default function CreateGroup() {
  const preventSubmit = (e: React.FormEvent) => e.preventDefault();

  return (
    
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
     
      <main className="mx-auto w-full max-w-[880px] px-8 py-10">
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight">
          그룹 생성하기
        </h1>

        <form onSubmit={preventSubmit} className="mt-8 space-y-6">
          {/* 카테고리 */}
          <div>
           
            
          </div>

          {/* 그룹 이름 */}
          <div>
            <label htmlFor="name" className="sr-only">그룹 이름</label>
            <input
              id="name"
              placeholder="그룹 이름을 작성하세요"
              className="block w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          {/* 커버 업로드 */}
          <section aria-label="커버 이미지 업로드">
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white/70">
              <div className="flex flex-col items-center justify-center gap-3 py-10">
                <p className="text-sm text-gray-500">Upload image</p>
                <label
                  htmlFor="cover"
                  className="inline-flex h-10 items-center rounded-xl bg-gray-100 px-4 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                >
                  Choose File
                </label>
                <input id="cover" type="file" accept="image/*" hidden />
              </div>
            </div>
          </section>

          {/* 소개 */}
          <div>
            <label htmlFor="desc" className="sr-only">그룹 소개</label>
            <textarea
              id="desc"
              placeholder="그룹을 소개하세요"
              rows={12}
              className="block w-full rounded-xl border border-gray-200 bg-white p-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          {/* 태그 입력 + 작은 문구 미리보기 */}
          <div>
            <label htmlFor="tag" className="sr-only">태그 입력</label>
            <input
              id="tag"
              placeholder="태그 입력 후 Enter"
              className="block w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <p className="mt-1 text-xs text-gray-400">
              예: 수학, AI, 공부법 (단어별로 엔터로 추가)
            </p>

            {/* ✅ 버튼/칩 아님: 작은 문구로만 표시 */}
            <p className="mt-2 text-xs text-gray-500">
              수학 · 스터디 · 학습분석
            </p>
          </div>

          {/* 액션 */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              className="h-9 rounded-xl border border-gray-200 bg-white px-4 text-sm hover:bg-gray-50"
            >
              삭제
            </button>
            <button
              type="submit"
              className="h-9 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white hover:bg-violet-700"
            >
              등록
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
