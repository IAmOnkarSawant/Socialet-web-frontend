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
import router from "next/router";

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
