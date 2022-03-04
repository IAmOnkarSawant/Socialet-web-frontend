import axios from "axios";

export const DASHBOARD_URL = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;

// GET REQUEST -> GET FOLLOWER AND FOLLOWING COUNT
export function getFollowers(user_id) {
	return axios.get(`${DASHBOARD_URL}/followCount/?user_id=${user_id}`);
}
