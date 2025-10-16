import supabase from "../../utils/supabase";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import type { UserRole, AuthForm } from "../../types/auth";
import { ChevronDown } from "lucide-react";

const initialErrors: AuthForm = {
	email: "",
	password: "",
	confirmPassword: "",
	nickname: "",
	role: "",
	birthDate: "",
	major: "",
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

	// UI state
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>(""); // 성공 또는 실패 메시지
	const [errors, setErrors] = useState<AuthForm>(initialErrors); // 필드별 오류 메시지 State 추가

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

	// 이메일 정합성 체크
	const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

	// 비밀번호 정규식 (최소 8자 이상, 영문자 1개 이상, 숫자 1개 이상)
	const isValidPassword = (p: string) =>
		p.length >= 8 && /[a-zA-Z]/.test(p) && /[0-9]/.test(p);

	// 필드별 유효성 검사 및 에러 상태 업데이트
	const validateAndSetErrors = useCallback((): boolean => {
		let newErrors: AuthForm = { ...initialErrors };
		let isValid = true;

		if (!isValidEmail(email)) {
			newErrors.email = "올바른 이메일 형식이 아닙니다.";
			isValid = false;
		}

		if (!isValidPassword(password)) {
			newErrors.password =
				"비밀번호는 최소 8자, 영문/숫자 각 1개 이상 포함해야 합니다.";
			isValid = false;
		}

		if (password !== confirmPassword) {
			newErrors.confirmPassword = "비밀번호가 다릅니다.";
			isValid = false;
		} else if (confirmPassword.trim() === "") {
			newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
			isValid = false;
		}

		if (nickname.trim() === "") {
			newErrors.nickname = "닉네임을 입력해주세요.";
			isValid = false;
		}

		if (role === "") {
			newErrors.role = "소속 구분을 선택해주세요.";
			isValid = false;
		}

		if (role !== "") {
			// 역할이 선택되었을 때만 생년월일 검사
			if (year === "" || month === "" || day === "") {
				newErrors.birthDate = "출생 연월일을 모두 선택해주세요.";
				isValid = false;
			}
		}

		if (role === "teacher" && major.trim() === "") {
			newErrors.major = "주 과목을 입력해주세요.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
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
	]);

	// auth 테이블에 회원가입 시도
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");
		setLoading(true);

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});
			if (error) {
				setMessage(`회원가입 실패: ${error.message}`);
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

			// 성공) 임시 프로필을 폼에 입력된 프로필로 업데이트
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

			// 실패) 프로필 업데이트가 실패
			if (profileError) {
				setMessage(
					`회원가입 성공, 하지만 프로필 업데이트 실패: ${profileError.message}`,
				);

				console.error("Profile update error:", profileError);
			} else {
				// 성공했다면 메인페이지로,
				// TODO) 학부모의 경우, 자녀코드 설정 페이지로
				navigate("/");
			}
		} catch (err) {
			console.error("Registration Error:", err);
			setMessage("예상치 못한 오류가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	// 오류 메시지를 표시하는 컴포넌트
	const ErrorMessage = ({ message }: { message: string }) => {
		if (!message) return null;
		return (
			<p className="text-[#EF4444] text-xs mt-1 px-1 transition-opacity duration-300">
				{message}
			</p>
		);
	};

	return (
		<>
			<h4 className="text-[28px] font-black mb-6 text-[#8b5cf6] text-center">
				회원가입
			</h4>

			{/* 이메일 입력 */}
			<form
				className="w-full flex flex-col gap-4 mb-7"
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
					<ErrorMessage message={errors.email} />
				</div>

				{/* 비밀번호 입력 */}
				<div>
					<input
						id="login-password"
						type="password"
						placeholder="비밀번호 (최소 6자, 영문/숫자 필수)"
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
					<ErrorMessage message={errors.password} />
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
					<ErrorMessage message={errors.confirmPassword} />
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
						onBlur={() => validateAndSetErrors()}
						className={`w-full h-11 rounded-xl border px-4 outline-none transition-all ${
							errors.nickname
								? "border-[#EF4444] focus:border-[#EF4444]"
								: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
						}`}
					/>
					<ErrorMessage message={errors.nickname} />
				</div>

				{/* 소속 구분 */}
				<div>
					<select
						value={role}
						onChange={(e) => {
							setRole(e.target.value as UserRole);
							setErrors((prev) => ({ ...prev, role: "" }));
						}}
						onBlur={() => validateAndSetErrors()}
						className={`w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none bg-white ${
							errors.role
								? "border-[#EF4444] focus:border-[#EF4444]"
								: "border-[#D1D5DB] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/50"
						}`}
					>
						<option value="" disabled>
							소속 구분
						</option>
						<option value="student">학생</option>
						<option value="teacher">선생님</option>
						<option value="parent">학부모</option>
					</select>
					<ErrorMessage message={errors.role} />
					<ChevronDown
						size={18}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
					/>
				</div>

				{/* 출생연월일 (Birth Date Selects) */}
				{role !== "" && (
					<div>
						<div
							className="grid grid-cols-[1.3fr_1fr_1fr] gap-3"
							onBlur={() => validateAndSetErrors()}
						>
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
						<ErrorMessage message={errors.birthDate} />
					</div>
				)}

				{/* 선생님 주 과목 입력 (Major Input) */}
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
						<ErrorMessage message={errors.major} />
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
			{/* signup 함수 수행에서 발생한 에러 메세지 출력 */}
			{message && (
				<div className="text-sm text-center text-[#EF4444]">
					{message}
				</div>
			)}
			<div className="flex flex-col gap-4 items-center mb-3">
				<div className="text-xs text-[#6B7280]">
					이미 계정이 있나요?{" "}
					<Link to="/login" className="text-[#8B5CF6] underline">
						로그인
					</Link>
				</div>
			</div>
		</>
	);
}
