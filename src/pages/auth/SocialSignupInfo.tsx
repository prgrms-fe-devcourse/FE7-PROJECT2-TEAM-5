import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";

type role = "" | "student" | "teacher" | "parent";

export default function SocialSignupInfo() {
	const [role, setRole] = useState<role>("");

	const [year, setYear] = useState<string>("");
	const [month, setMonth] = useState<string>("");
	const [day, setDay] = useState<string>("");

	const [subject, setSubject] = useState<string>("");
	const [childCode, setChildCode] = useState<string>("");

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
			setSubject("");
			setChildCode("");
			return;
		}
		if (role !== "teacher") setSubject("");
		if (role !== "teacher" && role !== "parent") setChildCode("");
	}, [role]);

	return (
		<>
			<h4 className="text-[28px] font-black mb-6 text-[#8b5cf6] text-center">
				회원 정보 입력
			</h4>

			<form className="w-full flex flex-col gap-4">
				<input
					id="login-name"
					type="text"
					placeholder="이름"
					className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
				/>

				<div className="relative">
					<select
						value={role}
						onChange={(e) => setRole(e.target.value as role)}
						className={`w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none appearance-none ${
							!role ? "text-gray-400" : ""
						}`}
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
				</div>

				{role !== "" && (
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
				)}

				{/* 선생님 */}
				{role === "teacher" && (
					<>
						<input
							type="text"
							placeholder="전공 과목"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
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
				<Link to="/">
					<button
						type="submit"
						className="cursor-pointer w-full h-11 text-white font-semibold rounded-xl bg-[#8B5CF6]"
					>
						회원가입
					</button>
				</Link>
			</form>
		</>
	);
}
