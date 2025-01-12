import { CONFIG } from '../config/constants';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const apiService = {
  async fetchPosts(): Promise<Post[]> {
    try {
      const response = await fetch(CONFIG.API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }
};
