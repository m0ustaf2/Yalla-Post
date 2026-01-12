import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./Routing/appRoutes";
import { AuthContextProvider } from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


function App() {
  const queryClient = new QueryClient();
  return (
    <>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </AuthContextProvider>
        </QueryClientProvider>
    </>
  );
}

export default App;
