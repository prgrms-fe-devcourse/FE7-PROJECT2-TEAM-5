interface InfoBlockProps {
	title: string;
	content?: string;
	tags?: string[];
	badges?: string[];
	isFullWidth?: boolean;
}

export default function InfoBlock({
	title,
	content,
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
				<div className="text-base font-medium text-gray-800 leading-snug whitespace-pre-wrap">
					{content}
				</div>
			)}
			{tags && (
				<div className="flex flex-wrap gap-2 mt-2">
					{tags.map((tag) => (
						<div
							key={tag}
							className={`px-3 py-1 text-xs font-medium text-white rounded-md ${tag === "과학" || tag === "국어" ? "bg-violet-500" : "bg-[#ea489a]"}`}
						>
							{tag}
						</div>
					))}
				</div>
			)}
			{badges && (
				<div className="flex flex-col space-y-1 mt-1">
					{badges.map((badge) => (
						<div
							key={badge}
							className="text-base font-medium text-gray-800 whitespace-nowrap"
						>
							{badge}
						</div>
					))}
				</div>
			)}
		</div>
	);
}