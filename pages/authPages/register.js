import React, { useEffect, useState } from "react";
import Link from "next/link";
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Row,
	Col,
	FormFeedback,
	Alert,
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
	name: yup
		.string("Enter your name")
		.min(3, "Name should be of minimum 3 characters length")
		.required("Email is required"),
	email: yup
		.string("Enter your email")
		.email("Enter a valid email")
		.required("Email is required"),
	password: yup
		.string("Enter your password")
		.min(8, "Password should be of minimum 8 characters length")
		.required("Password is required"),
});

function Register() {
	const router = useRouter();
	const [passStrength, setPassStrength] = useState("");
	const handlePasswordStrengthChecker = ({ target: { value } }) =>
		setPassStrength(checkPassStrength(value));
	const [errorObj, setErrorObj] = useState({});
	useEffect(() => setErrorObj({}), []);

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			password: "",
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			const result = await signIn("register_provider", {
				redirect: false,
				name: values.name,
				email: values.email,
				password: values.password,
			});
			console.log(result);
			if (!result.error) router.replace("/admin/dashboard");
			else setErrorObj(result);
		},
	});

	return (
		<>
			<Col lg='5' md='7'>
				<Card className='mt-5 mt-lg-1 bg-secondary shadow border-0'>
					<CardBody className='px-lg-5 py-lg-5'>
						<div className='mb-5'>
							<h2 className='display-4 font-weight-bold text-center'>
								SIGN UP
							</h2>
						</div>
						<form onSubmit={formik.handleSubmit}>
							<Alert
								isOpen={errorObj?.error ? true : false}
								fade
								color='warning'
							>
								{errorObj?.error}
							</Alert>
							<FormGroup>
								<Input
									name='name'
									placeholder='foo bar'
									value={formik.values.name}
									onChange={formik.handleChange}
									invalid={formik.touched.name && Boolean(formik.errors.name)}
								/>
								<FormFeedback>
									{formik.touched.name && formik.errors.name}
								</FormFeedback>
							</FormGroup>
							<FormGroup>
								<Input
									name='email'
									placeholder='foobar@example.com'
									value={formik.values.email}
									onChange={formik.handleChange}
									invalid={formik.touched.email && Boolean(formik.errors.email)}
								/>
								<FormFeedback>
									{formik.touched.email && formik.errors.email}
								</FormFeedback>
							</FormGroup>
							<FormGroup>
								<Input
									name='password'
									placeholder='foobar'
									value={formik.values.password}
									onChange={formik.handleChange}
									invalid={
										formik.touched.password && Boolean(formik.errors.password)
									}
								/>
								<FormFeedback>
									{formik.touched.password && formik.errors.password}
								</FormFeedback>
							</FormGroup>
							<div
								className={`${
									!passStrength && "d-none"
								} text-muted font-italic`}
							>
								<small>
									password strength:{" "}
									<span
										className={`${colorPicker(passStrength)} font-weight-700`}
									>
										{passStrength}
									</span>
								</small>
							</div>
							<div className='text-center'>
								<Button
									disabled={formik.isSubmitting || formik.isValidating}
									className='mt-4'
									color='primary'
									type='submit'
								>
									Create account
								</Button>
							</div>
						</form>
					</CardBody>
				</Card>
				<Row className='mt-3'>
					<Col className='text-left' xs='6'>
						<Link href='/authPages/login'>
							<small style={{ cursor: "pointer" }} className='text-gray'>
								Already have an account?
							</small>
						</Link>
					</Col>
				</Row>
			</Col>
		</>
	);
}

Register.layout = Auth;
Register.auth = true;

export default Register;

function colorPicker(strength) {
	if (strength === "strong") return "text-success";
	if (strength === "weak") return "text-warning";
	if (strength === "good") return "text-primary";

	return "";
}

function scorePassword(pass) {
	var score = 0;
	if (!pass) return score;

	var letters = new Object();
	for (var i = 0; i < pass.length; i++) {
		letters[pass[i]] = (letters[pass[i]] || 0) + 1;
		score += 5.0 / letters[pass[i]];
	}

	var variations = {
		digits: /\d/.test(pass),
		lower: /[a-z]/.test(pass),
		upper: /[A-Z]/.test(pass),
		nonWords: /\W/.test(pass),
	};

	var variationCount = 0;
	for (var check in variations) {
		variationCount += variations[check] == true ? 1 : 0;
	}
	score += (variationCount - 1) * 10;

	return parseInt(score);
}

function checkPassStrength(pass) {
	var score = scorePassword(pass);
	if (score > 80) return "strong";
	if (score > 60) return "good";
	if (score >= 30) return "weak";

	return "";
}
