
import './styles/globals.css';
import './styles/layout.css';
import './styles/navbar.css';
import './styles/buttons.css';
import './styles/game.css';
import './styles/records.css';
import './styles/not-found.css';
import './styles/responsive.css';
import './styles/roguelike.css';

import Navbar   from './pages/NavBar/NavBar';
import NotFound from './pages/notFound/NotFound';
import AboutUs from './pages/AboutUs/AboutUs';
import Game from './pages/Memory/Game';
import Home from './pages/Home/Home';
import Game2048 from './pages/Game2048/Game2048';
import Roguelike from './pages/RogueLike/Roguelike';
import TicTacToe from './pages/TicTacToe/TicTacToe';
import { Auth } from './pages/Autentification/Auth';

import { createBrowserRouter } from "react-router-dom"
import { RouterProvider } from "react-router-dom"
import { Outlet } from "react-router-dom"

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';



function NavbarWrapper(){
    return (
    <div  className="app-container">
        <Navbar/>
        <Outlet/>
    </div>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <NavbarWrapper/>,
        children:[
             {
                path: "/",
                element: <Home/>
            },
            {
                path: "/About",
                element: <AboutUs />
            },
            {
                path: "/418",
                element: <NotFound/>
            },
            {
                path: "/game",
                element: <Game/>,
                
            },
              {
                path: "/2048",
                element: <Game2048/>,
                
            }  ,
            {
                path: "/tictactoe",
                element: <TicTacToe/>,
                
            },
            {
                path: "/roguelike",
                element: <Roguelike/>,
                
            },
                {
                path: "/auth",
                element: <Auth/>,
                
            }
           
           
        ]
    }
])





function App() {
  
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch({ type: 'auth/checkAuth' });
    }
  }, [dispatch]);


  return (

      <div>
          <RouterProvider router={router}/> 
    </div>
  );
}

export default App;