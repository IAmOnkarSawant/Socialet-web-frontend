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
import {connectTwitterAuth} from "../../_api/channels";

function Channels() {
	const router = useRouter();
    const { query } = useRouter();
    
    const connectTwitter = () =>{
        connectTwitterAuth().then(({data})=>{
            // console.log(data);
            window.location.replace(data.oauth_url)
        })
    }

    const fetchTokens = () =>{
        console.log(query);
    }

    useEffect(()=>{
        if(query){
            fetchTokens();
        }
    },[query])

	return (
		<React.Fragment>
			<Navbar color='white' light expand='md'>
				<NavbarBrand className='pl-4 font-weight-bold'>Channels</NavbarBrand>
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
					<h1>Channels</h1>
				</Row>
                <Row>
                    <div>
                    <Button
                        color='primary'
                        outline
                        style={{ marginLeft: "auto", marginRight: 15 }}
                        className='px-4'
                        size='sm'
                        onClick={connectTwitter}
                    >
                        Connect With Twitter
                    </Button>
                    </div>
                </Row>
			</Container>
		</React.Fragment>
	);
}

Channels.requireAuth = true;

export default Channels;