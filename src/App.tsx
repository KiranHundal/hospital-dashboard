import React from "react";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./store";
import { Dashboard } from "./components/layout/Dashboard";
import { useHydrateCache } from "./hooks/useHydrateCache";
import queryClient from "./utils/QueryClient";

const AppContent = () => {
  const queryClient = useQueryClient();
  useHydrateCache(queryClient);

  return <Dashboard />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppContent />
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
