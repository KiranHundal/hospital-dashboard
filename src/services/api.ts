import { CONFIG } from '../config/constants';
import { APIError } from '../types/errors';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface APIResponse<T> {
  data: T;
  statusCode: number;
  message?: string;
}

export const apiService = {
  async fetchPosts(): Promise<APIResponse<Post[]>> {
    try {
      const response = await fetch(CONFIG.API_URL);
      const statusCode = response.status;

      if (!response.ok) {
        throw new APIError(
          `HTTP error! status: ${statusCode}`,
          statusCode,
          await response.json().catch(() => null)
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new APIError('Invalid response format: expected an array', statusCode, data);
      }

      const validPosts = data.filter((post): post is Post => {
        return typeof post === 'object' &&
          post !== null &&
          typeof post.id === 'number' &&
          typeof post.title === 'string' &&
          typeof post.userId === 'number' &&
          typeof post.body === 'string';
      });

      return {
        data: validPosts,
        statusCode,
        message: 'Posts fetched successfully'
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Failed to fetch posts',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  },

  validatePost(post: unknown): post is Post {
    return (
      typeof post === 'object' &&
      post !== null &&
      'id' in post &&
      'title' in post &&
      'userId' in post &&
      'body' in post
    );
  }
};
