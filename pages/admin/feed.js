import React, { useState, useEffect } from "react";
import { Button, Container, Navbar, NavbarBrand } from "reactstrap";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { getTwitterFeed } from "../../_api/channels";
import TwitterCard from "../../components/Post/TwitterCard";

function Feed() {
	const router = useRouter();
	const {data:session} = useSession();
	
	const [feed,setFeed] = useState([]);
	const fetchTwitterFeed = () =>{
		getTwitterFeed(session.token.sub).then(({data})=>{
			console.log(data);
			setFeed([...data.feed]);
		});
	};

	useEffect(() => {
		if (feed.length === 0) {
			fetchTwitterFeed();
		}
	}, []);

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
				{feed.length !== 0 &&
					feed.map((tweet) => <TwitterCard key={tweet.id} tweet={tweet} feed={true} />)}
			</Container>
		</React.Fragment>
	);
}

Feed.requireAuth = true;

export default Feed;
