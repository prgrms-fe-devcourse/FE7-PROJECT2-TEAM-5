interface FormErrorMessageProps {
	message: string;
}

export const FormErrorMessage = ({ message }: FormErrorMessageProps) => {
	if (!message) return null;

	return (
		<p className="text-[#EF4444] text-xs mt-1 px-1 transition-opacity duration-300">
			{message}
		</p>
	);
};
