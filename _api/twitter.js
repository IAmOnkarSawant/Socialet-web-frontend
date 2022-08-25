import axios from "axios";
import { TWITTER_URL } from "./channels";

export const TWITTER_ADMIN_URL = `${process.env.NEXT_PUBLIC_API_URL}/admin`;

// GET REQUEST -> TWITTER FEED
export function getTwitterFeed(user_id, page = 1, options) {
  return axios.get(
    `${TWITTER_URL}/feed/?user_id=${user_id}&page=${page}`,
    options
  );
}

// GET REQUEST -> TWITTER SEARCH
export function getSearchResults(user_id, page, query, options = {}, geocode) {
  if (!geocode) {
    return axios.get(
      `${TWITTER_URL}/search?user_id=${user_id}&query=${query}&page=${page}`,
      options
    );
  } else {
    return axios.get(
      `${TWITTER_URL}/search?user_id=${user_id}&query=${query}&page=${page}&geocode=${geocode}`,
      options
    );
  }
}

// GET REQUEST -> GET CERTAIN TWEET BY ID
export function getTweetById(tweet_id, user_id) {
  return axios.get(
    `${TWITTER_URL}/tweet/?tweet_id=${tweet_id}&user_id=${user_id}`
  );
}

// GET REQUEST -> GET WEEKLY TWEETS
export function getWeeklyTweets(user_id) {
  return axios.get(`${TWITTER_ADMIN_URL}/weekly_analysis/?user_id=${user_id}`);
}

// PATCH REQUEST -> FAVORITE A TWEET
export function postFavorites(bodyData) {
  return axios.patch(`${TWITTER_URL}/favorite`, bodyData);
}

// PATCH REQUEST -> POST A RETWEET
export function postReTweet(bodyData) {
  return axios.patch(`${TWITTER_URL}/retweet`, bodyData);
}
