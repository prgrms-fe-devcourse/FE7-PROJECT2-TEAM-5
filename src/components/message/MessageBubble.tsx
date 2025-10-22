import type { Message } from "../../types/message";

interface MessageBubbleProps {
	message: Message;
	currentUserId: string;
}

// URL이 이미지인지 확인하는 함수
const isImageUrl = (text: string): boolean => {
	// base64 이미지 확인
	if (text.startsWith("data:image/")) {
		return true;
	}

	// 일반 URL 이미지 확인
	try {
		const url = new URL(text);
		const imageExtensions = [
			".jpg",
			".jpeg",
			".png",
			".gif",
			".webp",
			".svg",
		];
		return imageExtensions.some((ext) =>
			url.pathname.toLowerCase().endsWith(ext),
		);
	} catch {
		return false;
	}
};

// 시간 포맷팅 함수
const formatTime = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleTimeString("ko-KR", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

export default function MessageBubble({
	message,
	currentUserId,
}: MessageBubbleProps) {
	// 현재 로그인한 사용자가 보낸 메시지인지 확인 (다르게 보여야 하니까)
	const isCurrentUser = message.sender_id === currentUserId;
	// 메시지가 이미지인지 확인
	const isImage = isImageUrl(message.message);

	return (
		<div
			className={`flex flex-row ${isCurrentUser ? "flex-row-reverse" : ""} items-end gap-1 mb-4`}
		>
			<div className="flex flex-col gap-1 w-[500px]">
				{isImage ? (
					// 이미지 확장자
					<div
						className={`rounded-xl px-4 py-2 ${
							isCurrentUser ? "bg-[#8B5CF6]" : "bg-[#E5E7EB]"
						}`}
					>
						<img
							src={message.message}
							alt="메시지 이미지"
							className="max-w-xs rounded-xl"
						/>
					</div>
				) : (
					// 일반 메시지
					<p
						className={`rounded-xl px-4 py-2 ${
							isCurrentUser
								? "bg-[#8B5CF6] text-white"
								: "bg-[#E5E7EB]"
						}`}
					>
						{message.message}
					</p>
				)}
			</div>
			<span className="text-xs text-gray-500">
				{formatTime(message.created_at)}
			</span>
		</div>
	);
}
