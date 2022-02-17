import axios from "axios";
import { TWITTER_URL } from "./channels";

// GET REQUEST -> TWITTER FEED
export function getTwitterFeed(user_id) {
  return axios.get(`${TWITTER_URL}/feed/?user_id=${user_id}`);
}

// GET REQUEST -> TWITTER SEARCH
export function getSearchResults(user_id, query, geocode) {
  if (!geocode) {
    return axios.get(`${TWITTER_URL}/search?user_id=${user_id}&query=${query}`);
  } else {
    return axios.get(
      `${TWITTER_URL}/search?user_id=${user_id}&query=${query}&geocode=${geocode}`
    );
  }
}

// GET REQUEST -> GET CERTAIN TWEET BY ID
export function getTweetById(tweet_id, user_id) {
  return axios.get(
    `${TWITTER_URL}/tweet/?tweet_id=${tweet_id}&user_id=${user_id}`
  );
}

// POST REQUEST -> REPLY TO A CERTAIN TWEET
export function postReplyToTweet(formData) {
  return axios.post(`${TWITTER_URL}/reply`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// PATCH REQUEST -> FAVORITE A TWEET
export function postFavorites(bodyData) {
  return axios.patch(`${TWITTER_URL}/favorite`, bodyData);
}

// PATCH REQUEST -> POST A RETWEET
export function postReTweet(bodyData) {
  return axios.patch(`${TWITTER_URL}/retweet`, bodyData);
}
