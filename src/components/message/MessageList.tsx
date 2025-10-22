import { useEffect, useRef } from "react";
import type { Message } from "../../types/message";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
	messages: Message[];
	currentUserId: string;
}

// 메시지를 날짜별로 표시하기 위해서 그룹핑하는 함수
const groupMessagesByDate = (messages: Message[]) => {
	const groups: { [key: string]: Message[] } = {};

	messages.forEach((message) => {
		const date = new Date(message.created_at).toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
			weekday: "long",
		});

		if (!groups[date]) {
			groups[date] = [];
		}
		// gruops 객체에 key가 date인 배열에 message 추가
		groups[date].push(message);
	});

	return groups;
};

export default function MessageList({
	messages,
	currentUserId,
}: MessageListProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const groupedMessages = groupMessagesByDate(messages);

	// 메시지가 변경될 때마다 최하단으로 스크롤
	useEffect(() => {
		if (scrollContainerRef.current) {
			const scrollContainer = scrollContainerRef.current;
			// 부드러운 스크롤 애니메이션으로 최하단으로 이동
			scrollContainer.scrollTo({
				top: scrollContainer.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages]);

	return (
		<div
			ref={scrollContainerRef}
			className="flex-1 overflow-y-auto scrollbar-custom p-6"
		>
			{/*date와 dateMessages 순회하면서 메시지 표시 */}
			{Object.entries(groupedMessages).map(([date, dateMessages]) => (
				<div key={date}>
					{/* 날짜 구분선 */}
					<div className="flex justify-center mb-6">
						<span className="inline-block px-4 py-2 bg-[#E5E7EB] rounded-full text-sm font-light">
							{date}
						</span>
					</div>

					{/* 해당 날짜의 메시지들 */}
					<div className="w-full space-y-4">
						{dateMessages.map((message) => (
							<MessageBubble
								key={message.id}
								message={message}
								currentUserId={currentUserId}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
