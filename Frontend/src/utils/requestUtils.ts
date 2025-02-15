import AsyncStorage from '@react-native-async-storage/async-storage';

export async function createRequest(
  url: string,
  body: Object,
  method?: string,
) {
  // const baseUrl = process.env.BACKEND_URL
  const baseUrl = 'https://gomatch-backend-production.up.railway.app';

  const headers = {'Content-Type': 'application/json'};
  const to = `${baseUrl}${url}`;
  const result = await fetch(to, {
    method: method ?? 'POST',
    headers: headers,
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    throw Error(await result.text());
  }

  return result;
}

export async function createRequestWithToken(
  url: string,
  body: Object,
  method?: string,
) {
  // const baseUrl = process.env.BACKEND_URL

  const baseUrl = 'https://gomatch-backend-production.up.railway.app';
  const token = (await AsyncStorage.getItem('authorization')) as string;
  const headers = {
    'Content-Type': 'application/json',
    authorization: `${token}`,
  };
  const to = `${baseUrl}${url}`;

  const result = await fetch(to, {
    method: method ?? 'POST',
    headers: headers,
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    throw Error(await result.text());
  }
  return result;
}
