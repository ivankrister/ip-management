import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { initializeTokenRefresh } from "@/lib/axios";

export function App() {
  // Initialize automatic token refresh on app startup
  useEffect(() => {
    initializeTokenRefresh();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;