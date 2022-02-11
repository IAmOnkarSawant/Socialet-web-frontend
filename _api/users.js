import axios from "axios";
import { TWITTER_URL } from "./channels";

// POST REQUEST -> NEW USER PROFILE SURVEY
export function newUserSurvey(data) {
	console.log(data);
	return axios.post(`${TWITTER_URL}/survey`, data);
}

// GET REQUEST -> GET USER SOCIAL ACCOUNTS DETAILS
export function getSocialAccounts(user_id) {
	return axios.get(`${TWITTER_URL}/social/accounts?user_id=${user_id}`);
}

// DELETE REQUEST -> DELETE SPECIFIC SOCIAL ACCOUNT OF THE USER
export function deleteSocialAccount(user_id, social_account_name) {
	return axios.delete(
		`${TWITTER_URL}/social/accounts?user_id=${user_id}&social_account_name=${social_account_name}`
	);
}
