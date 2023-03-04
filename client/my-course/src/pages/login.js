// login page where users can login. First page displayed when app is opened

// react imports
import React, {useState} from "react"
import { useNavigate } from "react-router-dom"


// local files imports
import "./loginSignup.css"

export default function Login({ onLogin, Logout }) {
  // to log user out if they click <back on browser controls so that they cannot click forward and be logged in again
  setTimeout(() => {
    console.log()
    Logout();
    // the setTimeout interval needs to be very short because otherwise it can remove a user's authentication after they submit the login info
  }, 100);

  // navigate
  const navigate = useNavigate();

  // state
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // handler function(s)
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("url", {
        method: "POST",
        // headers and mode were required to avoid cors error
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          username: name,
          password: password,
        
        }),
      });
      let resJson = await res.json();

      if (resJson.status === 200) {
       
        // console.log(resJson._id)
        // calling onLogin (from App.js) to allow navigate /home to work
        await onLogin()

        navigate("/home",{ state: { username: resJson.username, _id: resJson._id }})

      } else {
        setMessage(resJson.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (

      <div className="background">
          
          <form 
            className="form login" 
            id="loginForm"
            onSubmit={handleSubmit}
            >

            <h1 className="H1">MyCourse</h1>
        

            <input 
              type="text" 
              id="username" 
              placeholder="Username"
              onChange={(e) => setName(e.target.value)} 
              max-length="24"
              required
              />

          
            <input 
              type="password" 
              id="password" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              max-length="24"
              required
              />

            <button 
              type="submit"
              className="btnSubmit"
            >Login</button>

            <div className="message">{message ? <p>{message}</p> : null}</div>

            <p>Don't have an account? <a href="/signup">Sign up</a></p>
            
          </form>

        
      </div>
    
  )
}

