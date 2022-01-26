import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Initialvalues from "./FormModel/Initialvalues";
import validationSchema from "./FormModel/validationSchema";
import Account from "../../components/Modal/Forms/Account";
import Interests from "../../components/Modal/Forms/Interests";
import ModelForm from "../../components/Modal/FormModel/ModelForm";
const { formField, formId } = ModelForm;

function _renderStepContent(step) {
	switch (step) {
		case 0:
			return <Account formField={formField} />;
		case 1:
			return <Interests formField={formField} />;
		default:
			return <div>Not Found</div>;
	}
}
const steps = ["Customize Account", "Select Interests"];
function ModalComponent({ isOpen, onClose }) {
	const [activeStep, setActiveStep] = useState(0);
	const currentValidationSchema = validationSchema[activeStep];
	const isLastStep = activeStep === steps.length - 1;

	function _handleBack() {
		setActiveStep((step) => step - 1);
	}

	function _handleSubmit(values, actions) {
		if (isLastStep) {
			console.log(values);
			onClose();
		} else {
			setActiveStep((step) => step + 1);
			actions.setTouched({});
			actions.setSubmitting(false);
		}
	}

	return (
		<Modal fullscreen='true' fade isOpen={isOpen} backdrop>
			<ModalHeader className='pb-1 pl-4' toggle={onClose}>
				Step - {activeStep + 1} {steps[activeStep]}
			</ModalHeader>
			<div className='d-flex flex-row px-4' style={{ width: "100%" }}>
				{steps.map((step, index) => (
					<div
						key={step + "__" + index}
						style={{
							height: "5px",
							backgroundColor: index <= activeStep ? "#5e72e4" : "lightgray",
							width: "100%",
							marginRight: "5px",
							borderRadius: "10px",
						}}
					/>
				))}
			</div>
			<Formik
				initialValues={Initialvalues}
				validationSchema={currentValidationSchema}
				onSubmit={_handleSubmit}
			>
				{({ isSubmitting }) => (
					<Form id={formId} autoComplete='off'>
						<ModalBody>{_renderStepContent(activeStep)}</ModalBody>
						<ModalFooter>
							{activeStep !== 0 && (
								<Button type='submit' color='primary' onClick={_handleBack}>
									Back
								</Button>
							)}
							<Button disabled={isSubmitting} type='submit' color='primary'>
								{isLastStep ? "Submit" : "Next"}
							</Button>
						</ModalFooter>
					</Form>
				)}
			</Formik>
		</Modal>
	);
}

export default ModalComponent;
