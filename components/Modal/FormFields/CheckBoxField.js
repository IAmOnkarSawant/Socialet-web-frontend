import { useField } from "formik";
import React from "react";
import {
	Card,
	FormGroup,
	Input,
	Label,
	ListGroup,
	ListGroupItem,
} from "reactstrap";

function CheckBoxField(props) {
	const [field, meta, helpers] = useField(props);
	console.log({ field, meta, helpers });

	const handleChange = (e) => {
		const { checked, name } = e.target;
		if (checked) {
			helpers.setValue([...meta.value, name]);
		} else {
			helpers.setValue([...meta.value.filter((m) => m !== name)]);
		}
	};

	return (
		<FormGroup>
			<Label className='font-weight-bold' style={{ fontSize: "13px" }}>
				{props.label}
			</Label>
			<ListGroup className='mt-1 shadow'>
				{props.options.map((option, index) => (
					<ListGroupItem
						className='custom-control custom-radio'
						style={{ paddingLeft: "65px" }}
					>
						<Input
							className='custom-control-input mt-2'
							type='checkbox'
							name={option}
							checked={meta.value.includes(option)}
							onChange={handleChange}
							id={option + "_" + index}
						/>
						<Label
							style={{ fontSize: "13px", paddingLeft: -10 }}
							className='custom-control-label pt-1'
							for={option + "_" + index}
						>
							{option}
						</Label>
					</ListGroupItem>
				))}
			</ListGroup>
		</FormGroup>
	);
}

export default CheckBoxField;
