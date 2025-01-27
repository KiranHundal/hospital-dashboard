import React from "react";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Dashboard } from "./components/layout/Dashboard";
import { useHydrateCache } from "./hooks/useHydrateCache";
import queryClient from "./utils/QueryClient";

const AppContent = () => {
  const queryClient = useQueryClient();
  useHydrateCache(queryClient);

  return <Dashboard />;
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
