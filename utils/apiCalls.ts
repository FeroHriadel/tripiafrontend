const get = async (endpoint: string) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT! + endpoint);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch data');
  }
}



export const apiCalls = {
  get,
}




