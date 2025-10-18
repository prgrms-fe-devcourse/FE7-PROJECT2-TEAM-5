import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";

type role = "" | "student" | "teacher" | "parent";

export default function SocialSignupInfo() {
	const navigate = useNavigate();
	const { profile, fetchProfile } = useProfileStore();

	const [role, setRole] = useState<role>("");
	const [nickname, setNickname] = useState<string>("");
	const [year, setYear] = useState<string>("");
	const [month, setMonth] = useState<string>("");
	const [day, setDay] = useState<string>("");
	const [major, setMajor] = useState<string>("");
	const [childCode, setChildCode] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const studentsYears = Array.from({ length: 20 }, (_, i) =>
		String(new Date().getFullYear() - i),
	);
	const years = Array.from({ length: 65 }, (_, i) =>
		String(new Date().getFullYear() - i),
	);
	const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
	const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

	const yearsToUse = role === "student" ? studentsYears : years;

	useEffect(() => {
		if (role === "") {
			setYear("");
			setMonth("");
			setDay("");
			setMajor("");
			setChildCode("");
			return;
		}
		if (role !== "teacher") setMajor("");
		if (role !== "teacher" && role !== "parent") setChildCode("");
	}, [role]);

	// 프로필 완성 처리 함수
	const handleProfileComplete = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});

		try {
			// 입력값 검증
			if (!nickname.trim()) {
				setErrors({ nickname: "닉네임을 입력해주세요" });
				return;
			}
			if (!role) {
				setErrors({ role: "소속 구분을 선택해주세요" });
				return;
			}
			if (!year || !month || !day) {
				setErrors({ birthDate: "생년월일을 모두 선택해주세요" });
				return;
			}

			// 생년월일 형식 변환 (YYYY-MM-DD)
			const birthDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

			// 사용자 정보 업데이트
			const updateData: any = {
				nickname: nickname.trim(),
				role,
				birth_date: birthDate,
				is_profile_completed: true,
			};

			// 선생님인 경우 전공 과목 추가
			if (role === "teacher" && major.trim()) {
				updateData.major = major.trim();
			}

			// 현재 로그인한 사용자의 auth_id로 업데이트
			const { error } = await supabase
				.from("users")
				.update(updateData)
				.eq("auth_id", profile?.auth_id);

			if (error) {
				console.error("프로필 업데이트 오류:", error);
				setErrors({ general: "프로필 저장 중 오류가 발생했습니다." });
				return;
			}

			// 프로필 새로고침
			await fetchProfile();

			// 홈페이지로 이동
			navigate("/", { replace: true });
		} catch (error) {
			console.error("프로필 완성 처리 오류:", error);
			setErrors({ general: "예상치 못한 오류가 발생했습니다." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<h4 className="text-[28px] font-black mb-6 text-[#8b5cf6] text-center">
				회원 정보 입력
			</h4>

			<form
				className="w-full flex flex-col gap-4"
				onSubmit={handleProfileComplete}
			>
				<div>
					<input
						id="login-name"
						type="text"
						placeholder="닉네임"
						value={nickname}
						onChange={(e) => setNickname(e.target.value)}
						className={`w-full h-11 rounded-xl border px-4 outline-none ${
							errors.nickname
								? "border-[#EF4444]"
								: "border-[#D1D5DB]"
						}`}
					/>
					{errors.nickname && (
						<p className="text-xs text-[#EF4444] mt-1">
							{errors.nickname}
						</p>
					)}
				</div>

				<div className="relative">
					<select
						value={role}
						onChange={(e) => setRole(e.target.value as role)}
						className={`w-full h-11 rounded-xl border px-4 outline-none appearance-none ${
							!role ? "text-gray-400" : ""
						} ${errors.role ? "border-[#EF4444]" : "border-[#D1D5DB]"}`}
					>
						<option value="" disabled>
							소속 구분
						</option>
						<option value="student">학생</option>
						<option value="teacher">선생님</option>
						<option value="parent">학부모</option>
					</select>
					<ChevronDown
						size={18}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
					/>
					{errors.role && (
						<p className="text-xs text-[#EF4444] mt-1">
							{errors.role}
						</p>
					)}
				</div>

				{role !== "" && (
					<>
						<div className="grid grid-cols-[1.3fr_1fr_1fr] gap-3">
							{/* 연 */}
							<div className="relative">
								<select
									value={year}
									onChange={(e) => setYear(e.target.value)}
									className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 pr-10 outline-none appearance-none"
								>
									<option value="" disabled>
										출생연도
									</option>
									{yearsToUse.map((y) => (
										<option key={y} value={y}>
											{y}
										</option>
									))}
								</select>
								<ChevronDown
									size={18}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
								/>
							</div>

							{/* 월 */}
							<div className="relative">
								<select
									value={month}
									onChange={(e) => setMonth(e.target.value)}
									className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 pr-10 outline-none appearance-none"
								>
									<option value="" disabled>
										월
									</option>
									{months.map((m) => (
										<option key={m} value={m}>
											{m}
										</option>
									))}
								</select>
								<ChevronDown
									size={18}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
								/>
							</div>

							{/* 일 */}
							<div className="relative">
								<select
									value={day}
									onChange={(e) => setDay(e.target.value)}
									className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 pr-10 outline-none appearance-none"
								>
									<option value="" disabled>
										일
									</option>
									{days.map((d) => (
										<option key={d} value={d}>
											{d}
										</option>
									))}
								</select>
								<ChevronDown
									size={18}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
								/>
							</div>
						</div>
						{errors.birthDate && (
							<p className="text-xs text-[#EF4444] mt-1">
								{errors.birthDate}
							</p>
						)}
					</>
				)}

				{/* 선생님 */}
				{role === "teacher" && (
					<>
						<input
							type="text"
							placeholder="전공 과목"
							value={major}
							onChange={(e) => setMajor(e.target.value)}
							className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
						/>
						<input
							type="text"
							placeholder="자녀코드"
							value={childCode}
							onChange={(e) => setChildCode(e.target.value)}
							className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
						/>
					</>
				)}

				{/* 학부모 */}
				{role === "parent" && (
					<input
						type="text"
						placeholder="자녀코드"
						value={childCode}
						onChange={(e) => setChildCode(e.target.value)}
						className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
					/>
				)}
				{/* 일반 에러 메시지 */}
				{errors.general && (
					<p className="text-xs text-[#EF4444] mt-1">
						{errors.general}
					</p>
				)}

				<button
					type="submit"
					disabled={loading}
					className="cursor-pointer w-full h-11 text-white font-semibold rounded-xl bg-[#8B5CF6] disabled:opacity-60"
				>
					{loading ? "저장 중..." : "회원가입 완료"}
				</button>
			</form>
		</>
	);
}
