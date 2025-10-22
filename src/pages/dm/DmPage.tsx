import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import MessageList from "../../components/message/MessageList";
import ChatRoomList from "../../components/message/ChatRoomList";
import {
	useMessagesInRoom,
	useChatRooms,
	useSendMessage,
	useDeleteChatRoom,
} from "../../hooks/useMessages";
import { useProfileStore } from "../../stores/profileStore";
import MessageListSkeleton from "../../components/loading/message/MessageListSkeleton";

export default function DmPage() {
	const { id: roomId } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
		roomId || null,
	);
	const [messageInput, setMessageInput] = useState("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const { messages, isLoading } = useMessagesInRoom(selectedRoomId);
	const { chatRooms, isLoading: chatRoomsLoading } = useChatRooms();
	const { sendMessage, isLoading: isSending } = useSendMessage();
	const { deleteRoom, isLoading: isDeleting } = useDeleteChatRoom();

	// 디버깅용 로그
	console.log("DMPage Debug:", {
		roomId,
		selectedRoomId,
		currentUserId,
		chatRooms: chatRooms.length,
		chatRoomsData: chatRooms,
		messages: messages.length,
		isLoading,
		chatRoomsLoading,
	});

	// URL 파라미터가 변경될 때 채팅방 업데이트
	useEffect(() => {
		if (roomId) {
			console.log("URL 파라미터 변경:", roomId);
			setSelectedRoomId(roomId);
		}
	}, [roomId]);

	// 채팅방 목록이 로드된 후 URL 파라미터 처리
	useEffect(() => {
		if (roomId && chatRooms.length > 0 && !chatRoomsLoading) {
			console.log("채팅방 목록 로드 완료, URL 파라미터 처리:", {
				roomId,
				chatRooms,
			});
			const roomExists = chatRooms.some((room) => room.id === roomId);
			if (roomExists) {
				setSelectedRoomId(roomId);
			} else {
				console.log(
					"URL의 채팅방이 존재하지 않음, 메인으로 리다이렉트",
				);
				navigate("/msg");
			}
		}
	}, [roomId, chatRooms, chatRoomsLoading, navigate]);

	// 채팅방 선택 핸들러
	const handleRoomSelect = (roomId: string) => {
		setSelectedRoomId(roomId);
		navigate(`/msg/${roomId}`);
	};

	// 메시지 전송 핸들러
	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!messageInput.trim() || !selectedRoomId || isSending) {
			return;
		}

		try {
			const result = await sendMessage(
				selectedRoomId,
				messageInput.trim(),
			);
			if (result) {
				setMessageInput(""); // 입력창 초기화
				console.log("메시지 전송 성공:", result);
			} else {
				console.error("메시지 전송 실패");
			}
		} catch (error) {
			console.error("메시지 전송 중 오류:", error);
		}
	};

	// 채팅방 삭제 핸들러
	const handleDeleteRoom = async () => {
		if (!selectedRoomId || isDeleting) {
			return;
		}

		try {
			const result = await deleteRoom(selectedRoomId);
			if (result) {
				console.log("채팅방 삭제 성공");
				setSelectedRoomId(null);
				setShowDeleteModal(false);
				navigate("/msg");
			} else {
				console.error("채팅방 삭제 실패");
			}
		} catch (error) {
			console.error("채팅방 삭제 중 오류:", error);
		}
	};

	// 선택된 채팅방의 상대방 정보 가져오기
	const selectedRoom = chatRooms.find((room) => room.id === selectedRoomId);
	const otherUser = selectedRoom
		? selectedRoom.user1_id === currentUserId
			? selectedRoom.user2
			: selectedRoom.user1
		: null;

	return (
		<>
			<div className="w-[1000px] h-[790px] bg-white rounded-xl flex flex-row overflow-hidden">
				{/* 채팅 리스트 */}
				<div className="w-[250px] border-r border-[#E5E7EB] bg-[#F9FAFB] rounded-l-xl flex flex-col">
					<div className="h-[60px] border-b border-[#E5E7EB] rounded-t-xl p-4">
						<h2 className="font-bold text-lg text-[#8B5CF6]">
							채팅
						</h2>
					</div>
					{/* 채팅방 목록 */}
					<ChatRoomList
						chatRooms={chatRooms}
						currentUserId={currentUserId || ""}
						selectedRoomId={selectedRoomId}
						onRoomSelect={handleRoomSelect}
						isLoading={chatRoomsLoading}
					/>
				</div>
				{/* 채팅창 */}
				<div className="flex-1 flex flex-col">
					{/* 상단 헤더 */}
					<div className="h-[60px] border-b border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center px-6">
						<h3 className="text-xl font-medium">
							{otherUser?.nickname || "채팅방을 선택해주세요"}
						</h3>
						<button
							className="w-[30px] h-[30px] bg-[#d9d9d9] cursor-pointer rounded flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
							onClick={() => setShowDeleteModal(true)}
							disabled={!selectedRoomId || isDeleting}
						>
							{/* 휴지통 아이콘 */}
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="3,6 5,6 21,6"></polyline>
								<path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
								<line x1="10" y1="11" x2="10" y2="17"></line>
								<line x1="14" y1="11" x2="14" y2="17"></line>
							</svg>
						</button>
					</div>

					{/* 채팅 내용 영역 */}
					<div className="flex-1 flex flex-col overflow-hidden">
						{/* 스크롤 되는 본문 */}
						{selectedRoomId && currentUserId ? (
							isLoading ? (
								<MessageListSkeleton />
							) : (
								<MessageList
									messages={messages}
									currentUserId={currentUserId}
								/>
							)
						) : (
							<div className="flex-1 flex items-center justify-center">
								<div className="text-gray-500">
									채팅방을 선택해주세요
								</div>
							</div>
						)}

						{/* 입력창 */}
						<form
							onSubmit={handleSendMessage}
							className="w-full p-4 border-t border-[#E5E7EB] flex items-center gap-2 bg-white"
						>
							<input
								type="text"
								placeholder="메시지를 입력하세요"
								value={messageInput}
								onChange={(e) =>
									setMessageInput(e.target.value)
								}
								className="flex-1 h-11 border border-[#E5E7EB] rounded-xl p-2"
								disabled={isSending}
							/>
							<input
								type="file"
								className="hidden"
								id="file-upload"
								accept="image/*"
							/>
							<label
								htmlFor="file-upload"
								className="w-11 h-11 border border-[#E5E7EB] rounded-lg flex justify-center items-center cursor-pointer"
							>
								{/* 이미지 전송 버튼 아이콘 */}
								{/* 이미지를 첨부하면 이미지 전송할지 팝업창이 나오고 그 팝업창에는
                                이미지 프리뷰가 나오고 전송하시겠습니까? 문구를 통해 전송할지 취소할지 결정 */}
							</label>
							<button
								type="submit"
								disabled={
									isSending ||
									!messageInput.trim() ||
									!selectedRoomId
								}
								className={`cursor-pointer text-sm text-white font-medium rounded-lg px-4 py-3 ${
									isSending ||
									!messageInput.trim() ||
									!selectedRoomId
										? "bg-gray-400 cursor-not-allowed"
										: "bg-[#8B5CF6] hover:bg-[#7C3AED]"
								}`}
							>
								전송
							</button>
						</form>
					</div>
				</div>
			</div>

			{/* 삭제 확인 모달 */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-gray-900/60 bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold mb-4">
							{otherUser?.nickname}님과의 채팅방 삭제
						</h3>
						<p className="text-gray-600 mb-6">
							정말로 이 채팅방을 삭제하시겠습니까?
							<br />
							삭제된 채팅방과 메시지는 복구할 수 없습니다.
							<br />
							상대방의 채팅방도 삭제됩니다!
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
								disabled={isDeleting}
							>
								취소
							</button>
							<button
								onClick={handleDeleteRoom}
								disabled={isDeleting}
								className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
							>
								삭제
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
