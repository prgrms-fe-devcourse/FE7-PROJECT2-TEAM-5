import supabase from "../../utils/supabase";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";

type role = "" | "student" | "teacher" | "parent";

export default function RegisterEmailPage() {
	const navigate = useNavigate();

	const [role, setRole] = useState<role>("");

	// 이번 버전에서 추가, 정보의 유효성 검증을 위해
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [nickname, setNickname] = useState<string>("");

	const [year, setYear] = useState<string>("");
	const [month, setMonth] = useState<string>("");
	const [day, setDay] = useState<string>("");

	const [major, setMajor] = useState<string>("");

	// 이번 버전에서 추가, UI state
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>(""); // Success or error message

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
			return;
		}
		if (role !== "teacher") setMajor("");
	}, [role]);

	// 이메일 정합성 체크
	const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

	const validateForm = useCallback(() => {
		if (!isValidEmail(email)) return "유효한 이메일 주소를 입력해주세요.";
		if (password.length < 6)
			return "비밀번호는 최소 6자 이상이어야 합니다.";
		if (nickname.trim() === "") return "닉네임을 입력해주세요.";
		if (role === "") return "소속 구분을 선택해주세요.";
		if (year === "" || month === "" || day === "")
			return "출생연월일을 모두 선택해주세요.";
		if (role === "teacher" && major.trim() === "")
			return "주 과목을 입력해주세요.";

		return null;
	}, [email, password, nickname, role, year, month, day, major]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");
		const validationError = validateForm();

		if (validationError) {
			setMessage(`오류: ${validationError}`);
			return;
		}

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

			// auth.users에는 들어갔으나, public.users에는 안 들어감
			if (!user || !user.id) {
				setMessage(
					"회원가입은 성공했으나 사용자 정보를 가져올 수 없습니다.",
				);
				setLoading(false);

				return;
			}

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

			if (profileError) {
				setMessage(
					`회원가입 성공, 하지만 프로필 업데이트 실패: ${profileError.message}`,
				);

				console.error("Profile update error:", profileError);
			} else {
				navigate("/");
			}

			// TODO: 성공 후 로그인 페이지로 리디렉션 로직 추가할 것!!
		} catch (err) {
			console.error("Registration Error:", err);
			setMessage(
				"예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<h4 className="text-[28px] font-black mb-6 text-[#8b5cf6] text-center">
				회원가입
			</h4>
			<form
				className="w-full flex flex-col gap-4 mb-7"
				onSubmit={handleSubmit}
			>
				<input
					id="login-email"
					type="email"
					placeholder="이메일"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
				/>
				<input
					id="login-password"
					type="password"
					placeholder="비밀번호"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
				/>
				<input
					id="login-name"
					type="text"
					placeholder="닉네임"
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
					className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
				/>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value as role)}
					className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
				>
					<option value="" disabled>
						소속 구분
					</option>
					<option value="student">학생</option>
					<option value="teacher">선생님</option>
					<option value="parent">학부모</option>
				</select>
				{role !== "" && (
					<div className="grid grid-cols-[1.3fr_1fr_1fr] gap-3">
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
							<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
								▾
							</span>
						</div>
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
							<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
								▾
							</span>
						</div>
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
							<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
								▾
							</span>
						</div>
					</div>
				)}
				{role === "teacher" && (
					<>
						<input
							type="text"
							placeholder="주 과목 (예: 수학, 과학) "
							value={major}
							onChange={(e) => setMajor(e.target.value)}
							className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
						/>
					</>
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
			{/* 임시로 에러 메세지 출력 */}
			{message && (
				<div className="text-sm text-center text-[#6B7280]">
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
