import React, { useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { BiPin } from "react-icons/bi";
import { RiReplyLine } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
import moment from "moment";
import millify from "millify";
import ModalImage from "../Modal/ModalImage";

function TwitterSearchCard({ tweet, search, feed, ...props }) {
	const [modalImageURL, setModalImageURL] = useState("");
	const tweet_text =
		tweet?.retweet_count === 0
			? tweet.full_text
			: tweet.retweeted_status
			? tweet.retweeted_status.full_text
			: tweet.full_text;

	return (
		<section className='mb-4 rounded bg-white shadow-lg'>
			<div className='d-flex flex-row align-items-center justify-content-between px-3 py-3'>
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
								className='mr-1'
							/>
							<span
								style={{ fontSize: "13px" }}
								className='mr-1 font-weight-bolder'
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
								className='mr-2 px-3 py-0 rounded-pill'
							>
								{millify(tweet.user.followers_count)}
							</span>
						</div>
						{search && (
							<span style={{ fontSize: "12px" }}>
								{tweet.retweet_count === 0 ? "Tweet" : "Retweeted"}
							</span>
						)}
						{feed && <span style={{ fontSize: "12px" }}>Tweet</span>}
					</div>
				</div>
				<div className='pr-3'>
					<span style={{ fontSize: "13px" }}>
						{moment(new Date(tweet.created_at)).startOf("day").fromNow()}
					</span>
				</div>
			</div>
			<hr className='mt-0 mb-1' />
			<div style={{ paddingLeft: "53px" }} className='pr-3 py-3'>
				<span
					style={{
						fontSize: "15px",
						color: "#364141",
						whiteSpace: "pre-line",
						pointerEvents: "none",
					}}
				>
					{tweet_text}
				</span>
			</div>
			<div
				style={{ paddingLeft: "53px" }}
				className='d-flex flex-row align-items-center'
			>
				{tweet.retweet_count === 0
					? tweet?.entities?.media?.map(
							(media) =>
								media.type == "photo" && (
									<div key={media.id} style={{ cursor: "pointer" }}>
										<img
											className='shadow-lg bg-white rounded-lg'
											width='140px'
											src={media.media_url_https}
											alt={media.display_url}
											onClick={() => setModalImageURL(media?.media_url_https)}
										/>
									</div>
								)
					  )
					: tweet?.retweeted_status?.entities.media?.map(
							(media) =>
								media?.type == "photo" && (
									<div key={media.id} style={{ cursor: "pointer" }}>
										<img
											className='shadow-lg bg-white rounded-lg'
											width='140px'
											src={media.media_url_https}
											alt={media.display_url}
											onClick={() => setModalImageURL(media?.media_url_https)}
										/>
									</div>
								)
					  )}
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
			{modalImageURL && (
				<ModalImage setModalImageURL={setModalImageURL} url={modalImageURL} />
			)}
		</section>
	);
}

export default TwitterSearchCard;
