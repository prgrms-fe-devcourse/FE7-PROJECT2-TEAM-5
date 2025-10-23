import {
	MessageCircle,
	Milestone,
	UsersRound,
	ChevronRight,
} from "lucide-react";
import { Link } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { useGroupStore } from "../../stores/groupStore";
import { useEffect, useState } from "react";
import { useSetOnlineStatus } from "../../hooks/useSetOnlineStatus";
import HomePageSkeleton from "../../components/loading/home/HomePageSkeleton";

export default function HomePage() {
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const loading = useProfileStore((state) => state.loading);
	const fetchProfile = useProfileStore((state) => state.fetchProfile);

	// 그룹 상태 관리
	const {
		groups,
		currentGroup,
		loading: groupLoading,
		fetchUserGroups,
		setCurrentGroup,
	} = useGroupStore();

	// 현재 표시할 그룹 인덱스
	const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

	// 그룹이 변경될 때마다 currentGroup 업데이트
	useEffect(() => {
		if (groups.length > 0) {
			setCurrentGroup(groups[currentGroupIndex]);
		}
	}, [groups, currentGroupIndex, setCurrentGroup]);

	// 다음 그룹으로 이동
	const goToNextGroup = (e: React.MouseEvent) => {
		e.preventDefault(); // Link 클릭 방지
		e.stopPropagation();

		if (groups.length > 0) {
			const nextIndex = (currentGroupIndex + 1) % groups.length;
			setCurrentGroupIndex(nextIndex);
		}
	};

	// 시간 포맷팅 함수
	const formatTimeAgo = (dateString: string): string => {
		const now = new Date();
		const date = new Date(dateString);
		const diffInSeconds = Math.floor(
			(now.getTime() - date.getTime()) / 1000,
		);

		if (diffInSeconds < 60) return "방금 전";
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) return `${diffInHours}시간 전`;
		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) return `${diffInDays}일 전`;
		const diffInWeeks = Math.floor(diffInDays / 7);
		if (diffInWeeks < 4) return `${diffInWeeks}주 전`;
		const diffInMonths = Math.floor(diffInDays / 30);
		if (diffInMonths < 12) return `${diffInMonths}개월 전`;
		const diffInYears = Math.floor(diffInDays / 365);
		return `${diffInYears}년 전`;
	};

	const { logout } = useProfileStore();
	const { logoutOffline } = useSetOnlineStatus(
		currentUserId ? currentUserId : "",
	);

	useEffect(() => {
		if (!currentUserId) {
			fetchProfile();
		}
	}, [currentUserId, fetchProfile]);

	// 사용자 그룹 정보 로드
	useEffect(() => {
		if (currentUserId) {
			fetchUserGroups(currentUserId);
		}
	}, [currentUserId, fetchUserGroups]);

	if (loading || groupLoading) {
		return <HomePageSkeleton />;
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
						{currentUserId ? (
							<button
								onClick={async () => {
									await logoutOffline();
									logout();
								}}
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
				<div className="h-[193px] flex items-center flex-nowrap gap-5">
					{/* 게시판 카드 => Link 태그로 수정할 예정 */}
					<Link
						to="/posts"
						className="w-[320px] h-full px-6 py-7 bg-white rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<div className="flex items-center gap-2 mb-4">
							<Milestone size={18} />
							<h3 className="font-bold text-xl text-[#8B5CF6]">
								게시판
							</h3>
						</div>
						<div className="text-[#6B7280] space-y-2 mb-3">
							<p className="text-sm">
								질문과 답변, 학습 팁, 경험담을 나누는 공간
							</p>
							<p className="text-xs">
								게시글 120개 · 최근 글 2시간 전 · 💬 8개 · ❤️
								15개
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
					</Link>
					{/* 그룹 카드 */}
					{currentGroup ? (
						<div className="relative w-[320px] h-full">
							<Link
								to={`/groups/${currentGroup.id}/posts`}
								className="block w-full h-full px-6 py-7 bg-white rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
							>
								<div className="flex items-center gap-2 mb-4">
									<UsersRound size={18} />
									<h3 className="font-bold text-xl text-[#8B5CF6]">
										{currentGroup.name}
									</h3>
								</div>
								<div className="text-[#6B7280] space-y-2 mb-3">
									<p className="text-sm">
										{currentGroup.bio ||
											"함께 학습하는 그룹"}
									</p>
									<p className="text-xs">
										멤버 {currentGroup.member_count || 0}명
										·{" "}
										{currentGroup.last_activity
											? formatTimeAgo(
													currentGroup.last_activity,
												)
											: "활동 없음"}
									</p>
								</div>

								{/* 그룹 인디케이터 (카드 안으로 이동) */}
								{groups.length > 1 && (
									<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
										{groups.map((_, index) => (
											<div
												key={index}
												className={`w-2 h-2 rounded-full transition-colors ${
													index === currentGroupIndex
														? "bg-[#8B5CF6]"
														: "bg-gray-300"
												}`}
											/>
										))}
									</div>
								)}
							</Link>

							{/* 다음 그룹 버튼 (그룹이 2개 이상일 때만 보이도록) */}
							{groups.length > 1 && (
								<button
									onClick={goToNextGroup}
									className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-[#8B5CF6] text-white rounded-full shadow-lg hover:bg-[#B08DFF] transition-colors flex items-center justify-center z-10"
									title="다음 그룹 보기"
								>
									<ChevronRight size={16} />
								</button>
							)}
						</div>
					) : (
						<div className="w-[320px] h-full flex-grow py-7 px-6 border-2 border-dashed border-[#8B5CF6] bg-white rounded-xl shadow-md text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
							<div className="flex flex-col items-center gap-3">
								<div className="flex items-center gap-2">
									<UsersRound size={18} />
									<h3 className="font-bold text-xl text-[#8B5CF6]">
										가입한 그룹이 없습니다
									</h3>
								</div>
								<p className="text-[#6B7280] text-sm mb-0.5">
									아직 참여 중인 그룹이 없습니다.
									<br />
									관심 있는 그룹을 찾아 가입해보세요!
								</p>
								<Link
									to="/groups"
									className="inline-block px-5 py-3 bg-[#8B5CF6] text-sm text-white font-bold rounded-xl"
								>
									그룹 목록 보기
								</Link>
							</div>
						</div>
					)}
					{/* 그룹활동 o */}
					{/* <Link
						to="groups"
						className="w-[320px] h-[187px] px-6 py-7 bg-white rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<div className="flex items-center gap-2 mb-4">
							<UsersRound size={18} />
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
					</Link> */}
					{/* 메시지 카드 => Link 태그로 수정할 예정 */}
					<Link
						to="/msg/1"
						className="w-[320px] h-full px-6 py-7 bg-white rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<div className="flex items-center gap-2 mb-4">
							<MessageCircle size={18} />
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
