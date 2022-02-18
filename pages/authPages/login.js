import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  Row,
  Col,
  FormFeedback,
  Alert,
} from "reactstrap";
import Auth from "layouts/Auth.js";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

function Login() {
  const router = useRouter();
  const [errorObj, setErrorObj] = useState({});
  useEffect(() => {
    return () => setErrorObj({});
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const result = await signIn("login_provider", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      console.log(values, result);
      if (!result.error) router.push("/admin/dashboard");
      else setErrorObj(result);
    },
  });

  return (
    <Col lg="5" md="7">
      <Card className="mt-5 mt-lg-1 bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="mb-5">
            <h2 className="display-4 font-weight-bold text-center">SIGN IN</h2>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <Alert isOpen={errorObj?.error ? true : false} fade color="warning">
              {errorObj?.error}
            </Alert>
            <FormGroup className="mb-3">
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
            <FormGroup className="mb-3">
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
            <div className="text-center">
              <Button
                disabled={formik.isSubmitting || formik.isValidating}
                className="my-4"
                color="primary"
                type="submit"
              >
                SIGN IN
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <Row className="mt-3">
        <Col className="text-left" xs="6">
          <Link href="/authPages/register">
            <small style={{ cursor: "pointer" }} className="text-gray">
              Create new Account
            </small>
          </Link>
        </Col>
      </Row>
    </Col>
  );
}

Login.layout = Auth;
Login.auth = true;

export default Login;
