import React, { useEffect } from "react";
import { Fade } from "reactstrap";

function ModalImage({ url, setModalImageURL }) {
	useEffect(() => {
		url && (document.body.style.overflow = "hidden");
		return () => (document.body.style.overflow = "unset");
	}, [url]);

	return (
		<div
			onClick={() => setModalImageURL("")}
			className='d-flex flex-row justify-content-center align-items-center bg-black'
			style={{
				position: "fixed",
				inset: 0,
				width: "100%",
				height: "100%",
				background: "rgba(0, 0, 0, 0.6)",
				overflow: url ? "hidden" : "none",
			}}
		>
			<Fade>
				<img
					onClick={(e) => e.stopPropagation()}
					style={{ cursor: "pointer", minWidth: "500px" }}
					className='rounded-lg img-fluid'
					width='500px'
					src={url}
					alt={url}
				/>
			</Fade>
		</div>
	);
}

export default ModalImage;
