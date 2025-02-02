import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 1000 * 60 * 30,
    },
  },
});

if (process.env.NODE_ENV === 'development') {
  window.queryClient = queryClient;
}

export default queryClient;
