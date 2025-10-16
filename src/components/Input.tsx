type InputProps = React.ComponentPropsWithoutRef<"input"> & {
	validationText: string;
};
export default function Input(props: InputProps) {
	const { children, ...rest } = props;
	return (
		<>
			<input
				className="peer w-full resize-none outline-none align-middle"
				{...rest}
			/>
			<label
				htmlFor={props.id}
				className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-100 ease-in-out 
								peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6] 
								peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]
							    "
			>
				{children}
			</label>
			<label
				htmlFor={props.id}
				className="absolute hidden left-6 -top-2 bg-white text-sm text-red-500 peer-user-invalid:block "
			>
				{props.validationText}
			</label>
		</>
	);
}
