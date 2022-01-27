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
import { BiPin } from "react-icons/bi";
import { RiReplyLine } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";
import { connectTwitterAuth } from "../../_api/channels";

function feed() {
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
				{DUMMY_FEED.map((tweet) => (
					<section
						key={tweet.id}
						className='my-2 rounded border border-light bg-white'
					>
						<div className='d-flex flex-row align-items-center justify-content-between px-2 py-2'>
							<div
								className='d-flex flex-row align-items-center'
								style={{ color: "rgb(54, 65, 65)" }}
							>
								<img
									style={{ width: "100px", height: "100px" }}
									className='mr-2'
									src={
										// "https://media.istockphoto.com/photos/millennial-male-team-leader-organize-virtual-workshop-with-employees-picture-id1300972574?b=1&k=20&m=1300972574&s=170667a&w=0&h=2nBGC7tr0kWIU8zRQ3dMg-C5JLo9H2sNUuDjQ5mlYfo=" ||
										tweet.profile_image_url
									}
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
											{tweet.followers_count}
										</span>
									</div>
									<span style={{ fontSize: "12px" }}>Tweet</span>
								</div>
							</div>
							<div>
								<span style={{ fontSize: "13px" }}>3 hours ago</span>
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

export default feed;

const DUMMY_FEED = [
	{
		created_at: "Thu Jan 27 13:06:38 +0000 2022",
		id: 1486687090272137200,
		id_str: "1486687090272137223",
		text: "Sri Lanka captain Dunith Wellalage wins the toss and opts to chase in their quarterfinal vs Afghanistan #U19CWC",
		truncated: false,
		entities: {
			hashtags: [
				{
					text: "U19CWC",
					indices: [104, 111],
				},
			],
			symbols: [],
			user_mentions: [],
			urls: [],
		},
		source:
			'<a href="https://ads-api.twitter.com" rel="nofollow">Twitter for Advertisers.</a>',
		in_reply_to_status_id: null,
		in_reply_to_status_id_str: null,
		in_reply_to_user_id: null,
		in_reply_to_user_id_str: null,
		in_reply_to_screen_name: null,
		user: {
			id: 16542390,
			id_str: "16542390",
			name: "ESPNcricinfo",
			screen_name: "ESPNcricinfo",
			location: "At the cricket, mainly",
			description:
				"Scores and lot more!\n\nDownload the app: https://t.co/IgqciNxpHM",
			url: "https://t.co/jB5u1yabrI",
			entities: {
				url: {
					urls: [
						{
							url: "https://t.co/jB5u1yabrI",
							expanded_url: "https://www.espncricinfo.com/",
							display_url: "espncricinfo.com",
							indices: [0, 23],
						},
					],
				},
				description: {
					urls: [
						{
							url: "https://t.co/IgqciNxpHM",
							expanded_url: "http://es.pn/ciapps",
							display_url: "es.pn/ciapps",
							indices: [40, 63],
						},
					],
				},
			},
			protected: false,
			followers_count: 6522898,
			friends_count: 209,
			listed_count: 6077,
			created_at: "Wed Oct 01 10:36:44 +0000 2008",
			favourites_count: 429,
			utc_offset: null,
			time_zone: null,
			geo_enabled: false,
			verified: true,
			statuses_count: 186280,
			lang: null,
			contributors_enabled: false,
			is_translator: false,
			is_translation_enabled: false,
			profile_background_color: "E0E0E0",
			profile_background_image_url:
				"http://abs.twimg.com/images/themes/theme2/bg.gif",
			profile_background_image_url_https:
				"https://abs.twimg.com/images/themes/theme2/bg.gif",
			profile_background_tile: false,
			profile_image_url:
				"http://pbs.twimg.com/profile_images/888015358958940165/SmaHw6Rj_normal.jpg",
			profile_image_url_https:
				"https://pbs.twimg.com/profile_images/888015358958940165/SmaHw6Rj_normal.jpg",
			profile_banner_url:
				"https://pbs.twimg.com/profile_banners/16542390/1643282960",
			profile_link_color: "1F98C7",
			profile_sidebar_border_color: "FFFFFF",
			profile_sidebar_fill_color: "DAECF4",
			profile_text_color: "663B12",
			profile_use_background_image: true,
			has_extended_profile: false,
			default_profile: false,
			default_profile_image: false,
			following: true,
			follow_request_sent: false,
			notifications: false,
			translator_type: "none",
			withheld_in_countries: [],
		},
		geo: null,
		coordinates: null,
		place: null,
		contributors: null,
		is_quote_status: false,
		retweet_count: 1,
		favorite_count: 80,
		favorited: false,
		retweeted: false,
		lang: "en",
	},
	{
		created_at: "Thu Jan 27 13:02:00 +0000 2022",
		id: 1486685924574605300,
		id_str: "1486685924574605319",
		text: "Who gets your vote? 🤔🏆",
		truncated: false,
		entities: {
			hashtags: [],
			symbols: [],
			user_mentions: [],
			urls: [],
		},
		source:
			'<a href="https://ads-api.twitter.com" rel="nofollow">Twitter for Advertisers.</a>',
		in_reply_to_status_id: null,
		in_reply_to_status_id_str: null,
		in_reply_to_user_id: null,
		in_reply_to_user_id_str: null,
		in_reply_to_screen_name: null,
		user: {
			id: 713993413,
			id_str: "713993413",
			name: "Sky Sports Premier League",
			screen_name: "SkySportsPL",
			location: "London",
			description:
				"The official account for the Sky Sports Premier League channel",
			url: "https://t.co/G9JHNW7XyV",
			entities: {
				url: {
					urls: [
						{
							url: "https://t.co/G9JHNW7XyV",
							expanded_url: "http://www.skysports.com/premier-league",
							display_url: "skysports.com/premier-league",
							indices: [0, 23],
						},
					],
				},
				description: {
					urls: [],
				},
			},
			protected: false,
			followers_count: 7408990,
			friends_count: 619,
			listed_count: 13233,
			created_at: "Tue Jul 24 09:18:08 +0000 2012",
			favourites_count: 311,
			utc_offset: null,
			time_zone: null,
			geo_enabled: true,
			verified: true,
			statuses_count: 196165,
			lang: null,
			contributors_enabled: false,
			is_translator: false,
			is_translation_enabled: false,
			profile_background_color: "C0DEED",
			profile_background_image_url:
				"http://abs.twimg.com/images/themes/theme1/bg.png",
			profile_background_image_url_https:
				"https://abs.twimg.com/images/themes/theme1/bg.png",
			profile_background_tile: false,
			profile_image_url:
				"http://pbs.twimg.com/profile_images/1483397085340868608/Aor57UcR_normal.jpg",
			profile_image_url_https:
				"https://pbs.twimg.com/profile_images/1483397085340868608/Aor57UcR_normal.jpg",
			profile_banner_url:
				"https://pbs.twimg.com/profile_banners/713993413/1629734676",
			profile_link_color: "0084B4",
			profile_sidebar_border_color: "FFFFFF",
			profile_sidebar_fill_color: "DDEEF6",
			profile_text_color: "333333",
			profile_use_background_image: true,
			has_extended_profile: false,
			default_profile: false,
			default_profile_image: false,
			following: true,
			follow_request_sent: false,
			notifications: false,
			translator_type: "none",
			withheld_in_countries: [],
		},
		geo: null,
		coordinates: null,
		place: null,
		contributors: null,
		is_quote_status: false,
		retweet_count: 30,
		favorite_count: 546,
		favorited: false,
		retweeted: false,
		lang: "en",
	},
];
