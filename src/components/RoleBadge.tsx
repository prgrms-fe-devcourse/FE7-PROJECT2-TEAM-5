import type { UserRole } from "../types/auth";

export default function RoleBadge({
	role,
	className = "",
}: {
	role: UserRole;
	className?: string;
}) {
	const getRoleInfo = (role: UserRole) => {
		switch (role) {
			case "student":
				return {
					text: "학생",
					color: "text-blue-600",
					bgColor: "bg-blue-50",
					borderColor: "border-blue-200",
				};
			case "teacher":
				return {
					text: "선생님",
					color: "text-green-600",
					bgColor: "bg-green-50",
					borderColor: "border-green-200",
				};
			case "parent":
				return {
					text: "학부모",
					color: "text-orange-600",
					bgColor: "bg-orange-50",
					borderColor: "border-orange-200",
				};
			default:
				return null;
		}
	};

	const roleInfo = getRoleInfo(role);

	if (!roleInfo) return null;

	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${roleInfo.color} ${roleInfo.bgColor} ${roleInfo.borderColor} ${className}`}
		>
			{roleInfo.text}
		</span>
	);
}
