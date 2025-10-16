import { X } from "lucide-react";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children?: React.ReactNode;
	width?: string; // optional (e.g. "400px")
};

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	width = "350px",
}: ModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			<div
				className={`text-center bg-white rounded-xl shadow-lg p-6 relative animate-fadeIn`}
				style={{ width }}
			>
				{/* 닫기 버튼 */}
				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
				>
					<X size={20} />
				</button>

				{/* 제목 */}
				{title && (
					<h2 className="text-xl font-bold text-gray-800 mb-3">
						{title}
					</h2>
				)}

				{/* 내용 */}
				{children}
			</div>
		</div>
	);
}
