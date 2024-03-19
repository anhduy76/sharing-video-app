export function getEmbedId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? match[2]
    : null;
}
import axios from 'axios';
const API_KEY = 'AIzaSyCj8pNKnTzn_dCTza2OBKiQshQdU6fH3Gk'
export const getVideoTitle = async (url) => {
  try {
    // Extract video ID from URL
    let videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }

    // Make request to YouTube Data API
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`
    );
    // Extract video title from response
    const videoTitle = response.data.items[0].snippet;
    return videoTitle;
  } catch (error) {
    console.error('Error fetching video title:', error);
    return null;
  }
};