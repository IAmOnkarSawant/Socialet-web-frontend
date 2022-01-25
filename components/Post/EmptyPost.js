import React from "react";

function EmptyPost() {
	return (
		<div>
			<p style={{ fontSize: "14px" }} className='font-weight-bold text-primary'>
				Select a profile and start adding content in the left panel.
			</p>
			<div
				className='d-flex flex-row justify-content-center py-4 mt-3 bg-white'
				style={{ width: "400px" }}
			>
				<div
					style={{
						width: "50px",
						height: "50px",
						borderRadius: "50%",
						backgroundColor: "#dee1e1",
					}}
				/>
				<div style={{ paddingLeft: "12px" }}>
					<div
						style={{
							width: "100px",
							height: "24px",
							borderRadius: "8px",
							marginBottom: "12px",
							backgroundColor: "#dee1e1",
						}}
					/>
					<div
						style={{
							width: "300px",
							height: "24px",
							borderRadius: "8px",
							marginBottom: "4px",
							backgroundColor: "#dee1e1",
						}}
					/>
					<div
						style={{
							width: "300px",
							height: "24px",
							borderRadius: "8px",
							marginBottom: "4px",
							backgroundColor: "#dee1e1",
						}}
					/>
					<div
						style={{
							width: "200px",
							marginBottom: "18px",
							backgroundColor: "#dee1e1",
						}}
					/>
					<div
						style={{
							width: "300px",
							height: "200px",
							borderRadius: "8px",
							marginBottom: "4px",
							backgroundColor: "#dee1e1",
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default EmptyPost;