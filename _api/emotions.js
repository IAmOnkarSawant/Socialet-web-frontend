import axios from "axios";

export const EMOTION_URL = `${process.env.NEXT_PUBLIC_API_URL}/emotions`;

// POST REQUEST -> GET TRANSLATED TEXT
export function postTranslatedText(bodyData) {
  console.log(bodyData);
  return axios.post(`${EMOTION_URL}/translate`, bodyData);
}

// POST REQUEST -> EMOTION RECOGNISION
export function emotionRecogniser(bodyData) {
  return axios.post(`${EMOTION_URL}/recognise`, bodyData);
}
