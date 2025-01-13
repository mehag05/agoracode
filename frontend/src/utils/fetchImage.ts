import axios from 'axios';

export const fetchImage = async (imageUrl: string): Promise<string> => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'blob' });
    const imageBlob = response.data;
    return URL.createObjectURL(imageBlob); // Create a URL for the blob
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch image');
  }
};