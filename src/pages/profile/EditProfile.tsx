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
		updateValidChildCodes,
		loading,
		error,
		userId,
		childInfos: storeChildInfos,
	} = useProfileStore();

	const [formData, setFormData] = useState<Partial<UserProfile>>({});
	const [childInfos, setChildInfos] = useState<ChildInfo[]>([]); // 자녀 정보

	// 페이지 로드 시 프로필 세팅 및 부모 자녀 코드 fetch
	useEffect(() => {
		if (!profile) return;
		setFormData(profile);
		setChildInfos(storeChildInfos); // Zustand childInfos 바로 반영
	}, [profile, storeChildInfos]);

	if (loading || !profile) return <EditProfileSkeleton />;
	if (error) return <p>❌ 오류: {error}</p>;

	const handleChange =
		(key: keyof UserProfile) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>,
		) =>
			setFormData((prev) => ({ ...prev, [key]: e.target.value }));

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
		const habitsArray = e.target.value.split(/\s+/).filter(Boolean);
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

	// 추가
	const addChildInfo = () =>
		setChildInfos((prev) => [
			...prev,
			{ auth_id: "", nickname: "", child_link_code: "" },
		]);

	// input 값 변경
	const updateChildInfoAt = (index: number, value: string) =>
		setChildInfos((prev) =>
			prev.map((c, i) =>
				i === index ? { ...c, child_link_code: value } : c,
			),
		);

	// 삭제
	const removeChildInfoAt = (index: number) =>
		setChildInfos((prev) => prev.filter((_, i) => i !== index));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateProfile(formData);

		if (profile.role === "teacher" || profile.role === "parent") {
			try {
				await updateValidChildCodes(
					childInfos.map((c) => c.child_link_code),
				);
			} catch (err: any) {
				alert(err.message);
				return;
			}
		}

		alert("수정이 완료되었습니다!");
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
						<label className="block mb-1 text-gray-600 text-sm">
							이름
						</label>
						<input
							value={formData.nickname ?? ""}
							onChange={handleChange("nickname")}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
						/>
					</div>

					{/* 성별 */}
					<div>
						<label className="block mb-1 text-gray-600 text-sm">
							성별
						</label>
						<div className="relative">
							<select
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

					{/* 학생 전용 */}
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
						</>
					)}

					{/* 지역 */}
					{(profile.role === "student" ||
						profile.role === "teacher" ||
						profile.role === "parent") && (
						<div>
							<label className="block mb-1 text-gray-600 text-sm">
								지역
							</label>
							<input
								value={formData.region ?? ""}
								onChange={handleChange("region")}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
							/>
						</div>
					)}

					{/* 학생 전용 취미 */}
					{profile.role === "student" && (
						<div>
							<label className="block mb-1 text-gray-600 text-sm">
								취미
							</label>
							<input
								value={(formData.habits ?? []).join(" ")}
								onChange={handleHabitsChange}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
							/>
						</div>
					)}

					{/* 교사 전용 전공/경력 */}
					{profile.role === "teacher" && (
						<>
							<div>
								<label className="block mb-1 text-gray-600 text-sm">
									전공
								</label>
								<input
									value={formData.major ?? ""}
									onChange={handleChange("major")}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
								/>
							</div>
							<div>
								<label className="block mb-1 text-gray-600 text-sm">
									경력
								</label>
								<input
									value={formData.experience ?? ""}
									onChange={handleChange("experience")}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
								/>
							</div>
						</>
					)}

					{/* 부모 전용 자녀 코드 */}
					{childInfos.length > 0 ||
					profile.role === "parent" ||
					profile.role === "teacher" ? (
						<div>
							<label className="block mb-1 text-gray-600 text-sm">
								자녀 코드
							</label>
							{childInfos.map((child, idx) => (
								<div
									key={idx}
									className="relative flex items-center gap-2 mb-1"
								>
									<input
										type="text"
										value={child.child_link_code}
										onChange={(e) =>
											updateChildInfoAt(
												idx,
												e.target.value,
											)
										}
										className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-2 focus:border-violet-400"
									/>
									<X
										className="absolute right-2 cursor-pointer hover:text-gray-300"
										onClick={() => removeChildInfoAt(idx)}
									/>
								</div>
							))}
							<div
								onClick={addChildInfo}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 hover:bg-violet-100 cursor-pointer"
							>
								자녀 코드 추가
							</div>
						</div>
					) : null}
				</div>

				{/* 우측 폼: 자기소개 + 관심 분야 */}
				<div className="space-y-3">
					<div>
						<label className="block mb-1 text-gray-600 text-sm">
							자기소개
						</label>
						<textarea
							value={formData.bio ?? ""}
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
										className={`px-2 py-1 rounded-lg text-sm ${active ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
