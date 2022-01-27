import React, { useState,useEffect } from "react";
import { Card, Container, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { ImForward } from "react-icons/im";
import { useRouter } from "next/router";
import { sendOAuthTokens } from "../../_api/channels";

function Redirect() {
	const { query } = useRouter();
	const router = useRouter();

	const [profileData,setProfileData] = useState({
		user_id: "",
		name: "",
		description: "",
		screen_name: "",
		profile_image_url:"",
	})

	const fetchOAuthTokens = () => {
		const { oauth_token, oauth_verifier } = query;
		sendOAuthTokens({ oauth_token, oauth_verifier }).then(({ data }) => {
			setProfileData(data)
			router.push("/admin/dashboard");
		});
	};

	useEffect(() => {
		if (query) {
			fetchOAuthTokens();
		}
	}, [query]);

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
					<CardBody>
						<div className='d-flex flex-column justify-content-center align-items-center pb-3'>
							<img
								className='rounded-circle mr-3'
								width='110px'
								height='110px'
								src={profileData["profile_image_url"]}
							/>
							<h3 className='pt-3'>Welcome {profileData["name"]} </h3>
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
							You're being redirected to another page, <br /> it may take a few seconds.
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
