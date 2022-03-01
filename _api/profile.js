import axios from "axios";
import { TWITTER_URL } from "./channels";

export const PROFILE = `${process.env.NEXT_PUBLIC_API_URL}/profile`;

// GET REQUEST -> RESPONSE USER TIMELINE/POSTS
export function getUserTimeline(user_id, screen_name, page) {
  if (screen_name) {
    return axios.get(
      `${PROFILE}/user/timeline?user_id=${user_id}&page=${page}&screen_name=${screen_name}`
    );
  }
  return axios.get(`${PROFILE}/user/timeline?user_id=${user_id}&page=${page}`);
}

// GET REQUEST -> RESPONSE USER PROFILE DETAILS FROM TWITTER
export function getUserDetails(user_id, screen_name) {
  if (screen_name) {
    return axios.get(
      `${PROFILE}/user/profile?user_id=${user_id}&screen_name=${screen_name}`
    );
  }
  return axios.get(`${PROFILE}/user/profile?user_id=${user_id}`);
}

// GET REQUEST -> RESPONSE USER MENTIONS FROM TWITTER
export function getUserMentions(user_id, screen_name, page) {
  if (screen_name) {
    return axios.get(
      `${TWITTER_URL}/search?user_id=${user_id}&query=${screen_name}&page=${page}`
    );
  }
  return axios.get(`${PROFILE}/user/mentions?user_id=${user_id}&page=${page}`);
}

// GET REQUEST -> RESPONSE USER FOLLOWERS FROM TWITTER
export function getUserFollowers(user_id, screen_name, page) {
  if (screen_name) {
    return axios.get(
      `${PROFILE}/user/followers?user_id=${user_id}&page=${page}&screen_name=${screen_name}`
    );
  }
  return axios.get(`${PROFILE}/user/followers?user_id=${user_id}&page=${page}`);
}

// GET REQUEST -> RESPONSE USER FRIENDS/FOLLOWING FROM TWITTER
export function getUserFollowing(user_id, screen_name, page) {
  if (screen_name) {
    return axios.get(
      `${PROFILE}/user/following?user_id=${user_id}&page=${page}&screen_name=${screen_name}`
    );
  }
  return axios.get(`${PROFILE}/user/following?user_id=${user_id}&page=${page}`);
}

// GET REQUEST -> RESPONSE USER FOLLOW/UNFOLLW FROM TWITTER
export function followUser(bodyData) {
  console.log(bodyData);
  return axios.patch(`${TWITTER_URL}/follow`, bodyData);
}

// GET REQUEST -> RESPONSE AUTHENTICATED USER LAST 30 DAYS POSTS
export function getLast30DaysPosts(user_id) {
  return axios.get(`${PROFILE}/last30daysposts?user_id=${user_id}`);
}
