import { useRouter } from "next/router";
import React from "react";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardSubtitle,
	CardText,
	CardTitle,
	Col,
	Container,
	FormFeedback,
	FormGroup,
	Input,
	Navbar,
	NavbarBrand,
	Row,
} from "reactstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import { getSearchResults } from "../../_api/channels";
import TwitterCard from "../../components/Post/TwitterCard";
import ButtonLoader from "../../components/Loaders/ButtonLoader";

const validationSchema = yup.object({
	searchTerm: yup
		.string()
		.test(
			"len",
			"Your search term must consist of 3 or more characters.",
			(val) => val && val.length >= 3
		),
});

function search() {
	const router = useRouter();
	const { data: session } = useSession();

	const formik = useFormik({
		initialValues: {
			searchTerm: "",
			tweets: [],
			isSearching: false,
		},
		validationSchema: validationSchema,
		onSubmit: ({ searchTerm }) => {
			formik.setFieldValue("isSearching", true);
			let newSearchTerm;
			if (searchTerm.charCodeAt(0) === 35) {
				newSearchTerm = searchTerm.replace("#", "hashtag");
			} else {
				newSearchTerm = searchTerm;
			}
			console.log(newSearchTerm);
			getSearchResults(session.token.sub, newSearchTerm).then(
				({ data: { tweets } }) => {
					console.log(tweets);
					formik.setFieldValue("isSearching", false);
					formik.setFieldValue("tweets", [...tweets]);
					formik.setSubmitting(false);
				}
			);
		},
	});

	return (
		<React.Fragment>
			<Navbar color='white' light expand='md'>
				<NavbarBrand className='font-weight-bold'>
					{formik.values.searchTerm && formik.values.tweets.length > 0
						? formik.values.searchTerm
						: "Twitter Search"}
				</NavbarBrand>
				<div style={{ marginLeft: "auto" }}>
					{formik.values.tweets.length > 0 && (
						<Button
							color='primary'
							className='mb-3'
							outline
							style={{ marginLeft: "auto", marginRight: 15 }}
							className='px-4'
							size='sm'
							onClick={() => formik.setFieldValue("tweets", [])}
						>
							Search Keyword
						</Button>
					)}
					<Button
						color='primary'
						className='mb-3'
						outline
						style={{ marginLeft: "auto", marginRight: 15 }}
						className='px-4'
						size='sm'
						onClick={() => router.back()}
					>
						Back
					</Button>
				</div>
			</Navbar>
			<Container fluid="sm" className='mt-4'>
				<Row>
					{formik.values.tweets.length !== 0 ? (
						<Col md='12'>
							{formik.values.tweets.map((tweet) => (
								<TwitterCard key={tweet.id} tweet={tweet} search={true} />
							))}
						</Col>
					) : (
						<Col md='12'>
							<Card className='shadow-lg'>
								<CardHeader>
									<span className='text-dark font-weight-bold'>Create New</span>
									<div style={{ fontSize: 13 }} className='pt-2'>
										Find conversations to join and people to engage with by
										searching for keywords related to your business or industry.
									</div>
								</CardHeader>
								<CardBody>
									<CardTitle className='mb-1' tag='h5'>
										New Search
									</CardTitle>
									<div style={{ fontSize: 13 }}>
										Utilize keywords or phrases that your customers would be
										talking about.
									</div>
									<form onSubmit={formik.handleSubmit}>
										<Row className='mt-3'>
											<Col md={9}>
												<FormGroup>
													<Input
														name='searchTerm'
														placeholder='Enter word or phrase...'
														bsSize='md'
														color='primary'
														value={formik.values.searchTerm}
														onChange={formik.handleChange}
														invalid={
															formik.touched.searchTerm &&
															Boolean(formik.errors.searchTerm)
														}
													/>
													<FormFeedback>
														{formik.touched.searchTerm &&
															formik.errors.searchTerm}
													</FormFeedback>
												</FormGroup>
											</Col>
											<Col md={3}>
												<ButtonLoader
													disabled={formik.isSubmitting || formik.isValidating}
													type='submit'
													loading={formik.values.isSearching}
												>
													{formik.values.isSearching
														? "Searching..."
														: "Search"}
												</ButtonLoader>
											</Col>
										</Row>
									</form>
								</CardBody>
							</Card>
						</Col>
					)}
				</Row>
			</Container>
		</React.Fragment>
	);
}

export default search;
