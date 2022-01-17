import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function AuthGuard({ children }) {
	const { data: session, status } = useSession();
	const [hasAccess, setHasAccess] = useState(false);
	const router = useRouter();
	console.log(session, status);
	useEffect(() => {
		if (status === "unauthenticated" && !session) {
			router.push("/authPages/login");
		} else {
			setHasAccess(true);
		}
	}, [session, status]);

	if (status === "loading" && !hasAccess) {
		console.log("Application Loading...");
	}

	if (session && status === "authenticated" && hasAccess) return children;

	return null;
}
