import axios from "axios";

export const TWITTER_URL = `${process.env.NEXT_PUBLIC_API_URL}/twitter`;
export const FACEBOOK_URL = `${process.env.NEXT_PUBLIC_API_URL}/facebook`;

// GET REQUEST ->CONNECT TWITTER AUTH
export function connectTwitterAuth() {
  return axios.get(`${TWITTER_URL}/connect`);
}

// GET REQUEST ->CONNECT FACEBOOK AUTH
export function connectFacebookAuth() {
  return axios.get(`${FACEBOOK_URL}/connect`);
}

// POST REQUEST -> SEND FETCH OAUTH TOKEN AND OAUTH VERIFIER
export function sendOAuthTokens(data) {
  return axios.post(`${TWITTER_URL}/oauth`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// GET REQUEST -> SEND CODE FROM FACEBOOK TOKEN ENDPOINT
export function sendOAuthTokensFB(data) {
  return axios.get(
    `${FACEBOOK_URL}/tokens?code=${data["code"]}&user_id=${data["user_id"]}`
  );
}
