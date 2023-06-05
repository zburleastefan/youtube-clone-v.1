import axios from "axios";

const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

export const fetchFromRapidApi = async (url: string, results: number) => {
  const options = {
    params: {
      maxResults: results,
    },
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
      SameSite : 'Lax',
    }
  };
  const {data} =  await axios.get(`${BASE_URL}/${url}`, options );
  return data;
}