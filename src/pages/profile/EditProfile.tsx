// src/pages/profile/ModifyProfile.tsx
import { useState } from "react";
import { Link } from "react-router"; // ✅ 최신 react-router

type Interest =
  | "국어" | "수학" | "영어" | "경제" | "정치" | "법학" | "통계학" | "역사" | "한국사"
  | "물리" | "화학" | "생명과학" | "지구과학" | "코딩" | "AI" | "웹개발" | "앱개발"
  | "미술" | "음악" | "사진" | "글쓰기" | "진로탐색" | "봉사활동" | "동아리활동";

const ALL_INTERESTS: Interest[] = [
  "국어","수학","영어","경제","정치","법학","통계학","역사","한국사",
  "물리","화학","생명과학","지구과학","코딩","AI","웹개발","앱개발",
  "미술","음악","사진","글쓰기","진로탐색","봉사활동","동아리활동",
];

export default function ModifyProfile() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"남" | "여">("남");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [hobby, setHobby] = useState("");
  const [badge, setBadge] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<Interest[]>(["국어","생명과학","코딩","글쓰기","동아리활동"]);

  const toggleInterest = (k: Interest) =>
    setInterests(prev => prev.includes(k) ? prev.filter(i => i !== k) : [...prev, k]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    console.log({ name, gender, age, region, hobby, badge, bio, interests });
   
  };

  return (
    <section className="w-full flex justify-center px-4 py-8 bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-2xl shadow p-6 md:p-8">
        <h1 className="text-2xl font-bold text-[#8b5cf6] mb-4">프로필 수정</h1>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 좌측 폼 */}
          <div className="space-y-3">
            <label 
              htmlFor="name" 
              className="block text-gray-600 text-[12pt] font-medium">
              이름
            </label>
            <input
              id="name" value={name} onChange={(e)=>setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <label htmlFor="gender" 
              className="block text-gray-600 text-[12pt] font-medium">성별</label>
            <select
              id="gender"
              value={gender} 
              onChange={(e)=>setGender(e.target.value as "남"|"여")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="남">남</option><option value="여">여</option>
            </select>

            <label htmlFor="age" 
              className="block text-gray-600 text-[12pt] font-medium">
            나이
            </label>
            <input
              id="age" value={age} onChange={(e)=>setAge(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <label htmlFor="region" 
              className="block text-gray-600 text-[12pt] font-medium">지역</label>
            <input
              id="region" 
              value={region} 
              onChange={(e)=>setRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <label htmlFor="hobby" 
              className="block text-gray-600 text-[12pt] font-medium">취미</label>
            <input
              id="hobby" 
              value={hobby} 
              onChange={(e)=>setHobby(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <label htmlFor="badge" 
            className="block text-gray-600 text-[12pt] font-medium">
              활동 배지</label>
            <select
              id="badge" value={badge} onChange={(e)=>setBadge(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            > 
             {/* 옵션 아직 더 추가해야함 */}
              <option>🏆 초보 수학 마스터</option>
              
            </select>
          </div>

          {/* 우측 */}
          <div className="space-y-3">
            <label htmlFor="bio" className="block text-gray-600 text-[12pt] font-medium">자기소개</label>
            <textarea
              id="bio" rows={7} value={bio} onChange={(e)=>setBio(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <span className="block text-gray-600 text-[12pt] font-medium">관심 분야</span>
            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map(tag => {
                const active = interests.includes(tag);
                return (
                  <button
                    key={tag} type="button" onClick={() => toggleInterest(tag)}
                    className={[
                      "px-3 py-1 rounded-full text-sm border",
                      active
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    ].join(" ")}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      
        <div className="mt-6 flex justify-end gap-3">
         
          <Link
            to=".."           
            relative="path"   
            className="px-4 py-2 rounded-lg border border-purple-300 text-purple-600 bg-white hover:bg-purple-50"
          >
            취소
          </Link>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
          >
            저장
          </button>
        </div>
      </form>
    </section>
  );
}
