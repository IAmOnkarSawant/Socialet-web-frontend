import React, { useEffect } from "react";
import { Card, Container, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { ImForward } from "react-icons/im";
import { useRouter } from "next/router";
import { sendOAuthTokens } from "../../_api/channels";

const DUMMY_RESPONSE = {
	user_id: "1",
	name: "Pranav Mene",
	description: "blah_blah",
	screen_name: "blah_blah",
	profile_image_url:
		"https://vengreso.com/wp-content/uploads/2016/03/LinkedIn-Profile-Professional-Picture-Sample-Bernie-Borges.png",
};

function Redirect() {
	const { query } = useRouter();

	const fetchOAuthTokens = () => {
		const { oauth_token, oauth_verifier } = query;
		sendOAuthTokens({ oauth_token, oauth_verifier }).then(({ data }) => {
			console.log(data);
		});
	};

	// useEffect(() => {
	// 	if (query) {
	// 		fetchOAuthTokens();
	// 	}
	// }, [query]);

	return (
		<React.Fragment>
			<Container
				style={{ height: "calc(100vh)" }}
				className='d-flex align-items-center justify-content-center text-center'
				fluid
			>
				<Card
					style={{ width: "600px" }}
					className='py-3 shadow-lg position-relative'
				>
					{/* <div className='d-flex flex-column align-items-center justify-items-center'>
						<span
							style={{
								color: "white",
								height: "90px",
								marginTop: "0.25rem",
								minWidth: "90px",
								borderRadius: "50%",
							}}
							className='d-flex flex-row align-items-center justify-content-center bg-primary mt-3'
						>
							<ImForward
								className='redirect-animation'
								style={{
									width: "33px",
									height: "33px",
									display: "inline-block",
								}}
							/>
						</span>
					</div> */}
					<CardBody>
						<div className='d-flex flex-column justify-content-center align-items-center pb-3'>
							<img
								className='rounded-circle mr-3'
								width='110px'
								height='110px'
								src={DUMMY_RESPONSE["profile_image_url"]}
							/>
							<h3 className='pt-3'>Welcome {DUMMY_RESPONSE["name"]} </h3>
						</div>
						<CardTitle tag='h2'>
							Hang Tight !{" "}
							<ImForward
								className='redirect-animation d-inline-block ml-2 text-danger'
								style={{
									width: "20px",
									height: "20px",
									display: "inline-block",
								}}
							/>
						</CardTitle>
						<CardSubtitle tag='h4' className='pb-5'>
							You're being redirected to another page, <br /> it may takes upto
							10 seconds
						</CardSubtitle>
					</CardBody>
					<div
						className='bg-primary position-absolute rounded-bottom'
						style={{ bottom: 0, left: 0, right: 0, height: 40 }}
					/>
				</Card>
			</Container>
		</React.Fragment>
	);
}

Redirect.requireAuth = true;

export default Redirect;
