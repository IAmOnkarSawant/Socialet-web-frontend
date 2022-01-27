import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import { BsTwitter } from "react-icons/bs";
import { useRouter } from "next/router";
import { connectTwitterAuth } from "../../_api/channels";

function Channels() {
	const router = useRouter();
	const { query } = useRouter();

	const connectTwitter = () => {
		connectTwitterAuth().then(({ data }) => {
			// console.log(data);
			window.location.replace(data.oauth_url);
		});
	};

	const fetchTokens = () => {
		console.log(query);
	};

	useEffect(() => {
		if (query) {
			fetchTokens();
		}
	}, [query]);

	return (
		<React.Fragment>
			<Navbar color='white' light expand='md'>
				<NavbarBrand className='pl-4 font-weight-bold'>Channels</NavbarBrand>
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
			</Navbar>
			<Container
				style={{ height: "calc(100vh - 65px)" }}
				className='d-flex align-items-center justify-content-center'
				fluid
			>
				<div
					style={{ width: "740px" }}
					className='d-flex flex-wrap flex-row align-items-center justify-content-center'
				>
					<Button
						color='secondary'
						className='mb-3 shadow-lg'
						outline
						size='md'
						style={{ width: "200px" }}
						onClick={connectTwitter}
					>
						<section className='d-flex flex-column align-items-center justify-items-center'>
							<span
								style={{
									color: "white",
									height: "40px",
									marginTop: "0.25rem",
									backgroundColor: "rgb(29, 161, 242)",
									minWidth: "40px",
									borderRadius: "50%",
								}}
								className='d-flex flex-row align-items-center justify-content-center mt-3'
							>
								<BsTwitter
									style={{
										width: "22px",
										height: "22px",
										display: "inline-block",
									}}
								/>
							</span>
							<main
								className='mt-3'
								style={{ textAlign: "center", width: "100%" }}
							>
								<h2
									className='mb-0 font-weight-bold'
									style={{ color: "black" }}
								>
									Twitter
								</h2>
								<p style={{ fontSize: "14px" }} className='text-dark pt-0 mt-0'>
									Profile
								</p>
							</main>
							<p
								style={{
									color: "black",
									fontFamily: "Roboto, sans-serif",
									fontSize: "13px",
								}}
								className='font-weight-bold'
							>
								Connect
							</p>
						</section>
					</Button>
				</div>
			</Container>
		</React.Fragment>
	);
}

Channels.requireAuth = true;

export default Channels;
