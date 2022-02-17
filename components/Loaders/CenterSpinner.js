import React from "react";
import { Spinner } from "reactstrap";

const classNames = (first, second) => first + " " + second;

function CenterSpinner({ className, style, ...props }) {
	return (
		<div
			style={style}
			className={`${classNames(
				className,
				"d-flex flex-row justify-content-center align-items-center"
			)}`}
		>
			<Spinner {...props}>Loading...</Spinner>
		</div>
	);
}

export default CenterSpinner;
