import { useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";
import {
	checkAuthNicknameDuplicate,
	checkAuthChildCodeExists,
	validateAuthForm,
} from "../../utils/authValidation";
import { FormErrorMessage } from "../../components/FormErrorMessage";
import type { UserRole } from "../../types/auth";

type role = UserRole;

export default function SocialSignupInfo() {
	const navigate = useNavigate();
	const { profile, fetchProfile } = useProfileStore();

	const [role, setRole] = useState<role>("");
	const [nickname, setNickname] = useState<string>("");
	const [year, setYear] = useState<string>("");
	const [month, setMonth] = useState<string>("");
	const [day, setDay] = useState<string>("");
	const [major, setMajor] = useState<string>("");
	const [childLinkCode, setChildLinkCode] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	// 닉네임 중복 검사
	const checkNicknameExists = async (): Promise<boolean> => {
		if (!nickname.trim()) return false;

		const result = await checkAuthNicknameDuplicate(nickname);

		if (result.error) {
			setErrors((prev) => ({
				...prev,
				nickname: result.error!,
			}));
			return true;
		}

		if (result.exists) {
			setErrors((prev) => ({
				...prev,
				nickname: "이미 사용 중인 닉네임입니다.",
			}));
			return true;
		}

		setErrors((prev) => ({ ...prev, nickname: "" }));
		return false;
	};

	// 학부모일 경우, 자녀코드 존재 여부 체크
	const validateChildCode = async (): Promise<{
		exists: boolean;
		childId?: string;
	}> => {
		if (!childLinkCode.trim()) return { exists: false };

		const result = await checkAuthChildCodeExists(childLinkCode);

		if (result.error) {
			setErrors((prev) => ({
				...prev,
				childLinkCode: result.error!,
			}));
			return { exists: false };
		}

		if (!result.exists) {
			setErrors((prev) => ({
				...prev,
				childLinkCode: "존재하지 않는 자녀 코드입니다.",
			}));
			return { exists: false };
		}

		// 유효하면 에러 제거 + childId 반환
		setErrors((prev) => ({ ...prev, childLinkCode: "" }));
		return { exists: true, childId: result.childId };
	};

	// 필드별 유효성 검사 및 에러 상태 업데이트
	const validateAndSetErrors = useCallback((): boolean => {
		const validation = validateAuthForm({
			nickname,
			role,
			year,
			month,
			day,
			major,
			childLinkCode,
		});

		if (!validation.isValid) {
			setErrors(validation.errors);
			return false;
		}
		return true;
	}, [nickname, role, year, month, day, major, childLinkCode]);

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
			setChildLinkCode("");
			return;
		}
		if (role !== "teacher") setMajor("");
		if (role !== "teacher" && role !== "parent") setChildLinkCode("");
	}, [role]);

	// 프로필 완성 처리 함수
	const handleProfileComplete = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});

		try {
			// 기본 폼 유효성 검사
			const validation = validateAuthForm({
				nickname,
				role,
				year,
				month,
				day,
				major,
				childLinkCode,
			});

			if (!validation.isValid) {
				setErrors(validation.errors);
				return;
			}

			// 닉네임 중복 체크 (실시간으로 이미 체크했지만 한 번 더 확인)
			const nicknameExists = await checkNicknameExists();
			if (nicknameExists) {
				return;
			}

			// 학부모인 경우 자녀코드 존재 여부 체크 (실시간으로 이미 체크했지만 한 번 더 확인)
			if (role === "parent") {
				const childCodeResult = await validateChildCode();
				if (!childCodeResult.exists) {
					return;
				}
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

			// 부모-자녀 연결
			if (role === "parent" && childLinkCode.trim()) {
				const { data: childUser, error: searchError } = await supabase
					.from("users")
					.select("auth_id")
					.eq("child_link_code", childLinkCode.trim())
					.single();

				if (!childUser || searchError) {
					console.warn("자녀 코드 검색 실패", searchError);
				} else {
					await supabase.from("child_parent_links").insert([
						{
							parent_id: profile?.auth_id,
							child_id: childUser.auth_id,
						},
					]);
				}
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
						onChange={(e) => {
							setNickname(e.target.value);
							setErrors((prev) => ({ ...prev, nickname: "" }));
						}}
						onBlur={() => {
							checkNicknameExists();
							validateAndSetErrors();
						}}
						className={`w-full h-11 rounded-xl border px-4 outline-none transition-all ${
							errors.nickname
								? "border-[#EF4444] focus:border-[#EF4444]"
								: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
						}`}
					/>
					{errors.nickname && (
						<FormErrorMessage message={errors.nickname} />
					)}
				</div>

				{/* 소속 구분 */}
				<div>
					<div className="relative">
						<select
							value={role}
							onChange={(e) => {
								setRole(e.target.value as UserRole);
								setErrors((prev) => ({ ...prev, role: "" }));
							}}
							onBlur={() => validateAndSetErrors()}
							className={`w-full h-11 rounded-xl border px-4 pr-10 outline-none bg-white ${
								errors.role
									? "border-[#EF4444] focus:border-[#EF4444]"
									: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
							} appearance-none`}
						>
							<option value="" disabled>
								소속 구분
							</option>
							<option value="student">학생</option>
							<option value="teacher">선생님</option>
							<option value="parent">학부모</option>
						</select>

						{/* 오른쪽 화살표 아이콘 */}
						<ChevronDown
							size={18}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
						/>
					</div>
					<FormErrorMessage message={errors.role || ""} />
				</div>

				{/* 출생연월일 (Birth Date Selects) */}
				{role !== "" && (
					<div>
						<div
							className="grid grid-cols-[1.3fr_1fr_1fr] gap-3"
							onBlur={() => validateAndSetErrors()}
						>
							{/* 년 */}
							<div className="relative">
								<select
									value={year}
									onChange={(e) => {
										setYear(e.target.value);
										setErrors((prev) => ({
											...prev,
											birthDate: "",
										}));
									}}
									className={`w-full h-11 rounded-xl border border-[#D1D5DB] px-4 pr-10 outline-none appearance-none transition-all ${
										errors.birthDate
											? "border-[#EF4444] focus:border-[#EF4444]"
											: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
									}`}
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
									onChange={(e) => {
										setMonth(e.target.value);
										setErrors((prev) => ({
											...prev,
											birthDate: "",
										}));
									}}
									className={`w-full h-11 rounded-xl border border-[#D1D5DB] px-4 pr-10 outline-none appearance-none transition-all ${
										errors.birthDate
											? "border-[#EF4444] focus:border-[#EF4444]"
											: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
									}`}
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
									onChange={(e) => {
										setDay(e.target.value);
										setErrors((prev) => ({
											...prev,
											birthDate: "",
										}));
									}}
									className={`w-full h-11 rounded-xl border border-[#D1D5DB] px-4 pr-10 outline-none appearance-none transition-all ${
										errors.birthDate
											? "border-[#EF4444] focus:border-[#EF4444]"
											: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
									}`}
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
						<FormErrorMessage message={errors.birthDate || ""} />
					</div>
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
					</>
				)}

				{/* 학부모 */}
				{role === "parent" && (
					<div>
						<input
							type="text"
							placeholder="자녀코드"
							value={childLinkCode}
							onChange={(e) => {
								setChildLinkCode(e.target.value);
								setErrors((prev) => ({
									...prev,
									childLinkCode: "",
								}));
							}}
							onBlur={() => {
								validateChildCode();
								validateAndSetErrors();
							}}
							className={`w-full h-11 rounded-xl border px-4 outline-none transition-all ${
								errors.childLinkCode
									? "border-[#EF4444] focus:border-[#EF4444]"
									: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
							}`}
						/>
						{errors.childLinkCode && (
							<FormErrorMessage message={errors.childLinkCode} />
						)}
					</div>
				)}
				{/* 일반 에러 메시지 */}
				{errors.general && (
					<FormErrorMessage message={errors.general} />
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
