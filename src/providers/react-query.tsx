"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClietn = new QueryClient();

  return (
    <QueryClientProvider client={queryClietn}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
