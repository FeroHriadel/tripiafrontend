import { headers } from "next/headers";
import { getIdToken} from "./cognito";



const get = async (endpoint: string) => {
  try {
    const options = {method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${await getIdToken()}`}}
    const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT! + endpoint, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error)
    return ('Failed to fetch data');
  }
}

const post = async (endpoint: string, body: {[key: string]: any} = {}) => {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await getIdToken()}` },
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

const del = async (endpoint: string, body: {[key: string]: any} = {}) => {
  try {
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await getIdToken()}` },
      body: JSON.stringify(body),
    };
    const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT! + endpoint, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return { error: 'Failed to delete data' };
  }
}

const put = async (endpoint: string, body: {[key: string]: any} = {}) => {
  try {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await getIdToken()}` },
      body: JSON.stringify(body),
    };
    const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT! + endpoint, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return { error: 'Failed to update data' };
  }
}



export const apiCalls = {
  get,
  post,
  del,
  put
};



//helpers:
export const uriEncodeObj = (obj: {[key: string]: any}) => { //for encoding dynamoDB LastEvaluatedKey into uri friendly string
  const stringified = JSON.stringify(obj);
  const uriEncoded = encodeURIComponent(stringified);
  return uriEncoded;
}




