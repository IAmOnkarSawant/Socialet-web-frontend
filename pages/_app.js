import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";

import PageChange from "components/PageChange/PageChange.js";
import { AuthGuard } from "../components/Auth/AuthGuard";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/nextjs-argon-dashboard.scss";

import "@fullcalendar/common/main.min.css";
import "@fullcalendar/daygrid/main.min.css";
import "@fullcalendar/timegrid/main.min.css";

import "emoji-mart/css/emoji-mart.css";
import "react-datepicker/dist/react-datepicker.css";

import router from "next/router";
import { Toaster } from "react-hot-toast";

Router.events.on("routeChangeStart", (url) => {
	console.log(`Loading: ${url}`);
	document.body.classList.add("body-page-transition");
	ReactDOM.render(
		<PageChange path={url} />,
		document.getElementById("page-transition")
	);
});
Router.events.on("routeChangeComplete", () => {
	ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
	document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
	ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
	document.body.classList.remove("body-page-transition");
});

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	useEffect(() => {
		let comment = document.createComment(
			`Copyrights Included ${new Date().getFullYear()}`
		);
		document.insertBefore(comment, document.documentElement);
	}, []);

	const Layout = Component.layout || (({ children }) => <>{children}</>);
	const router = useRouter();
	const { route } = router;
	console.log(route);

	return (
		<SessionProvider
			options={{
				staleTime: 0,
				refetchInterval: 0,
			}}
			session={pageProps.session}
		>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, shrink-to-fit=no'
				/>
				<title>Social Media Workflow Tool</title>
			</Head>
			<Layout>
				{Component.requireAuth ? (
					<AuthGuard>
						<Component {...pageProps} />
					</AuthGuard>
				) : (
					<Component {...pageProps} />
				)}
			</Layout>
			<Toaster
				position='bottom-right'
				reverseOrder={false}
				gutter={8}
				containerClassName=''
				containerStyle={{}}
				toastOptions={{
					// Define default options
					className: "",
					duration: 5000,
					style: {
						fontSize: "14px",
						borderTopRightRadius: 0,
						borderBottomRightRadius: 0,
						fontFamily: "unset",
					},
					success: {
						style: {
							borderRight: "5px solid #62D346",
						},
					},
					error: {
						style: {
							borderRight: "5px solid #ff4b4b",
						},
					},
				}}
			/>
		</SessionProvider>
	);
}

function Auth({ children }) {
	const { data: session, status } = useSession();
	useEffect(() => {
		if (session && status === "authenticated") {
			router.push("/admin/dashboard");
		}
	}, [session]);

	if (!session && status === "unauthenticated") return children;

	return null;
}
