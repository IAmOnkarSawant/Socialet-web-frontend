import axios from "axios";

export const HASHTAGS_RECOMMENDER = `${process.env.NEXT_PUBLIC_API_URL}/hashtags/recommend`;

// POST REQUEST -> RESPONSE GIVES HASHTAGS
export function recommendHashtags(formData) {
    return axios.post(
        `${HASHTAGS_RECOMMENDER}`,
        formData,
        {headers: { 'content-type': 'multipart/form-data' }}
    );
}