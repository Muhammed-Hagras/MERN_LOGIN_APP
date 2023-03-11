import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Username from "./components/Username";
import Register from "./components/Register";
import Password from "./components/Password";
import Profile from "./components/Porfile";
import Recovery from "./components/Recovery";
import Reset from "./components/Reset";
import PageNptFound from "./components/PageNotFound"
import { Authorization, ProtectRoute } from './middleware/auth';
/*root router*/
const router = createBrowserRouter([
    {
        path: "/",
        element: <Username/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/password",
        element: <ProtectRoute><Password/></ProtectRoute>
    },
    {
        path: "/profile",
        element: <Authorization><Profile/></Authorization>
    },
    {
        path: "/recovery",
        element: <Recovery/>
    },
    {
        path: "/reset",
        element: <Reset/>
    },
    {
        path: "/*",
        element: <PageNptFound/>
    },

])

export default function App() {
  return (
    <main>
    <RouterProvider router={router}/>
    </main>
  )
}
