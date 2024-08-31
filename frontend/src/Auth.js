import httpClient from './httpClients.ts';
const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const isLoggedIn = async () => {
  try {
    const response = await httpClient.get(`${apiUrl}/check-login`);
    return response.data.loggedIn; // Assming the API returns { loggedIn: true/false }
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};
