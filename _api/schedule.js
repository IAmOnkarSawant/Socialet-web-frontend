import axios from "axios";

export const SCHEDULED_POSTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/posts`;

// GET REQUEST -> GET ALL SCHEDULED POSTS
export function getScheduledPosts(user_id) {
  return axios.get(`${SCHEDULED_POSTS_URL}/scheduled?user_id=${user_id}`);
}

// PATCH REQUEST -> DELETE SCHEDULED POST
export function deleteScheduledPosts(post_id) {
  return axios.patch(
    `${SCHEDULED_POSTS_URL}/schedule/remove?post_id=${post_id}`
  );
}

// PATCH REQUEST -> UPDATE SCHEDULED POST
export function updateScheduledPosts(bodyData) {
  return axios.patch(`${SCHEDULED_POSTS_URL}/schedule/update`, bodyData);
}

// PATCH REQUEST -> RE-SCHEDULED POST
export function reScheduledPosts(bodyData) {
  return axios.patch(`${SCHEDULED_POSTS_URL}/reschedule`, bodyData);
}
