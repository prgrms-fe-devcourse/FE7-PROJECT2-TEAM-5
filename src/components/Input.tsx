type InputProps = React.ComponentPropsWithoutRef<"input"> & {
	validationText?: string;
};

// validationText: validation 안내문구
// childer: lable 이름
export default function Input({
	validationText,
	children,
	...rest
}: InputProps) {
	return (
		<>
			<input
				className={
					"peer w-full resize-none outline-none align-middle " +
					(rest.readOnly && "text-[#C8C8C8]")
				}
				{...rest}
			/>
			<label
				htmlFor={rest.id}
				className={
					"absolute left-6 top-4 text-[#C8C8C8] transition-all duration-100 ease-in-out peer-focus:text-sm peer-focus:text-[#8B5CF6] peer-focus:-translate-y-6 peer-focus:bg-white " +
					(rest.required &&
						"peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]")
				}
			>
				{children}
			</label>
			{rest.required && (
				<label
					htmlFor={rest.id}
					className="absolute hidden left-6 -top-2 bg-white text-sm text-red-500 peer-user-invalid:block "
				>
					{validationText}
				</label>
			)}
		</>
	);
}
