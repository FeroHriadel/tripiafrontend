import { headers } from "next/headers";

const get = async (endpoint: string) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT! + endpoint);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error)
    return ('Failed to fetch data');
  }
}

const post = async (endpoint: string, body: {[key: string]: any}) => {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT! + endpoint, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return { error: 'Failed to post data' };
  }
}



export const apiCalls = {
  get,
  post,
}




