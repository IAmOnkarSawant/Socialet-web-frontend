import React from "react";
import { Button, Spinner } from "reactstrap";

function ButtonLoader({ ...props }) {
	const {
		className,
		onClick,
		disabled,
		outline,
		type,
		color = "primary",
		size = "md",
		loading,
	} = props;

	return (
		<div className='d-flex flex-row align-items-center'>
			<Button
				className={className}
				onClick={onClick}
				disabled={disabled}
				outline={outline}
				type={type}
				color={color}
				size={size}
			>
				{props.children}
			</Button>
			{loading && (
				<Spinner color='primary' size='sm' className='ml-1'>
					Loading...
				</Spinner>
			)}
		</div>
	);
}

export default ButtonLoader;
