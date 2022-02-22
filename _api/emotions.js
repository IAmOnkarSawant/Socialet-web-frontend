import axios from "axios";

export const EMOTION_URL = `${process.env.NEXT_PUBLIC_API_URL}/emotions/recognise`;

// POST REQUEST -> EMOTION RECOGNISION
export function emotionRecogniser(bodyData) {
	return axios.post(`${EMOTION_URL}`, bodyData);
}
