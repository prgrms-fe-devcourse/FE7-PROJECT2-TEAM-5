import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { getAge } from "../../utils/getAge";
import { ageToBirthDate } from "../../utils/ageToBirthDate";

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

export default function EditProfile() {
	const navigate = useNavigate();
	const { profile, fetchProfile, updateProfile, loading, error, userId } =
		useProfileStore();

	const [formData, setFormData] = useState<Partial<UserProfile>>({});

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	useEffect(() => {
		if (profile) {
			setFormData(profile);
		}
	}, [profile]);

	if (loading) return <p>불러오는 중...</p>;
	if (error) return <p>❌ 오류: {error}</p>;
	if (!profile || !userId) return <p>로그인이 필요합니다.</p>;

	const handleChange =
		(key: keyof UserProfile) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>,
		) => {
			const value = e.target.value;
			setFormData((prev) => ({
				...prev,
				[key]: value,
			}));
		};

	// formData.birth_date 기반으로 나이 계산
	const age = formData.birth_date ? getAge(formData.birth_date) : "";

	// input 숫자 변경 처리
	const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputAge = Number(e.target.value);
		if (!isNaN(inputAge)) {
			setFormData((prev) => ({
				...prev,
				birth_date: ageToBirthDate(inputAge),
			}));
		} else {
			// 비어있을 때 birth_date를 undefined로 처리 가능
			setFormData((prev) => ({
				...prev,
				birth_date: undefined,
			}));
		}
	};

	// 취미
	const handleHabitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const habitsArray = value.split(/\s+/).filter(Boolean); // 공백 기준으로 배열화
		setFormData((prev) => ({ ...prev, habits: habitsArray }));
	};

	// 관심 목록
	const toggleInterest = (interest: string) => {
		setFormData((prev) => {
			const prevInterests = prev.interests ?? [];
			return {
				...prev,
				interests: prevInterests.includes(interest)
					? prevInterests.filter((i) => i !== interest)
					: [...prevInterests, interest],
			};
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateProfile(formData);
		navigate(`/profile/${userId}`);
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
							value={formData.nickname ?? ""}
							onChange={handleChange("nickname")}
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
							value={formData.gender}
							onChange={handleChange("gender")}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-purple-400"
						>
							<option value="남">남</option>
							<option value="여">여</option>
						</select>
					</div>

					{/* 나이 */}
					<div>
						<label className="block mb-1 text-gray-600 text-sm">
							나이
						</label>
						<input
							type="number"
							value={age}
							onChange={handleAgeChange}
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
							value={formData.region}
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
							value={(formData.habits ?? []).join(" ")}
							onChange={handleHabitsChange}
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
							value={formData.representative_badge_id}
							onChange={handleChange("representative_badge_id")}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-purple-400"
						>
							{/* 옵션 아직 더 추가해야함 */}
							<option>아직 획득한 뱃지가 없습니다.</option>
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
							value={formData.bio}
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
								const active = (
									formData.interests ?? []
								).includes(tag);
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
