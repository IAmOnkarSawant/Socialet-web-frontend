import React, { useState, useEffect } from "react";
import {
	Button,
	Container,
	Navbar,
	NavbarBrand,
} from "reactstrap";
import { BsTwitter } from "react-icons/bs";
import { BiPin } from "react-icons/bi";
import { RiReplyLine } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";
import { getTwitterFeed } from "../../_api/channels";

function Feed() {
	const router = useRouter();
	
	const [feed,setFeed] = useState([]);
	const fetchTwitterFeed = () =>{
		getTwitterFeed().then(({data})=>{
			console.log(data);
			setFeed([...data.feed])
		})
	}
	
	useEffect(()=>{
		if(feed.length===0){
			fetchTwitterFeed();
		}
	},[])

	return (
		<React.Fragment>
			<Navbar color='white' light expand='md'>
				<NavbarBrand className='pl-4 font-weight-bold'>
					Twitter feed
				</NavbarBrand>
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
			<Container className='py-3' fluid='sm'>
				{feed.length!==0 && feed.map((tweet) => (
					<section key={tweet.id} className='my-4 rounded bg-white shadow-lg'>
						<div className='d-flex flex-row align-items-center justify-content-between px-2 py-2'>
							<div
								className='d-flex flex-row align-items-center'
								style={{ color: "rgb(54, 65, 65)" }}
							>
								<img
									style={{ width: "35px", height: "35px" }}
									className='mr-2 rounded-circle'
									src={tweet.user.profile_image_url}
								/>
								<div className='d-flex flex-column'>
									<div className='d-flex flex-row align-items-center'>
										<BsTwitter
											style={{ fontSize: "14px", color: "rgb(29, 161, 242)" }}
											className='mr-2'
										/>
										<span
											style={{ fontSize: "13px" }}
											className='mr-2 font-weight-bolder'
										>
											{tweet.user.name}
										</span>
										<span style={{ fontSize: "13px" }} className='mr-2'>
											@{tweet.user.screen_name}
										</span>
										<span
											style={{
												fontSize: "12px",
												backgroundColor: "rgb(255, 198, 164)",
											}}
											className='mr-2 px-2 py-0 rounded-pill'
										>
											{tweet.user.followers_count}
										</span>
									</div>
									<span style={{ fontSize: "12px" }}>Tweet</span>
								</div>
							</div>
							<div>
								<span style={{ fontSize: "13px" }}>{new Date(tweet.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
							</div>
						</div>
						<hr className='mt-0 mb-1' />
						<div style={{ paddingLeft: "53px" }} className='pr-1 py-3'>
							<span style={{ fontSize: "15px", color: "#364141" }}>
								{tweet.text}
							</span>
						</div>
						<div className='d-flex flex-row justify-content-end align-items-center p-3'>
							<div>
								<AiOutlineHeart
									style={{
										marginLeft: "auto",
										fontSize: 20,
										cursor: "pointer",
									}}
									className='ml-4'
								/>
								<BiPin
									style={{
										marginLeft: "auto",
										fontSize: 20,
										cursor: "pointer",
									}}
									className='ml-4'
								/>
								<RiReplyLine
									style={{
										marginLeft: "auto",
										fontSize: 20,
										cursor: "pointer",
									}}
									className='ml-4'
								/>
							</div>
						</div>
					</section>
				))}
			</Container>
		</React.Fragment>
	);
}

Feed.requireAuth = true;

export default Feed;