import React from "react";
import {
	Button,
	Card,
	Col,
	Container,
	FormFeedback,
	FormGroup,
	Input,
	InputGroup,
	Label,
	Navbar,
	NavbarBrand,
	Row,
	Tooltip,
} from "reactstrap";
import { BsTwitter } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
import EmptyPost from "../../components/Post/EmptyPost";
import TwitterCard from "../../components/Post/TwitterCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import Chips from "react-chips";
import ReactTooltip from "react-tooltip";

const validationSchema = Yup.object({
	text: Yup.string().test(
		"len",
		"tweet length should be leass than or equal to 280 chracters",
		(val) => val && val.toString().length <= 280
	),
});

function Publish() {
	const formik = useFormik({
		initialValues: {
			text: "",
			hashtags: [],
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			// will do later as our application grows
			console.log(JSON.stringify(values, null, 2));
		},
	});
	const handleChipsChange = (hashes) =>
		formik.setFieldValue("hashtags", hashes);

	return (
		<React.Fragment>
			<Navbar color='white' light expand='md'>
				<NavbarBrand className='pl-4 font-weight-bold'>New Post</NavbarBrand>
			</Navbar>
			<Container fluid>
				<Row>
					<Col
						className='py-5 pl-4 bg-secondary position-relative'
						style={{ height: "calc(100vh - 64px)", overflowY: "scroll" }}
					>
						<Card className='mb-4 py-2 px-3 d-flex flex-row align-items-center border-light'>
							<span
								style={{ width: "25px", height: "25px" }}
								className='rounded-circle bg-default text-center text-white font-weight-normal'
							>
								G
							</span>
							<BsTwitter
								style={{ color: "rgb(29, 161, 242)" }}
								className='ml-2'
							/>
							<p className='pl-2 mb-0 font-weight-bold text-dark'>G11 SMWT</p>
							<p
								style={{ fontSize: "13px" }}
								className='pl-2 mb-0 font-weight-normal'
							>
								@SmwtG11
							</p>
						</Card>
						<form onSubmit={formik.handleSubmit}>
							<FormGroup>
								<Input
									aria-label='With textarea'
									rows={6}
									color='secondary'
									type='textarea'
									name='text'
									invalid={formik.touched.text && Boolean(formik.errors.text)}
									value={formik.values.text}
									onChange={formik.handleChange}
								></Input>
								<FormFeedback>
									{formik.touched.text && formik.errors.text}
								</FormFeedback>
							</FormGroup>
							<FormGroup>
								<Label>
									Hashtags{" "}
									<AiFillInfoCircle
										data-tip='Press Enter key or <br /> Tab key to add the hashtag'
										size={15}
										className='ml-2'
									/>
								</Label>
								<Chips
									value={formik.values.hashtags}
									onChange={handleChipsChange}
									placeholder='Enter your hashtags here...'
									suggestions={["travel", "picoftheday", "beach"]}
									uniqueChips={true}
									fromSuggestionsOnly={false}
									createChipKeys={[13, 32]}
								/>
							</FormGroup>
							<div
								style={{
									display: "flex",
									bottom: 0,
									left: 0,
									right: 0,
									padding: "15px",
								}}
								className='position-fixed bg-white border-top'
							>
								<div style={{ flex: 0.445 }} />
								<Button
									type='submit'
									style={{
										borderRadius: "0",
										zIndex: 1000,
									}}
									color='primary'
								>
									Share Post
								</Button>
							</div>
						</form>
					</Col>
					<Col
						className='py-5 pr-4'
						style={{ height: "calc(100vh - 64px)", backgroundColor: "#f3f4f4" }}
					>
						<p className='font-weight-bold text-dark'>Network Preview</p>
						<div className='d-flex flex-row justify-content-start'>
							<AiFillInfoCircle size={25} className='mr-2' />
							<p
								className='font-weight-bold'
								style={{ fontSize: "13px", color: "black" }}
							>
								Preview approximates how your content will display when
								published. Tests and updates by social networks may affect the
								final appearance.
							</p>
						</div>
						<div
							style={{
								marginLeft: "4%",
							}}
						>
							{formik.values.text ||
							(formik.values.hashtags && formik.values.hashtags.length > 0) ? (
								<TwitterCard
									chips={formik.values.hashtags}
									text={formik.values.text}
								/>
							) : (
								<EmptyPost />
							)}
						</div>
					</Col>
				</Row>
			</Container>
			<ReactTooltip
				place='top'
				border={true}
				backgroundColor='lightgray'
				textColor='black'
				type='info'
				effect='solid'
				multiline
			/>
		</React.Fragment>
	);
}

Publish.requireAuth = true;

export default Publish;
