import httpClient from './httpClients.ts';

export const isLoggedIn = async () => {
  try {
    const response = await httpClient.get('/check-login');
    return response.data.loggedIn; // Assuming the API returns { loggedIn: true/false }
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};
