// signup form where users can create profile

// react imports
import React, {useState} from "react"
import { useNavigate } from "react-router-dom"

// local files imports
import "./loginSignup.css"

export default function Signup() {
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
      let res = await fetch("https://MyCourseApi.johnbeatrice.repl.co/addUser", {
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

      console.log(resJson.message);

      if (resJson.status === 200) {
       
        console.log(resJson);

        navigate("/")
         
      } else {
        setMessage(resJson.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (

      <div className="background">
        {/* <div className="form-wrapper"> */}
          
          <form 
            className="form signup"
            onSubmit={handleSubmit}
            >

            <h1 className="H1">MyCourse</h1>

            <h2>Sign up to keep track of exciting online courses and resources.</h2>
            
           

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
            >Create profile</button>

            <div className="message">{message ? <p>{message}</p> : null}</div>

            <p>Already have an account? <a href="/">Log in</a></p>
            
          </form>

        


        {/* </div> */}
        
      </div>
    
  )
}