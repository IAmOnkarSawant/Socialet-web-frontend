import axios from "axios";

export const DASHBOARD_URL = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;

// GET REQUEST -> GET FOLLOWER AND FOLLOWING COUNT
export function getFollowers(user_id) {
  return axios.get(`${DASHBOARD_URL}/followCount/?user_id=${user_id}`);
}

// GET REQUEST -> GET TOP FOLLOWER
export function getTopFollower(user_id) {
  return axios.get(`${DASHBOARD_URL}/top_follower/?user_id=${user_id}`);
}

// GET REQUEST -> GET TOP TWEET
export function getTopTweet(user_id) {
  return axios.get(`${DASHBOARD_URL}/top_tweet/?user_id=${user_id}`);
}

// GET REQUEST -> GET TOP MEDIA TWEET
export function getTopMediaTweet(user_id) {
  return axios.get(`${DASHBOARD_URL}/top_media_tweet/?user_id=${user_id}`);
}

// GET REQUEST -> GET TOP MENTION
export function getTopMention(user_id) {
  return axios.get(`${DASHBOARD_URL}/top_mention/?user_id=${user_id}`);
}

// ROUTES FOR PLOTTING FOLLOWERS/FOLLOWING GRAPH
export function getTimeline(user_id) {
  return axios.get(`${DASHBOARD_URL}/timeline/?user_id=${user_id}`);
}
