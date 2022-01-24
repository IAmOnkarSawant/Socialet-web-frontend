import { useField } from "formik";
import React from "react";
import { Card, FormGroup, Input, Label } from "reactstrap";

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
			<Label className='mb-0 font-weight-bold' style={{ fontSize: "13px" }}>
				{props.label}
			</Label>
			<Card className='mt-1'>
				{props.options.map((option,index) => (
					<div style={{ paddingLeft: 32 }} className='border-bottom py-2'>
						<Input
							className='mt-2'
							type='checkbox'
							name={option}
							checked={meta.value.includes(option)}
							onChange={handleChange}
							id={option+"_"+index}
						/>
						<Label style={{ fontSize: "13px" }} className='mb-0 mt-1' for={option+"_"+index}>
							{option}
						</Label>
					</div>
				))}
			</Card>
		</FormGroup>
	);
}

export default CheckBoxField;
