

import React, {useState} from "react";
import { 
  BrowserRouter, 
  Routes, Route } from "react-router-dom";

// styles
// import './loginSignup.css';
// pages
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Settings from "./pages/settings";
import NotAuthenticated from "./pages/notAuthenticated";

function App() {

  // state and handler function for auth. 
  const [auth, setAuth] = useState(false);
// handler function is passed to Login component via props where if login is successful it changes auth state to true which allows Route path "/home" to redirect to Home component instead of error component
  const handleLogin = async () => {
    setAuth(true);
  }
// this is for userTimeout if use clicks <back away from profile page back to login page
  const handleUserTimeout = async () => {
    setAuth(false);
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
          element={
            <Login 
              onLogin={handleLogin} 
              Logout={handleUserTimeout} 
            />
              } 
          />
        <Route path="/signup" element={<Signup  />} />
        <Route 
          path="/home" 
          element={
            auth ? 
            <Home 
            // onLogin={handleLogin} 
            /> 
            : <NotAuthenticated />} 
         />
        <Route 
          path="/settings" 
          element={
            auth ?
            <Settings />
            : <NotAuthenticated />} 
        />
        <Route path="*" 
          element={
            <Login 
              onLogin={handleLogin} 
              Logout={handleUserTimeout}  
            />
                }
        />
        
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;
