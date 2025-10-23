import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getPointHistory } from "../utils/pointUtils";
import PointHistorySkeleton from "./loading/PointHistorySkeleton";

type PointLog = {
	id: string;
	user_id: string;
	point: number;
	description: string;
	created_at: string;
};

type PointHistoryModalProps = {
	isOpen: boolean;
	onClose: () => void;
	userId: string;
};

export default function PointHistoryModal({
	isOpen,
	onClose,
	userId,
}: PointHistoryModalProps) {
	const [pointHistory, setPointHistory] = useState<PointLog[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen && userId) {
			fetchPointHistory();
		}
	}, [isOpen, userId]);

	const fetchPointHistory = async () => {
		setLoading(true);
		try {
			const history = await getPointHistory(userId);
			setPointHistory(history);
		} catch (error) {
			console.error("포인트 기록 조회 실패:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-gray-900/60 bg-opacity-30 flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div
				className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 w-full max-w-lg max-h-[60vh] overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 헤더 */}
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-bold text-[#8B5CF6]">
						포인트 기록
					</h2>
					<button
						onClick={onClose}
						className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* 내용 */}
				<div className="overflow-y-auto max-h-[45vh]">
					{loading ? (
						<PointHistorySkeleton />
					) : pointHistory.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							포인트 기록이 없습니다.
						</div>
					) : (
						<div className="space-y-2">
							{pointHistory.map((log) => (
								<div
									key={log.id}
									className="flex items-center justify-between p-3 bg-gray-50 bg-opacity-80 rounded-lg"
								>
									<div>
										<p className="text-sm font-medium text-gray-900">
											{log.description}
										</p>
										<p className="text-xs text-gray-500">
											{formatDate(log.created_at)}
										</p>
									</div>
									<div
										className={`text-sm font-bold ${
											log.point > 0
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{log.point > 0 ? "+" : ""}
										{log.point.toLocaleString()}포인트
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
