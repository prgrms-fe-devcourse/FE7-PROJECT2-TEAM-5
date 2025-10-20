import supabase from "../../utils/supabase";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import type { UserRole, AuthFormFields } from "../../types/auth";
import { ChevronDown } from "lucide-react";
import {
	checkAuthNicknameDuplicate,
	checkAuthChildCodeExists,
	validateAuthForm,
} from "../../utils/authValidation";
import { FormErrorMessage } from "../../components/FormErrorMessage";

const initialErrors: AuthFormFields = {
	email: "",
	password: "",
	confirmPassword: "",
	nickname: "",
	role: "",
	birthDate: "",
	major: "",
	childLinkCode: "",
};

export default function RegisterEmailPage() {
	const navigate = useNavigate();

	const [role, setRole] = useState<UserRole>("");

	// 이메일&비밀번호
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	// 공통 요소
	const [nickname, setNickname] = useState<string>("");
	const [year, setYear] = useState<string>("");
	const [month, setMonth] = useState<string>("");
	const [day, setDay] = useState<string>("");

	// 선생님 요소
	const [major, setMajor] = useState<string>("");

	// 학부모 요소
	const [childLinkCode, setChildLinkCode] = useState<string>("");
	const [childExists, setChildExists] = useState<boolean | null>(null);

	// UI state
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>(""); // 성공 또는 실패 메시지
	const [errors, setErrors] = useState<AuthFormFields>(initialErrors); // 필드별 오류 메시지 State 추가

	// 생년월일 범위
	const studentsYears = Array.from({ length: 20 }, (_, i) =>
		String(new Date().getFullYear() - i),
	);
	const years = Array.from({ length: 65 }, (_, i) =>
		String(new Date().getFullYear() - i),
	);
	const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
	const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

	const yearsToUse = role === "student" ? studentsYears : years;

	// 역할 변경 시 특정 폼 초기화
	useEffect(() => {
		if (role === "") {
			setYear("");
			setMonth("");
			setDay("");
			setMajor("");
			return;
		}
		if (role !== "teacher") setMajor("");
	}, [role]);

	/* 정합성 체크 요소들 */
	// 필드별 유효성 검사 및 에러 상태 업데이트
	const validateAndSetErrors = useCallback((): boolean => {
		const validation = validateAuthForm({
			email,
			password,
			confirmPassword,
			nickname,
			role,
			year,
			month,
			day,
			major,
			childLinkCode,
		});

		// AuthFormFields 타입에 맞게 변환, 폼 관련 에러메시지만 저장
		const authFormErrors: AuthFormFields = {
			email: validation.errors.email,
			password: validation.errors.password,
			confirmPassword: validation.errors.confirmPassword,
			nickname: validation.errors.nickname,
			role: validation.errors.role,
			birthDate: validation.errors.birthDate,
			major: validation.errors.major,
			childLinkCode: validation.errors.childLinkCode,
		};

		setErrors(authFormErrors);
		return validation.isValid;
	}, [
		email,
		password,
		confirmPassword,
		nickname,
		role,
		year,
		month,
		day,
		major,
		childLinkCode,
	]);

	// 닉네임 중복 검사
	const checkNicknameExists = useCallback(async (): Promise<boolean> => {
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
	}, [nickname]);

	// 학부모일 경우, 자녀코드 존재 여부 체크
	const validateChildCode = useCallback(async (): Promise<{
		exists: boolean;
		childId?: string;
	}> => {
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
	}, [childLinkCode]);

	// auth 테이블에 회원가입 시도하는 함수
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");
		setLoading(true);

		//  닉네임 중복 체크
		const nicknameExists = await checkNicknameExists();
		if (nicknameExists) {
			setLoading(false);
			return;
		}

		// 자녀코드 체크
		if (role === "parent") {
			const { exists, childId } = await validateChildCode();
			if (!exists || !childId) {
				setLoading(false);
				return;
			}
		}

		//  필드 유효성 체크
		const isValidFields = validateAndSetErrors();
		if (!isValidFields) {
			setLoading(false);
			return;
		}

		try {
			// 회원가입 시도
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});
			if (error) {
				// 이메일 중복 에러 처리
				if (error.message === "User already registered") {
					setErrors((prev) => ({
						...prev,
						email: "이미 사용 중인 이메일입니다.",
					}));
				} else {
					setMessage(`회원가입 실패: ${error.message}`);
				}
				setLoading(false);
				return;
			}
			const user = data && "user" in data ? data.user : (data as any);

			// 실패) auth.users에는 들어갔으나, public.users에는 안 들어감
			if (!user || !user.id) {
				setMessage(
					"회원가입은 성공했으나 사용자 정보를 가져올 수 없습니다.",
				);
				setLoading(false);

				return;
			}

			// 아래부터는 입력된 폼이 모든 정합성 검사를 통과한 상태
			// 임시 프로필을 폼에 입력된 프로필로 업데이트
			const userId = user.id;
			const birthDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

			// 공통 업데이트 프로필 요소
			const profilePayload: any = {
				auth_id: userId,
				nickname: nickname.trim(),
				role,
				birth_date: birthDate,
				is_profile_completed: true,
				// 성공적으로 프로필 설정 되었으면 true
			};

			// 선생님일 때 payload 추가 프로필
			if (role === "teacher") {
				profilePayload.major = major.trim();
			}

			// profilePayload 내용으로 public.users 프로필 업데이트
			const { error: profileError } = await supabase
				.from("users")
				.update(profilePayload)
				.eq("auth_id", userId)
				.select();

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
					await supabase
						.from("child_parent_links")
						.insert([
							{ parent_id: userId, child_id: childUser.auth_id },
						]);
				}
			}

			// (실패) 프로필 업데이트가 실패
			if (profileError) {
				setMessage(
					`회원가입 성공, 하지만 프로필 업데이트 실패: ${profileError.message}`,
				);

				console.error("Profile update error:", profileError);
			} else {
				// 성공했다면 메인페이지로
				navigate("/");
			}
		} catch (err) {
			console.error("Registration Error:", err);
			setMessage("예상치 못한 오류가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<h4 className="text-[28px] font-black mb-6 text-[#8b5cf6] text-center">
				회원가입
			</h4>

			{/* 이메일 입력 */}
			<form
				className="w-full flex flex-col gap-4 mb-4"
				onSubmit={handleSubmit}
			>
				<div>
					<input
						id="login-email"
						type="email"
						placeholder="이메일"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							// 입력 시 에러 메시지 초기화
							setErrors((prev) => ({ ...prev, email: "" }));
						}}
						onBlur={() => validateAndSetErrors()} // 포커스 잃을 때 유효성 검사
						className={`w-full h-11 rounded-xl border px-4 outline-none transition-all ${
							errors.email
								? "border-[#EF4444] focus:border-[#EF4444]"
								: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
						}`}
					/>
					<FormErrorMessage message={errors.email || ""} />
				</div>

				{/* 비밀번호 입력 */}
				<div>
					<input
						id="login-password"
						type="password"
						placeholder="비밀번호 (최소 8자, 영문/숫자 필수)"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setErrors((prev) => ({ ...prev, password: "" }));
						}}
						onBlur={() => validateAndSetErrors()}
						className={`w-full h-11 rounded-xl border px-4 outline-none transition-all ${
							errors.password
								? "border-[#EF4444] focus:border-[#EF4444]"
								: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
						}`}
					/>
					<FormErrorMessage message={errors.password || ""} />
				</div>

				{/* 비밀번호 확인 입력 */}
				<div>
					<input
						id="confirm-password"
						type="password"
						placeholder="비밀번호 확인"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
							setErrors((prev) => ({
								...prev,
								confirmPassword: "",
							}));
						}}
						onBlur={() => validateAndSetErrors()}
						className={`w-full h-11 rounded-xl border px-4 outline-none transition-all ${
							errors.confirmPassword
								? "border-[#EF4444] focus:border-[#EF4444]"
								: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
						}`}
					/>
					<FormErrorMessage message={errors.confirmPassword || ""} />
				</div>

				{/* 닉네임 입력 */}
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
					<FormErrorMessage message={errors.nickname || ""} />
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
									onChange={(e) => setYear(e.target.value)}
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
									onChange={(e) => setMonth(e.target.value)}
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
									onChange={(e) => setDay(e.target.value)}
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

				{/* 선생님일 경우  주 과목 입력 */}
				{role === "teacher" && (
					<div>
						<input
							type="text"
							placeholder="주 과목 (예: 수학, 과학)"
							value={major}
							onChange={(e) => {
								setMajor(e.target.value);
								setErrors((prev) => ({ ...prev, major: "" }));
							}}
							onBlur={() => validateAndSetErrors()}
							className={`w-full h-11 rounded-xl border px-4 outline-none transition-all ${
								errors.major
									? "border-[#EF4444] focus:border-[#EF4444]"
									: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
							}`}
						/>
						<FormErrorMessage message={errors.major || ""} />
					</div>
				)}

				{/* 학부모일 경우 자녀코드 입력 */}
				{role === "parent" && (
					<div>
						<input
							type="text"
							placeholder="자녀 코드 입력"
							value={childLinkCode}
							onChange={(e) => {
								setChildLinkCode(e.target.value);
								setChildExists(null); // 변경 시 초기화
								setErrors((prev) => ({
									...prev,
									childLinkCode: "",
								})); // 입력 시 오류 초기화
							}}
							onBlur={() => {
								validateAndSetErrors();
								validateChildCode();
							}}
							className={`w-full h-11 rounded-xl border px-4 outline-none transition-all ${
								childExists === false || errors.childLinkCode
									? "border-[#EF4444] focus:border-[#EF4444]"
									: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
							}`}
						/>
						<FormErrorMessage
							message={errors.childLinkCode || ""}
						/>
					</div>
				)}
				<button
					type="submit"
					disabled={loading}
					className="cursor-pointer w-full h-11 text-white font-semibold rounded-xl bg-[#8B5CF6] disabled:opacity-60"
				>
					회원가입
				</button>
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="cursor-pointer w-full h-11 text-white font-semibold rounded-xl bg-[#6B7280]"
				>
					뒤로가기
				</button>
			</form>
			{/* 폼 입력 에러가 아닌, signup중 발생한 서버/시스템 에러는 여기다가 표시 */}
			<FormErrorMessage message={message} />
			<div className="flex justify-center items-center">
				<Link
					to="/login"
					className="text-[#8B5CF6] text-sm hover:underline"
				>
					이미 계정이 있나요? <strong>로그인</strong>
				</Link>
			</div>
		</>
	);
}
