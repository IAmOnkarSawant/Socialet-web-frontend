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
import { NEW_USER_REGISTRATION_CODED_STRING } from "../../utils/constants";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name should be of minimum 3 characters length")
    .required("Email is required"),
  email: yup
    .string()
    .email("Enter a valid Email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

function Register() {
  const router = useRouter();
  const [passStrength, setPassStrength] = useState("");
  const handlePasswordStrengthChecker = ({ target: { value } }) =>
    setPassStrength(checkPassStrength(value));
  const [errorObj, setErrorObj] = useState({});
  useEffect(() => {
    return () => setErrorObj({});
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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
      if (!result.error)
        router.push({
          pathname: "/admin/dashboard",
          query: { state: NEW_USER_REGISTRATION_CODED_STRING },
        });
      else setErrorObj(result);
    },
  });

  return (
    <React.Fragment>
      <Col lg="5" md="7">
        <Card className="mt-5 mt-lg-1 bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="mb-5">
              <h2 className="display-4 font-weight-bold text-center">
                SIGN UP
              </h2>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <Alert
                isOpen={errorObj?.error ? true : false}
                fade
                color="warning"
              >
                {errorObj?.error}
              </Alert>

              <FormGroup>
                <Input
                  name="name"
                  placeholder="Company Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  invalid={formik.touched.name && Boolean(formik.errors.name)}
                  className="form-control-alternative"
                />
                <FormFeedback>
                  {formik.touched.name && formik.errors.name}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Input
                  name="email"
                  placeholder="example@gmail.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  invalid={formik.touched.email && Boolean(formik.errors.email)}
                  className="form-control-alternative"
                />
                <FormFeedback>
                  {formik.touched.email && formik.errors.email}
                </FormFeedback>
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  invalid={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  className="form-control-alternative"
                />
                <FormFeedback>
                  {formik.touched.password && formik.errors.password}
                </FormFeedback>
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirm password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  invalid={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  className="form-control-alternative"
                />
                <FormFeedback>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword}
                </FormFeedback>
              </FormGroup>
              <div
                className={`${
                  !passStrength && "d-none"
                } text-muted font-italic`}
              >
                <small>
                  Password Strength:{" "}
                  <span
                    className={`${colorPicker(passStrength)} font-weight-700`}
                  >
                    {passStrength}
                  </span>
                </small>
              </div>
              <div className="text-center">
                <Button
                  disabled={formik.isSubmitting || formik.isValidating}
                  className="mt-4"
                  color="primary"
                  type="submit"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col className="text-left" xs="6">
            <Link href="/authPages/login">
              <small style={{ cursor: "pointer" }} className="text-gray">
                Already have an Account?
              </small>
            </Link>
          </Col>
        </Row>
      </Col>
    </React.Fragment>
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
