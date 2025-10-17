import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { getAge } from "../../utils/getAge";
import { ageToBirthDate } from "../../utils/ageToBirthDate";
import EditProfileSkeleton from "../../components/loading/profile/EditProfileSkeleton";
import { ChevronDown, X } from "lucide-react";

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
	const {
		profile,
		updateProfile,
		fetchChildCodes,
		updateValidChildCodes,
		loading,
		error,
		userId,
	} = useProfileStore();

	const [formData, setFormData] = useState<Partial<UserProfile>>({});
	const [childCodes, setChildCodes] = useState<string[]>([]); // 자녀 코드 배열

	useEffect(() => {
		if (profile) {
			setFormData(profile);

			if (profile.role === "parent") {
				// fetch 후 state에 복사
				fetchChildCodes().then(() => {
					const codes = useProfileStore.getState().childCodes;
					setChildCodes(codes);
				});
			}
		}
	}, [profile]);

	if (loading) return <EditProfileSkeleton />;
	if (error) return <p>❌ 오류: {error}</p>;
	if (!profile || !userId) return <EditProfileSkeleton />;

	const handleChange =
		(key: keyof UserProfile) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>,
		) => {
			const value = e.target.value;
			setFormData((prev) => ({ ...prev, [key]: value }));
		};

	const age = formData.birth_date ? getAge(formData.birth_date) : "";

	// 프로필 DB에 나이를 0000.00.00 형태로 집어넣기
	const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputAge = Number(e.target.value);
		setFormData((prev) => ({
			...prev,
			birth_date: !isNaN(inputAge) ? ageToBirthDate(inputAge) : undefined,
		}));
	};

	// 취미
	const handleHabitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const habitsArray = value.split(/\s+/).filter(Boolean);
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

	// 새로운 input 추가
	const addChildCode = () => setChildCodes((prev) => [...prev, ""]);

	// 특정 인덱스의 코드 업데이트
	const updateChildCodeAt = (index: number, value: string) =>
		setChildCodes((prev) => prev.map((c, i) => (i === index ? value : c)));

	// 특정 인덱스 삭제
	const removeChildCodeAt = (index: number) =>
		setChildCodes((prev) => prev.filter((_, i) => i !== index));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// users 테이블 업데이트
		await updateProfile(formData);

		// 자녀코드 검증 + 상태 업데이트
		try {
			await updateValidChildCodes(childCodes);
		} catch (err: any) {
			alert(err.message);
			return;
		}

		// 프로필 페이지로 이동
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
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
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
						<div className="relative">
							<select
								id="gender"
								value={formData.gender || ""}
								onChange={handleChange("gender")}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none focus:outline-none focus:border-2 focus:border-violet-400"
							>
								<option value="" disabled>
									선택해주세요
								</option>
								<option value="남">남</option>
								<option value="여">여</option>
							</select>
							<ChevronDown
								size={18}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
							/>
						</div>
					</div>

					{profile.role === "student" && (
						<>
							{/* 나이 */}
							<div>
								<label className="block mb-1 text-gray-600 text-sm">
									나이
								</label>
								<input
									type="number"
									value={age}
									onChange={handleAgeChange}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
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
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
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
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
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
									onChange={handleChange(
										"representative_badge_id",
									)}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none focus:outline-none focus:border-2 focus:border-violet-400"
								>
									{/* 옵션 아직 더 추가해야함 */}
									<option value="" disabled>
										아직 획득한 뱃지가 없습니다.
									</option>
								</select>
							</div>
						</>
					)}

					{profile.role === "teacher" && (
						<>
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
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
								/>
							</div>

							{/* 전공 */}
							<div>
								<label
									htmlFor="major"
									className="block mb-1 text-gray-600 text-sm"
								>
									전공 과목
								</label>
								<input
									id="major"
									value={formData.major}
									onChange={handleChange("region")}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
								/>
							</div>

							{/* 경력 */}
							<div>
								<label
									htmlFor="experience"
									className="block mb-1 text-gray-600 text-sm"
								>
									경력
								</label>
								<input
									id="experience"
									value={formData.experience}
									onChange={handleChange("experience")}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
								/>
							</div>

							{/* 활동 뱃지 */}
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
									onChange={handleChange(
										"representative_badge_id",
									)}
									className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
								>
									{/* 옵션 아직 더 추가해야함 */}
									<option value="" disabled>
										아직 획득한 뱃지가 없습니다.
									</option>
								</select>
							</div>

							{/* 자녀 코드 입력 */}
							<div>
								<label className="block mb-1 text-gray-600 text-sm">
									자녀 코드
								</label>
								{childCodes.map((code, idx) => (
									<div
										key={idx}
										className="relative flex items-center gap-2 mb-1"
									>
										<input
											type="text"
											value={code}
											onChange={(e) =>
												updateChildCodeAt(
													idx,
													e.target.value,
												)
											}
											className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
										/>
										<X
											className="absolute right-2 cursor-pointer hover:text-gray-300"
											onClick={() =>
												removeChildCodeAt(idx)
											}
										/>
									</div>
								))}

								<div
									onClick={addChildCode}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 hover:bg-violet-100 cursor-pointer"
								>
									자녀 코드 추가
								</div>
							</div>
						</>
					)}

					{profile.role === "parent" && (
						<>
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
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
								/>
							</div>

							{/* 자녀 코드 입력 */}
							<div>
								<label className="block mb-1 text-gray-600 text-sm">
									자녀 코드
								</label>
								{childCodes.map((code, idx) => (
									<div
										key={idx}
										className="relative flex items-center gap-2 mb-1"
									>
										<input
											type="text"
											value={code}
											onChange={(e) =>
												updateChildCodeAt(
													idx,
													e.target.value,
												)
											}
											className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
										/>
										<X
											className="absolute right-2 cursor-pointer hover:text-gray-300"
											onClick={() =>
												removeChildCodeAt(idx)
											}
										/>
									</div>
								))}

								<div
									onClick={addChildCode}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 hover:bg-violet-100 cursor-pointer"
								>
									자녀 코드 추가
								</div>
							</div>
						</>
					)}
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
							className="w-full h-[264px] border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-2 focus:border-violet-400"
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
												? "bg-violet-500 text-white "
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
					className="px-4 py-2 rounded-lg border border-violet-300 text-violet-600 bg-white hover:bg-violet-50"
				>
					취소
				</Link>

				<button
					type="submit"
					className="px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600"
				>
					저장
				</button>
			</div>
		</form>
	);
}
