import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "@/common/components/layouts/ProtectedLayout";
import Login from "@/screens/login/Login";
import Home from "@/screens/home/Home";
import NotFound from "@/screens/not-found/NotFound";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
  { path: "*", element: <NotFound /> },
]);
