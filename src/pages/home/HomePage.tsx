import { Link } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { useEffect } from "react";

export default function HomePage() {
	const userId = useProfileStore((state) => state.userId);
	const { fetchProfile, logout } = useProfileStore();

	const loading = useProfileStore((state) => state.loading);

	useEffect(() => {
		if (!userId) {
			fetchProfile();
		}
	}, [userId, fetchProfile]);

	if (loading) {
		/* 스켈레톤 UI 추가 예정 */
		return <p>로딩중...</p>;
	}

	return (
		<>
			<div className="mt-30 flex flex-col items-center">
				{/* Top */}
				<div className="text-center mb-[120px] ">
					<h2 className="mb-7 font-bold text-[46px] bg-gradient-to-r from-[#8B5CF6] to-[#EA489A] bg-clip-text text-transparent">
						함께 배우고 성장하는 커뮤니티
					</h2>
					<p className="text-[#6B7280] text-[18px] mb-10">
						학생·선생님·학부모가 모여 질문하고 답하며 성장하는 공간,
						<br />
						<strong>StudyHub</strong>에 오신 것을 환영합니다.
					</p>
					<div className="space-x-4">
						{userId ? (
							<button
								onClick={logout}
								className="cursor-pointer inline-block px-6 py-4 bg-white rounded-xl font-bold text-[#8B5CF6] shadow-[inset_0_0_0_2px_#8B5CF6]"
							>
								로그아웃
							</button>
						) : (
							<>
								<Link
									to="/register"
									className="inline-block px-6 py-4 bg-[#8B5CF6] rounded-xl font-bold text-white"
								>
									회원가입
								</Link>
								<Link
									to="/login"
									className="inline-block px-6 py-4 bg-white rounded-xl font-bold text-[#8B5CF6] shadow-[inset_0_0_0_2px_#8B5CF6]"
								>
									로그인
								</Link>
							</>
						)}
					</div>
				</div>
				{/* 카드들 */}
				<div className="flex items-center flex-nowrap gap-5">
					{/* 게시판 카드 => Link 태그로 수정할 예정 */}
					<Link to="/postList">
						<div className="w-[320px] h-[187px] px-6 py-7 bg-white rounded-xl">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-[18px] h-[18px] bg-[#D9D9D9]">
									{/* 아이콘 */}
								</div>
								<h3 className="font-bold text-xl text-[#8B5CF6]">
									게시판
								</h3>
							</div>
							<div className="text-[#6B7280] space-y-2 mb-3">
								<p className="text-sm">
									질문과 답변, 학습 팁, 경험담을 나누는 공간
								</p>
								<p className="text-xs">
									게시글 120개 · 최근 글 2시간 전 · 💬 8개 ·
									❤️ 15개
								</p>
							</div>
							<div className="flex flex-row gap-2 text-xs text-[#8B5CF6]">
								{/* 반복 함수 구현 예정 */}
								<span className="px-2 py-1 bg-[#ede9fe] rounded-xl">
									#수학
								</span>
								<span className="px-2 py-1 bg-[#ede9fe] rounded-xl">
									#스터디
								</span>
								<span className="px-2 py-1 bg-[#ede9fe] rounded-xl">
									#중학생
								</span>
							</div>
						</div>
					</Link>
					{/* 그룹 카드 */}
					{/* 그룹 활동 x */}
					{/* <div className="w-[320px] flex-grow p-6 border-2 border-dashed border-[#8B5CF6] bg-white rounded-xl text-center">
						<div className="flex flex-col items-center gap-3 mb-4">
							<div className="w-[32px] h-[32px] bg-[#D9D9D9]">
								// 아이콘
							</div>
							<h3 className="font-bold text-[#8B5CF6] text-xl">
								가입한 그룹이 없습니다
							</h3>
							<p className="text-[#6B7280] text-sm">
								아직 참여 중인 그룹이 없습니다.
								<br />
								관심 있는 그룹을 찾아 가입해보세요!
							</p>
						</div>
						<Link
							to="/"
							className="inline-block px-5 py-2.5 bg-[#8B5CF6] text-white font-bold rounded-xl"
						>
							그룹 목록 보기
						</Link>
					</div> */}
					{/* 그룹활동 o */}
					<div className="w-[320px] h-[187px] px-6 py-7 bg-white rounded-xl">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-[18px] h-[18px] bg-[#D9D9D9]">
								{/* 아이콘 */}
							</div>
							<h3 className="font-bold text-xl text-[#8B5CF6]">
								현재 속한 그룹 이름
							</h3>
						</div>
						<div className="text-[#6B7280] space-y-2 mb-3">
							<p className="text-sm">
								중학생 수학 공부를 함께하는 그룹
							</p>
							<p className="text-xs">
								멤버 30명 · 최근 글 1시간 전 · 💬 15개
							</p>
						</div>
						<div className="flex flex-row gap-2 text-xs text-[#8B5CF6]">
							{/* 반복 함수 구현 예정 */}
							<span className="px-2 py-1 bg-[#ede9fe] rounded-xl">
								#수학
							</span>
							<span className="px-2 py-1 bg-[#ede9fe] rounded-xl">
								#스터디
							</span>
							<span className="px-2 py-1 bg-[#ede9fe] rounded-xl">
								#중학생
							</span>
						</div>
					</div>
					{/* 메시지 카드 => Link 태그로 수정할 예정 */}
					<Link
						to="/msg/1"
						className="w-[320px] h-[187px] px-6 py-7 bg-white rounded-xl"
					>
						<div className="flex items-center gap-2 mb-4">
							<div className="w-[18px] h-[18px] bg-[#D9D9D9]">
								{/* 아이콘 */}
							</div>
							<h3 className="font-bold text-xl text-[#8B5CF6]">
								메시지
							</h3>
						</div>
						<p className="text-[#6B7280] space-y-2 mb-3 text-sm">
							1:1 대화 메시지로 소통하세요
						</p>
					</Link>
				</div>
			</div>
		</>
	);
}
