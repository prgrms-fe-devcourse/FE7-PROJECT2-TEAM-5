import React from "react";
import type { Message } from "../types/message";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
	messages: Message[];
	currentUserId: string;
}

// 메시지를 날짜별로 그룹핑하는 함수
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
		groups[date].push(message);
	});

	return groups;
};

export default function MessageList({
	messages,
	currentUserId,
}: MessageListProps) {
	const groupedMessages = groupMessagesByDate(messages);

	return (
		<div className="flex-1 overflow-y-auto p-6">
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
