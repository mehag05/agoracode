import axios from 'axios';
import Session from 'supertokens-auth-react/recipe/session';

export const fetchUserDetails = async (userId: string) => {
  try {
    console.log('Fetching user details for userId:', userId);

    // Retrieve the access token from the session
    const accessToken = await Session.getAccessToken();

    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userDetails = response.data;
    return userDetails;
  } catch (error: any) {
    console.error('Failed to fetch user details:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else {
      console.error('Error object:', error); // Log the entire error object
    }
    return null;
  }
};