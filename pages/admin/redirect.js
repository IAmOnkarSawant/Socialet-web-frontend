import React, { useState,useEffect } from "react";
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
import { AiFillInfoCircle, AiFillPlusCircle } from "react-icons/ai";
import { useRouter } from "next/router";
import {sendOAuthTokens} from "../../_api/channels";

function Redirect() {
	const router = useRouter();
    const { query } = useRouter();

    const fetchOAuthTokens = () =>{
        const {oauth_token,oauth_verifier} = query;
        sendOAuthTokens({oauth_token,oauth_verifier}).then(({data})=>{
            console.log(data);
        })
    }

    useEffect(()=>{
        if(query){
            fetchOAuthTokens();
        }
    },[query])

	return (
		<React.Fragment>
			<Navbar color='white' light expand='md'>
				<NavbarBrand className='pl-4 font-weight-bold'>Redirect</NavbarBrand>
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
					<h1>Redirect</h1>
				</Row>
			</Container>
		</React.Fragment>
	);
}

Redirect.requireAuth = true;

export default Redirect;