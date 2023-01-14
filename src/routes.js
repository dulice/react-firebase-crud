import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";

export const routes = [
    { 
        element: <Home />,
        path: '/',
        name: 'home',
    },
    { 
        element: <Signup />,
        path: '/signup',
        name: 'signup',
    },
    { 
        element: <Signin />,
        path: '/signin',
        name: 'signin',
    },
]