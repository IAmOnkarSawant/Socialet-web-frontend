import moment from "moment";
import React from "react";

function TwitterCard({ text, hashtags, images }) {
	return (
		<div
			style={{
				fontSize: "14px",
				lineHeight: "20px",
				padding: "9px 14px",
				width: "fit-content",
				display: "flex",
				width: "350px",
			}}
			className='position-relative border bg-white'
		>
			<a href='#'>
				<div
					style={{
						width: "40px",
						height: "40px",
						borderRadius: "50%",
						position: "relative",
					}}
					className='bg-default text-center text-white font-weight-normal'
				>
					<span
						style={{
							width: "100%",
							height: "100%",
							borderRadius: "50%",
							fontSize: "20px",
							position: "absolute",
							top: "25%",
							transform: "translate(-50%)",
						}}
					>
						G
					</span>
				</div>
			</a>
			<div
				style={{
					paddingLeft: "16px",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<a
					href='#'
					style={{
						fontSize: "14px",
						lineHeight: "20px",
						display: "flex",
						flexShrink: 1,
						textDecoration: "none",
					}}
				>
					<span
						style={{ fontSize: "14px" }}
						className='font-weight-bold text-dark'
					>
						G11 SMWT
					</span>
					<span style={{ paddingLeft: "5px", color: "#657786" }}>SmwtG11</span>
					<span
						className='font-weight-normal'
						style={{ paddingLeft: "5px", color: "gray", fontSize: "13px" }}
					>
						{moment(new Date()).format("ll")}
					</span>
				</a>

				<span
					style={{
						unicodeBidi: "isolate",
						fontSize: "14px",
						fontFamily:
							'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
					}}
				>
					{text}
				</span>
				<div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
					{hashtags.map((hashtag, index) => {
						return (
							<span className='text-primary pr-2' key={index + hashtag}>
								{hashtag}
							</span>
						);
					})}
				</div>
				<div className='d-flex flex-row flex-wrap py-1'>
					{images.map(({ preview, id: imageId }) => (
						<div
							key={imageId}
							style={{
								width: "100px",
								height: "60px",
								marginRight: 4,
								marginBottom: 4,
							}}
						>
							<img
								style={{ width: "100%", height: "100%" }}
								src={preview}
								key={imageId}
								className='rounded-sm'
							/>
						</div>
					))}
				</div>
				<div style={{ display: "flex" }} className='pb-1 pt-2'>
					<svg
						style={{ width: "20px", height: "20px" }}
						fill='gray'
						viewBox='0 0 20 20'
						aria-hidden='true'
					>
						<path
							className='cls-1'
							d='M8.87 17.36a.5.5 0 0 1-.5-.5v-3.47h-.19a5.38 5.38 0 0 1 0-10.75h3.64a5.38 5.38 0 0 1 5.37 5.36 7.14 7.14 0 0 1-3.12 5.9l-4.92 3.38a.5.5 0 0 1-.28.08zm-.69-13.72a4.38 4.38 0 0 0 0 8.75h.69a.5.5 0 0 1 .5.5v3l4.14-2.83a6.14 6.14 0 0 0 2.68-5.06 4.38 4.38 0 0 0-4.38-4.38z'
						></path>
					</svg>
					<svg
						style={{ width: "20px", height: "20px", marginLeft: "25%" }}
						fill='gray'
						viewBox='0 0 20 20'
						aria-hidden='true'
					>
						<path
							className='cls-1'
							d='M19.35 11.92a.5.5 0 0 0-.71 0l-2.33 2.33v-7.25a3.32 3.32 0 0 0-3.31-3.35h-4.12a.5.5 0 0 0 0 1h4.12a2.32 2.32 0 0 1 2.32 2.35v7.28l-2.32-2.36a.5.5 0 0 0-.71.71l3.18 3.18.35.35.35-.35 3.18-3.18a.5.5 0 0 0 0-.71zM11.12 15h-4.12a2.32 2.32 0 0 1-2.31-2.31v-7.33l2.31 2.33a.5.5 0 0 0 .72-.69l-3.18-3.2-.35-.35-.35.35-3.19 3.2a.5.5 0 0 0 .71.71l2.32-2.35v7.28a3.32 3.32 0 0 0 3.32 3.36h4.13a.5.5 0 0 0 0-1z'
						></path>
					</svg>
					<svg
						style={{ width: "20px", height: "20px", marginLeft: "25%" }}
						fill='gray'
						viewBox='0 0 20 20'
						aria-hidden='true'
					>
						<path
							className='cls-1'
							d='M10 17.16c-2 0-7.6-5.15-7.6-10a4.32 4.32 0 0 1 4.06-4.32 4.38 4.38 0 0 1 3.54 2.07 4.41 4.41 0 0 1 3.56-2.07 4.31 4.31 0 0 1 4 4.35c-.11 4.81-5.74 9.97-7.56 9.97zm-3.54-13.32a3.3 3.3 0 0 0-3.06 3.34c0 4.43 5.46 9 6.61 9s6.44-4.49 6.59-9a3.29 3.29 0 0 0-3-3.34c-1.13 0-2.16.71-3.06 2.11l-.1.14a.52.52 0 0 1-.81 0l-.1-.15c-.92-1.39-1.94-2.1-3.07-2.1zm10.64 3.34z'
						></path>
					</svg>
				</div>
			</div>
		</div>
	);
}

export default TwitterCard;
