import { useState } from "react";
import { Link } from "react-router";
import PageNation from "../../components/PageNation";

type Post = {
	id: number;
	title: string;
	content: string;
	tags: string[];
	info: string; // "날짜 · 좋아요 · 댓글"
};

export default function ActivitiesPosts() {
	const dummyPosts: Post[] = [
		{
			id: 1,
			title: "수학 문제 풀이 같이 할 분?",
			content: "고1 수학 함수 단원인데 어려운 문제 공유합니다.",
			tags: ["#해시태그", "#해시태그", "#해시태그"],
			info: "2025-09-20 · 좋아요 12 · 댓글 5",
		},
		{
			id: 2,
			title: "영어 독해 스터디 모집",
			content: "고2 영어 지문 독해 연습 같이 하실 분 구합니다.",
			tags: ["#영어", "#독해", "#스터디"],
			info: "2025-09-19 · 좋아요 8 · 댓글 2",
		},
		{
			id: 3,
			title: "과학 실험 같이 할 친구",
			content: "물리 실험 보고서 같이 작성할 친구 구해요.",
			tags: ["#과학", "#실험", "#물리"],
			info: "2025-09-18 · 좋아요 5 · 댓글 1",
		},
		{
			id: 4,
			title: "코딩 같이 할 사람",
			content: "React 연습 문제 같이 풀 사람 모집",
			tags: ["#코딩", "#React", "#연습"],
			info: "2025-09-17 · 좋아요 10 · 댓글 4",
		},
		{
			id: 5,
			title: "역사 토론 스터디",
			content: "한국 근현대사 토론 같이할 사람",
			tags: ["#역사", "#토론", "#스터디"],
			info: "2025-09-16 · 좋아요 7 · 댓글 3",
		},
		{
			id: 6,
			title: "음악 감상 모임",
			content: "클래식 음악 같이 들어볼 사람 구합니다.",
			tags: ["#음악", "#클래식", "#감상"],
			info: "2025-09-15 · 좋아요 3 · 댓글 0",
		},
	];

	const postsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(dummyPosts.length / postsPerPage);

	const displayedPosts = dummyPosts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage,
	);

	return (
		<div>
			{/* 게시글 반복 */}
			{displayedPosts.map((post, idx) => (
				<Link to={`/post/${post.id}`}>
					<div
						key={post.id}
						className={`p-4 flex flex-row justify-between ${
							idx > 0 ? "border-t border-[#E5E7EB]" : ""
						}`}
					>
						{/* left */}
						<div className="flex flex-col gap-1">
							<p className="font-bold text-lg">{post.title}</p>
							<p className="text-gray-500">{post.content}</p>
							<div className="mt-1.5 flex flex-row items-center gap-1">
								{post.tags.map((tag, index) => (
									<span
										key={index}
										className="px-2 py-1 bg-[#F291C2] rounded-full text-white text-xs"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
						{/* right */}
						<div className="text-sm text-[#9CA3AF]">
							{post.info}
						</div>
					</div>
				</Link>
			))}

			{/* 페이지네이션 */}
			<PageNation
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
