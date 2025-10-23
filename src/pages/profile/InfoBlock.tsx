import type { BadgeLog } from "../../types/badge";
import type { ChildInfo } from "../../types/profile";
import { decodeHtmlEntities } from "../../utils/codeToEmoji";

interface InfoBlockProps {
	title: string;
	content?: string | number | null;
	childList?: ChildInfo[];
	tags?: string[] | null;
	badges?: BadgeLog[];
	isFullWidth?: boolean;
}

export default function InfoBlock({
	title,
	content,
	childList,
	tags,
	badges,
	isFullWidth = false,
}: InfoBlockProps) {
	return (
		<div className={`flex flex-col ${isFullWidth ? "lg:col-span-2" : ""}`}>
			<div className="text-xs font-medium text-gray-500 mb-1">
				{title}
			</div>
			{content && (
				<div className="font-medium text-gray-800 leading-snug whitespace-pre-wrap">
					{content}
				</div>
			)}
			{childList && childList.length > 0 && (
				<div className="font-medium text-gray-800 leading-snug whitespace-pre-wrap">
					{childList.map((child) => child.nickname).join(", ")}
				</div>
			)}
			{tags && (
				<div className="flex flex-wrap gap-1 mt-1">
					{tags.map((tag, index) => (
						<div
							key={tag}
							className={`px-3 py-1 text-xs font-medium text-white rounded-md ${index % 2 === 0 ? "bg-violet-500" : "bg-[#ea489a]"}`}
						>
							{tag}
						</div>
					))}
				</div>
			)}
			{badges && (
				<div className="flex flex-col space-y-1 mt-1">
					{badges.map((badge) => (
						<span
							key={badge.id}
							className="font-medium text-gray-800 whitespace-nowrap"
						>
							{decodeHtmlEntities(badge.badges?.icon_url ?? "")}
							{badge.badges?.name}
						</span>
					))}
				</div>
			)}
		</div>
	);
}
