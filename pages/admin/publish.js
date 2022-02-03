import React, { useState } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	FormFeedback,
	FormGroup,
	Input,
	Label,
	Navbar,
	NavbarBrand,
	Row,
	Tooltip,
	Badge,
	Spinner,
} from "reactstrap";
import { BsTwitter } from "react-icons/bs";
import { AiFillInfoCircle, AiFillPlusCircle } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { IoMdRemoveCircle } from "react-icons/io";
import EmptyPost from "../../components/Post/EmptyPost";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { recommendHashtags,postTweet } from "../../_api/publish";
import TwitterPreview from "../../components/Post/TwitterPreview";
import ButtonLoader from "../../components/Loaders/ButtonLoader";

const DUMMY_DASHTAGS = ["#coolday", "#beach"];

const validationSchema = Yup.object({
	text: Yup.string()
		.required("Caption is required field")
		.test(
			"len",
			"you are exceeding the characters limit!",
			(val) => val && val.toString().length <= 280
		),
});

function Publish() {
	const router = useRouter();
	const { data: session } = useSession();

	const formik = useFormik({
		initialValues: {
			text: "",
			hashtags: [],
			images: [],
			isHashtagGenerating: false,
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			let formData = new FormData();
			values.images.map(({ file }) => formData.append("files", file));
			
			formData.append("user_id",session.token.sub);
			
			const tweet = values.text+"\n"+values.hashtags.join(' ');
			formData.append("text",tweet);
			postTweet(formData).then(({data})=>{
				// show success/error message in popup later
				console.log(data)
				
			})
		},
	});

	const MAX_CAPTION_LENGTH = 280;

	const [tooltipOpen, setTooltipOpen] = useState(false);
	const toggleToolTip = () => setTooltipOpen(!tooltipOpen);

	const [tagValue, setTagValue] = useState("");

	const handleKeyDown = (e) => {
		if (!["Enter", "Tab"].includes(e.key)) return;
		if (["Enter", "Tab"].includes(e.key)) {
			e.preventDefault();
			const hashtag = "#" + tagValue.trim();
			if (formik.values.hashtags.includes(hashtag)) {
				console.log("hashtags", "Tag already added");
				formik.setFieldError("hashtags", "Tag already added");
				return;
			}
			if (!formik.values.hashtags.includes(hashtag)) {
				formik.setFieldValue(
					"hashtags",
					[...formik.values.hashtags, hashtag],
					true
				);
				setTagValue("");
			}
		}
	};

	const handleDelete = (item) => {
		formik.setFieldValue(
			"hashtags",
			formik.values.hashtags.filter((tag) => tag !== item)
		);
	};

	const handleTagChange = (e) => {
		formik.setFieldTouched("hashtags");
		setTagValue(e.target.value);
	};

	const { getRootProps, getInputProps } = useDropzone({
		accept: "image/jpeg, image/png, image/jpg",
		onDrop: (files) => {
			formik.setFieldValue("images", [
				...formik.values.images,
				...files.map((file, index) => ({
					id: file.size + Math.random() + index,
					file,
					preview: URL.createObjectURL(file),
				})),
			]);
		},
	});

	const handleImageDelete = (imageId) => {
		formik.setFieldValue(
			"images",
			formik.values.images.filter(({ id }) => id != imageId)
		);
	};
	const fetchHashtags = () => {
		let formData = new FormData();
		formik.values.images.map(({ file }) => formData.append("files", file));
		formik.setFieldValue("isHashtagGenerating", true);
		recommendHashtags(formData)
			.then(({ data }) => {
				if (data) {
					const hashtags = [...formik.values.hashtags, ...data.hashtags];
					formik.setFieldValue("hashtags", [...new Set(hashtags)]);
					formik.setFieldValue("isHashtagGenerating", false);
				}
			})
			.catch(() => {
				formik.setFieldValue("hashtags", [...DUMMY_DASHTAGS]);
			});
	};

	return (
		<React.Fragment>
			<Navbar color='white' light expand='md'>
				<NavbarBrand className='pl-4 font-weight-bold'>New Post</NavbarBrand>
				<Button
					color='primary'
					outline
					style={{ marginLeft: "auto", marginRight: 15 }}
					className='px-4'
					size='sm'
					onClick={() => router.back()}
				>
					Back
				</Button>
			</Navbar>
			<Container fluid>
				<Row>
					<Col
						className='py-3 pl-4 bg-secondary position-relative'
						style={{
							height: "calc(100vh - 64px)",
							overflowY: "scroll",
						}}
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
								<div className='position-relative'>
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
									<span
										style={{
											position: "absolute",
											right: 15,
											bottom: 10,
											color:
												MAX_CAPTION_LENGTH - formik.values.text.length >= 0
													? "gray"
													: "red",
											fontSize: 12,
										}}
									>
										{MAX_CAPTION_LENGTH - formik.values.text.length}/
										{MAX_CAPTION_LENGTH}
									</span>
								</div>
								<span style={{ fontSize: 13, color: "red" }}>
									{formik.touched.text && formik.errors.text}
								</span>
							</FormGroup>

							<FormGroup>
								<Label>Upload Images</Label>
								<div className='border bg-white'>
									<div className='d-flex flex-row flex-wrap px-2 pt-2'>
										{formik.values.images.map(
											({ preview, id: imageId }, index) => (
												<div
													key={imageId}
													style={{
														width: "calc(20% - 8px)",
														height: "100px",
														position: "relative",
													}}
													className='mr-2 pb-2'
												>
													<img
														className='rounded-sm'
														style={{
															width: "100%",
															height: "100%",
															filter: "brightness(.7)",
														}}
														src={preview}
													/>

													<IoMdRemoveCircle
														onClick={() => handleImageDelete(imageId)}
														style={{
															position: "absolute",
															right: "5px",
															top: "5px",
															color: "rgba(222, 225, 225,0.9)",
															cursor: "pointer",
															fontSize: 20,
														}}
													/>
												</div>
											)
										)}
										<div
											className='mr-2 mb-2 rounded-sm border border-light'
											style={{
												width: "calc(20% - 8px)",
												height:
													formik.values.images.length === 0 ||
													formik.values.images.length % 5 === 0
														? "85px"
														: "auto",
												position: "relative",
												backgroundColor: "rgb(222, 225, 225)",
												cursor: "pointer",
											}}
											{...getRootProps()}
										>
											<input {...getInputProps()} />
											<AiFillPlusCircle
												size={25}
												style={{
													position: "absolute",
													left: "50%",
													top: "50%",
													transform: "translate(-50%, -50%)",
												}}
											/>
										</div>
									</div>
									<hr className='my-1 mx-2' />
									<div className="p-2">
										<ButtonLoader
											className='px-4'
											onClick={fetchHashtags}
											disabled={
												formik.values.images.length === 0 ||
												formik.values.isHashtagGenerating
											}
											type='button'
											color='primary'
											size='sm'
											loading={formik.values.isHashtagGenerating}
										>
											{formik.values.isHashtagGenerating
												? "Generating hashtags..."
												: "Generate Hashtags"}
										</ButtonLoader>
									</div>
								</div>
							</FormGroup>

							<FormGroup style={{ marginBottom: "70px" }}>
								<Label>
									Hashtags
									<AiFillInfoCircle
										data-tip='Press Enter key or Tab key to add the hashtag'
										size={15}
										className='ml-1'
										id='infoToolTip'
									/>
									<Tooltip
										flip
										placement='top'
										isOpen={tooltipOpen}
										target='infoToolTip'
										toggle={toggleToolTip}
									>
										Press Enter or Tab key to add the hashtag
									</Tooltip>
								</Label>
								<div className='mb-1'>
									{formik.values.hashtags.map((tag, i) => (
										<Badge
											key={i}
											className='badge-md mb-1 mr-1 px-3 text-lowercase'
											color='primary'
											pill
										>
											{tag}
											<IoCloseOutline
												onClick={() => handleDelete(tag)}
												size={15}
												style={{ cursor: "pointer" }}
											/>
										</Badge>
									))}
								</div>
								<Input
									onKeyDown={handleKeyDown}
									value={tagValue}
									name='hashtags'
									invalid={
										formik.touched.hashtags && Boolean(formik.errors.hashtags)
									}
									onChange={handleTagChange}
									placeholder='Enter Hashtag Here'
								></Input>
								<FormFeedback>
									{formik.touched.hashtags && formik.errors.hashtags}
								</FormFeedback>
							</FormGroup>

							<div
								style={{
									display: "flex",
									bottom: 0,
									width: "100%",
									padding: "15px",
									marginRight: 15,
								}}
								className='position-fixed bg-white border-top'
							>
								<div style={{ flex: 0.445 }} />
								<Button
									type='submit'
									style={{
										zIndex: 1000,
										marginRight: 60,
									}}
									color='primary'
								>
									Share Post
								</Button>
							</div>
						</form>
					</Col>
					<Col
						className='py-3 pr-4'
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
							(formik.values.hashtags && formik.values.hashtags.length > 0) ||
							(formik.values.images && formik.values.images.length > 0) ? (
								<TwitterPreview
									hashtags={formik.values.hashtags}
									text={formik.values.text}
									images={formik.values.images}
								/>
							) : (
								<EmptyPost />
							)}
						</div>
					</Col>
				</Row>
			</Container>
		</React.Fragment>
	);
}

Publish.requireAuth = true;

export default Publish;
