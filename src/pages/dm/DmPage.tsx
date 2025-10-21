import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import MessageList from "../../components/MessageList";
import ChatRoomList from "../../components/ChatRoomList";
import { useMessagesInRoom, useChatRooms } from "../../hooks/useMessages";
import { useProfileStore } from "../../stores/profileStore";

export default function DmPage() {
	const { id: roomId } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
		roomId || null,
	);
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const { messages, isLoading } = useMessagesInRoom(selectedRoomId);
	const { chatRooms, isLoading: chatRoomsLoading } = useChatRooms();

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
				{/* 나중에 데이터 받아와서 사용할 로직 */}
				{/* <div className="w-[250px] border-r border-[#E5E7EB] bg-[#F9FAFB] rounded-l-xl">
					{매개변수.map((room) => (
						<div
							key={room.id}
							className="cursor-pointer flex flex-row p-4 items-center gap-3 hover:bg-[rgba(139,92,246,0.1)]"
						>
							<div className="w-10 h-10 bg-[#D9D9D9] rounded-full">
								<img
									src={room.user.avatar}
									alt={room.user.name}
								/>
							</div>
							<span>{room.user.name}</span>
						</div>
					))}
				</div> */}
				{/* 채팅창 */}
				<div className="flex-1 flex flex-col">
					{/* 상단 헤더 */}
					<div className="h-[60px] border-b border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center px-6">
						<h3 className="text-xl font-medium">
							{otherUser?.nickname || "채팅방을 선택해주세요"}
						</h3>
						<button className="w-[30px] h-[30px] bg-[#d9d9d9] cursor-pointer"></button>
					</div>

					{/* 채팅 내용 영역 */}
					<div className="flex-1 flex flex-col overflow-hidden">
						{/* 스크롤 되는 본문 */}
						{selectedRoomId && currentUserId ? (
							isLoading ? (
								<div className="flex-1 flex items-center justify-center">
									<div className="text-gray-500">
										메시지를 불러오는 중...
									</div>
								</div>
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
						<form className="w-full p-4 border-t border-[#E5E7EB] flex items-center gap-2 bg-white">
							<input
								type="text"
								placeholder="메시지를 입력하세요"
								className="flex-1 h-11 border border-[#E5E7EB] rounded-xl p-2"
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
								className="cursor-pointer text-sm text-white font-medium rounded-lg px-4 py-3 bg-[#8B5CF6]"
							>
								전송
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
