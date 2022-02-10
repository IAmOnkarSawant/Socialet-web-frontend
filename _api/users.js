import axios from "axios";
import { TWITTER_URL } from "./channels";

// POST REQUEST -> NEW USER PROFILE SURVEY
export function newUserSurvey(data) {
	console.log(data);
	return axios.post(`${TWITTER_URL}/survey`, data);
}
