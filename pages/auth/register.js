import React, { useState } from "react";

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
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";

function Register() {
	const [passStrength, setPassStrength] = useState("");
	const handlePasswordStrengthChecker = ({ target: { value } }) =>
		setPassStrength(checkPassStrength(value));

	return (
		<>
			<Col lg="5" md="7">
				<Card className="mt-5 mt-lg-1 bg-secondary shadow border-0">
					<CardHeader className="bg-transparent pb-5">
						<div className="text-muted text-center mt-2 mb-4">
							<small>Sign up with</small>
						</div>
						<div className="text-center">
							<Button
								className="btn-neutral btn-icon mr-4"
								color="default"
								href="#pablo"
								onClick={(e) => e.preventDefault()}
							>
								<span className="btn-inner--icon">
									<img
										alt="..."
										src={require("assets/img/icons/common/github.svg")}
									/>
								</span>
								<span className="btn-inner--text">Github</span>
							</Button>
							<Button
								className="btn-neutral btn-icon"
								color="default"
								href="#pablo"
								onClick={(e) => e.preventDefault()}
							>
								<span className="btn-inner--icon">
									<img
										alt="..."
										src={require("assets/img/icons/common/google.svg")}
									/>
								</span>
								<span className="btn-inner--text">Google</span>
							</Button>
						</div>
					</CardHeader>
					<CardBody className="px-lg-5 py-lg-5">
						<div className="text-center text-muted mb-4">
							<small>Or sign up with credentials</small>
						</div>
						<Form role="form">
							<FormGroup>
								<InputGroup className="input-group-alternative mb-3">
									<InputGroupAddon addonType="prepend">
										<InputGroupText>
											<i className="ni ni-hat-3" />
										</InputGroupText>
									</InputGroupAddon>
									<Input placeholder="Name" type="text" />
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<InputGroup className="input-group-alternative mb-3">
									<InputGroupAddon addonType="prepend">
										<InputGroupText>
											<i className="ni ni-email-83" />
										</InputGroupText>
									</InputGroupAddon>
									<Input
										placeholder="Email"
										type="email"
										autoComplete="new-email"
									/>
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<InputGroup className="input-group-alternative">
									<InputGroupAddon addonType="prepend">
										<InputGroupText>
											<i className="ni ni-lock-circle-open" />
										</InputGroupText>
									</InputGroupAddon>
									<Input
										placeholder="Password"
										type="password"
										autoComplete="new-password"
										onChange={handlePasswordStrengthChecker}
									/>
								</InputGroup>
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
							<Row className="my-4">
								<Col xs="12">
									<div className="custom-control custom-control-alternative custom-checkbox">
										<input
											className="custom-control-input"
											id="customCheckRegister"
											type="checkbox"
										/>
										<label
											className="custom-control-label"
											htmlFor="customCheckRegister"
										>
											<span className="text-muted">
												I agree with the{" "}
												<a href="#pablo" onClick={(e) => e.preventDefault()}>
													Privacy Policy
												</a>
											</span>
										</label>
									</div>
								</Col>
							</Row>
							<div className="text-center">
								<Button className="mt-4" color="primary" type="button">
									Create account
								</Button>
							</div>
						</Form>
					</CardBody>
				</Card>
			</Col>
		</>
	);
}

Register.layout = Auth;

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
