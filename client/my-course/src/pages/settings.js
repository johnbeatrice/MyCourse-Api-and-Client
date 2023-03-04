// settings page where user can delete profile
// react imports
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// local imports
import "./home.css"


function Settings() {

  // state
  const [deleteProfile, setDeleteProfile] = useState(false);

  // get username data from home page so you can send it back when you want to link back to home page
  const location = useLocation();

  // navigate to login if delete's profile
  const navigate = useNavigate();

  // modal variable
  let deleteProfileModal;

  // handler functions
  const handleDeleteProfile = () => {
    if(deleteProfile === false){
      setDeleteProfile(true); 
    } else {
      setDeleteProfile(false); 
    }    
  }

  // call to /deleteCourse endpoint in api
  const handleDeleteProfileApiCall = async (e) => {
    e.preventDefault();
    // make modal disappear
    setDeleteProfile(false);
    try {
      let res = await fetch("https://MyCourseApi.johnbeatrice.repl.co/deleteUser", {
        method: "PUT",
        // headers and mode were required to avoid cors error
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          username: location.state.username,
          _id: location.state._id,
        
        }),
      });
      let resJson = await res.json();

      if (resJson.status === 200) {
       
        console.log("profile successfully deleted from database!")

        navigate("/login");

      } else {
        console.log("Some error ocurred...")
      }
    } catch (err) {
      console.log(err);
    }
  };


  // delete user profile modal
  if(deleteProfile === true){
    deleteProfileModal = (
      <>
        <div className="overlay"></div>
        <div className="modal delete-course-modal">

        <h1 className="H1">Are you sure you want to delete this profile?</h1>

          <button
          className="modalBtn submitBtn"
          onClick={handleDeleteProfileApiCall}
          >Delete</button>
          <button
          className="modalBtn cancelBtn"
          onClick={handleDeleteProfile}
          >Cancel</button>
          
        </div>
      </>
      )
    } else {
      deleteProfileModal = null;
    }

    return (
        <div className="background">
            <div className="settings-container">

              <Link className="link home-link" to="/home" state={{username: location.state.username, _id: location.state._id}} >Home</Link>

              <button className="delete-user-btn"
              onClick={handleDeleteProfile}
              >Delete user profile</button>

            </div>
            {/* modal */}
            {deleteProfileModal}
        </div>
    )

}


export default Settings;