import axios from "axios";

export const TWITTER_URL = `${process.env.NEXT_PUBLIC_API_URL}/twitter`;

// GET REQUEST ->CONNECT TWITTER AUTH
export function connectTwitterAuth() {
  return axios.get(`${TWITTER_URL}/connect`);
}

// POST REQUEST -> SEND FETCH OAUTH TOKEN AND OAUTH VERIFIER
export function sendOAuthTokens(data) {
  return axios.post(`${TWITTER_URL}/oauth`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
