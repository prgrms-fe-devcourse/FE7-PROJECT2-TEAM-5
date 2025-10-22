type ButtonProps = React.ComponentPropsWithoutRef<"button">;
export default function Button(props: ButtonProps) {
	const { children, className, ...rest } = props;
	return (
		<>
			<button className={`cursor-pointer ${className}`} {...rest}>
				{children}
			</button>
		</>
	);
}
