import { useField } from "formik";
import React from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

function SelectField(props) {
	const [field, meta] = useField(props);
	console.log({ field, meta });
	return (
		<FormGroup className='mb-3'>
			<Label className='font-weight-bold' style={{ fontSize: "13px" }}>
				{props.label}
			</Label>
			<Input
				className='form-control-alternative'
				invalid={meta.error && meta.touched}
				value={field.value}
				name={field.name}
				type='select'
				onChange={field.onChange}
				onBlur={field.onBlur}
				color='primary'
			>
				<option value=''>None</option>
				{props.options.map((opt, index) => (
					<option key={index} value={opt}>
						{opt}
					</option>
				))}
			</Input>
			<FormFeedback>{meta.touched && meta.error}</FormFeedback>
		</FormGroup>
	);
}

export default SelectField;
