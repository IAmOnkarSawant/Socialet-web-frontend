import axios from "axios";

export const PROFILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/profile`;

// POST REQUEST -> NEW USER PROFILE SURVEY
export function newUserSurvey(data) {
  return axios.post(`${PROFILE_URL}/survey`, data);
}

// GET REQUEST -> GET USER SOCIAL ACCOUNTS DETAILS
export function getSocialAccounts(user_id) {
  return axios.get(`${PROFILE_URL}/social/accounts?user_id=${user_id}`);
}

// DELETE REQUEST -> DELETE SPECIFIC SOCIAL ACCOUNT OF THE USER
export function deleteSocialAccount(user_id, social_account_name) {
  return axios.patch(`${PROFILE_URL}/social/account`, {
    user_id,
    social_account_name,
  });
}
