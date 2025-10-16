import { useState } from "react";
import PostTabContainer from "../../components/PostTabContainer";
import PostList from "../../components/PostList";
import PageNation from "../../components/PageNation";
import GroupMembers from "./GroupMembers";
import GroupAttendance from "./GroupAttendance";

export default function GroupPostListPage() {
	const [activeTab, setActiveTab] = useState<string>("information");

	const tabs = [
		{ key: "information", label: "공지사항" },
		{ key: "activity", label: "활동 게시판" },
		{ key: "attendance", label: "출석" },
		{ key: "member", label: "멤버" },
	] as const;

	// 샘플 데이터 (나중에 Supabase 연동 시 대체 가능)
	const posts = [
		{
			id: 1,
			title: "미적분 아주 쉽게 이해하기",
			content:
				"안녕하세요 수학존 입니다 ^^ 오늘은 9등급도 이해할 수 있는 미적분...",
			author: "홍길동",
			likes: 2,
			comments: 3,
			tags: ["수학", "미적분", "개념정리"],
			date: "2025-10-10",
		},
		{
			id: 2,
			title: "고등 영어 문법 정리",
			content: "오늘은 문법의 핵심인 관계대명사를 한 번에 정리해볼게요.",
			author: "이수민",
			likes: 5,
			comments: 2,
			tags: ["영어", "문법", "공부팁"],
			date: "2025-10-11",
		},
		{
			id: 3,
			title: "세계사 흐름 쉽게 외우기",
			content: "세계사의 큰 줄기를 시대별로 정리한 자료를 공유합니다.",
			author: "김철수",
			likes: 3,
			comments: 1,
			tags: ["역사", "세계사", "시험대비"],
			date: "2025-10-12",
		},

		{
			id: 4,
			title: "세계사 흐름 쉽게 외우기",
			content: "세계사의 큰 줄기를 시대별로 정리한 자료를 공유합니다.",
			author: "김철수",
			likes: 3,
			comments: 1,
			tags: ["역사", "세계사", "시험대비"],
			date: "2025-10-12",
		},

		{
			id: 5,
			title: "세계사 흐름 쉽게 외우기",
			content: "세계사의 큰 줄기를 시대별로 정리한 자료를 공유합니다.",
			author: "김철수",
			likes: 3,
			comments: 1,
			tags: ["역사", "세계사", "시험대비"],
			date: "2025-10-12",
		},

		{
			id: 6,
			title: "세계사 흐름 쉽게 외우기",
			content: "세계사의 큰 줄기를 시대별로 정리한 자료를 공유합니다.",
			author: "김철수",
			likes: 3,
			comments: 1,
			tags: ["역사", "세계사", "시험대비"],
			date: "2025-10-12",
		},
	];

	const postsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(posts.length / postsPerPage);

	const displayedPosts = posts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage,
	);

	return (
		<div className="mx-auto w-[1000px] px-10">
			<PostTabContainer
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				title="그룹 게시판"
				tabs={tabs}
			/>

			<div className="mt-8">
				{/* 나중에 연결하면 post_type과 그룹id도 같이 넘겨야 함 */}
				{activeTab === "information" && (
					<>
						<PostList posts={displayedPosts} />
						{/* <PageNation /> */}
						<PageNation
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
						/>
					</>
				)}
				{activeTab === "activity" && (
					<>
						<PostList posts={displayedPosts} />
						{/* <PageNation /> */}
						<PageNation
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
						/>
					</>
				)}
				{activeTab === "attendance" && <GroupAttendance />}
				{activeTab === "member" && <GroupMembers />}
			</div>
		</div>
	);
}
