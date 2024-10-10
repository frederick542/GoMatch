import AsyncStorage from '@react-native-async-storage/async-storage';

export async function createRequest(
  url: string,
  body: Object,
  method?: string,
) {
  // const baseUrl = process.env.BACKEND_URL
<<<<<<< Updated upstream
  const baseUrl = 'http://192.168.68.104:4001';
=======
  const baseUrl = 'http://192.168.68.105:4001';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
  const baseUrl = 'http:/192.168.68.104:4001';
=======

  const baseUrl = 'http://192.168.68.105:4001';
>>>>>>> Stashed changes
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
