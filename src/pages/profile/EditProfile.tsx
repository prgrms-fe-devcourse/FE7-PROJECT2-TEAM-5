import { useState } from "react";
import { Link, useNavigate } from "react-router";

const ALL_INTERESTS: string[] = [
	"국어",
	"수학",
	"영어",
	"경제",
	"정치",
	"법학",
	"통계학",
	"역사",
	"한국사",
	"물리",
	"화학",
	"생명과학",
	"지구과학",
	"코딩",
	"AI",
	"웹개발",
	"앱개발",
	"미술",
	"음악",
	"사진",
	"글쓰기",
	"진로탐색",
	"봉사활동",
	"동아리활동",
];

type Profile = {
	name: string;
	gender: string;
	age: string;
	region: string;
	hobby: string;
	badge: string;
	bio: string;
	interests: string[];
};

export default function ModifyProfile() {
	const navigate = useNavigate();

	const [profile, setProfile] = useState<Profile>({
		name: "이름",
		gender: "남",
		age: "12",
		region: "지역",
		hobby: "취미",
		badge: "",
		bio: "안녕하세요",
		interests: ["국어", "생명과학", "코딩", "글쓰기", "동아리활동"],
	});

	const toggleInterest = (k: string) =>
		setProfile((prev) =>
			prev.interests.includes(k)
				? { ...prev, interests: prev.interests.filter((i) => i !== k) }
				: { ...prev, interests: [...prev.interests, k] },
		);

	const handleChange =
		(key: keyof Profile) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>,
		) => {
			setProfile((prev) => ({ ...prev, [key]: e.target.value }));
		};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		console.log("✅ 저장된 프로필:", profile);

		// ✅ 저장 후 프로필 페이지로 이동
		navigate("/profile/1");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
		>
			<h1 className="text-2xl font-bold text-[#8b5cf6] mb-4">
				프로필 수정
			</h1>

			<div className="grid grid-cols-[334px_468px] gap-8">
				{/* 좌측 폼 */}
				<div className="space-y-3">
					{/* 이름 */}
					<div>
						<label
							htmlFor="name"
							className="block mb-1 text-gray-600 text-sm"
						>
							이름
						</label>
						<input
							id="name"
							value={profile.name}
							onChange={handleChange("name")}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-purple-400"
						/>
					</div>

					{/* 성별 */}
					<div>
						<label
							htmlFor="gender"
							className="block mb-1 text-gray-600 text-sm"
						>
							성별
						</label>
						<select
							id="gender"
							value={profile.gender}
							onChange={handleChange("gender")}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-purple-400"
						>
							<option value="남">남</option>
							<option value="여">여</option>
						</select>
					</div>

					{/* 나이 */}
					<div>
						<label
							htmlFor="age"
							className="block mb-1 text-gray-600 text-sm"
						>
							나이
						</label>
						<input
							id="age"
							type="number"
							value={profile.age}
							onChange={handleChange("age")}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-purple-400"
						/>
					</div>

					{/* 지역 */}
					<div>
						<label
							htmlFor="region"
							className="block mb-1 text-gray-600 text-sm"
						>
							지역
						</label>
						<input
							id="region"
							value={profile.region}
							onChange={handleChange("region")}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-purple-400"
						/>
					</div>

					{/* 취미 */}
					<div>
						<label
							htmlFor="hobby"
							className="block mb-1 text-gray-600 text-sm"
						>
							취미
						</label>
						<input
							id="hobby"
							value={profile.hobby}
							onChange={handleChange("hobby")}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-purple-400"
						/>
					</div>

					{/* 뱃지 */}
					<div>
						<label
							htmlFor="badge"
							className="block mb-1 text-gray-600 text-sm"
						>
							활동 배지
						</label>
						<select
							id="badge"
							value={profile.badge}
							onChange={handleChange("badge")}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-purple-400"
						>
							{/* 옵션 아직 더 추가해야함 */}
							<option>🏆 초보 수학 마스터</option>
						</select>
					</div>
				</div>

				{/* 우측 */}
				<div className="space-y-3">
					{/* 자기소개 */}
					<div>
						<label
							htmlFor="bio"
							className="block mb-1 text-gray-600 text-sm"
						>
							자기소개
						</label>
						<textarea
							id="bio"
							value={profile.bio}
							onChange={handleChange("bio")}
							className="w-full h-[264px] border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-2 focus:border-purple-400"
						/>
					</div>

					<div>
						<span className="block mb-1 text-gray-600 text-sm">
							관심 분야
						</span>
						<div className="flex flex-wrap gap-2">
							{ALL_INTERESTS.map((tag) => {
								const active = profile.interests.includes(tag);
								return (
									<button
										key={tag}
										type="button"
										onClick={() => toggleInterest(tag)}
										className={[
											"px-2 py-1 rounded-lg text-sm",
											active
												? "bg-purple-500 text-white "
												: "bg-gray-100 text-gray-700 hover:bg-gray-200",
										].join(" ")}
									>
										{tag}
									</button>
								);
							})}
						</div>
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
	);
}
