interface TabButtonProps {
	label: string;
	isActive: boolean;
	onClick?: () => void; // 클릭 이벤트는 옵션
}

export default function TabButton({
	label,
	isActive,
	onClick,
}: TabButtonProps) {
	return (
		<button
			className={`px-4 py-2 cursor-pointer transition duration-150 ease-in-out 
            ${isActive ? "bg-violet-500 rounded-t-xl" : "bg-white rounded-xl"}
            ${isActive ? "text-white" : "text-violet-500"}
            text-base font-normal text-center`}
			onClick={onClick}
		>
			{label}
		</button>
	);
}
