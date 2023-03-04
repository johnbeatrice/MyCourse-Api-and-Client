// home page where profile will be displayed
// ABOUT STRUCTURE: useLocation is used to capture username from login page, which is displayed at the loading of this page from "location.state.username". At loading of page useEffect is called to /getCourses and sets the "courses" state variable. Then, if user submits add course form, a query is sent to /addCourse endpoint. If that query is successful, a course is added to the db, and another fetch (nested in conditional of first fetch to /addCourse) is called to get new/updated list of courses, which is saved in "courses" state variable (overriding previous state from initial useEffect fetch), and then those are displayed so that user sees updated display of courses

// react imports
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// local file imports
import "./home.css"
import "./modals.css"

export default function Home() {

  // state
  // state variable for adding course to database
  // const [username, setUsername] = useState("");
  const [addCourse, setAddCourse] = useState(false);
  const [deleteCourse, setDeleteCourse] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [courseID, setCourseID] = useState();
  const [title, setTitle] = useState("");
  const [URL, setURL] = useState("");
  const [courseType, setCourseType] = useState("");
  const [platform, setPlatform] = useState(""); 
  // state variable for courses array that is displayed
  const [courses, setCourses] = useState();

  // data from Login (location.state.username)
  const location = useLocation();

  //variables for conditional rendering
  let coursesSection;
  let addCourseModal;
  let deleteCourseModal;
  let aboutMyCourse;

  // fetchCourses code is called in useEffect because courses have to be rendered at first page render
  useEffect(() => {
    // useEffect requires the fetch function to be declared inside of useEffect 
    const firstCoursesFetch = async () => {
    
      try {
        let res = await fetch("https://MyCourseApi.johnbeatrice.repl.co/getCourses", {
          method: "POST",
          // headers and mode were required to avoid cors error
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            username: location.state.username
          }),
        });
        let resJson = await res.json();
  
        if (resJson.status === 200) {
         
         setCourses(resJson.courses)
  
        } else {
          console.log("Some error ocurred...")
        }
        } catch (err) {
          console.log(err);
        }
    }

    firstCoursesFetch();
    
  }, [location.state.username])


  // fetchCourses is called in fetch to /addCourse and /deleteCourse to return updated courses array to be displayed to user
  const fetchCourses = async () => {
    try {
      let res = await fetch("https://MyCourseApi.johnbeatrice.repl.co/getCourses", {
        method: "POST",
        // headers and mode were required to avoid cors error
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          username: location.state.username
        }),
      });
      let resJson = await res.json();

      if (resJson.status === 200) {
       
       setCourses(resJson.courses)

      } else {
        console.log("Some error ocurred...")
      }
      } catch (err) {
        console.log(err);
      }

  }

  // handler functions
  const handleAddCourse = () => {
    if(addCourse === false){
      setAddCourse(true); 
    } else {
      setAddCourse(false); 
    }    
  }

  const handleDeleteCourse = (id) => {
    setCourseID(id);
    if(deleteCourse === false){
      setDeleteCourse(true); 
    } else {
      setDeleteCourse(false); 
    }    
  }

  const handleAboutModal = () => {
    if(aboutModal === false){
      setAboutModal(true); 
    } else {
      setAboutModal(false); 
    }    
  }

  // call to /addCourse endpoint in api
  const handleAddCourseApiCall = async (e) => {
    e.preventDefault();
    // make modal disappear
    setAddCourse(false);
    try {
      let res = await fetch("https://MyCourseApi.johnbeatrice.repl.co/addCourse", {
        method: "PUT",
        // headers and mode were required to avoid cors error
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          username: location.state.username,
          title: title,
          url: URL,
          courseType: courseType,
          platform: platform
        
        }),
      });
      let resJson = await res.json();

      if (resJson.status === 200) {
       
        console.log("course successfully added to database!")

        // nested fetch 
        fetchCourses();

      } else {
        console.log("Some error ocurred...")
      }
    } catch (err) {
      console.log(err);
    }
  };

  // call to /deleteCourse endpoint in api
  const handleDeleteCourseApiCall = async (e) => {
    e.preventDefault();
    // make modal disappear
    setDeleteCourse(false);
    try {
      let res = await fetch("https://MyCourseApi.johnbeatrice.repl.co/deleteCourse", {
        method: "PUT",
        // headers and mode were required to avoid cors error
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          username: location.state.username,
          courseID: courseID,
        
        }),
      });
      let resJson = await res.json();

      if (resJson.status === 200) {
       
        console.log("course successfully deleted from database!")

        // nested fetch 
        fetchCourses();

      } else {
        console.log("Some error ocurred...")
      }
    } catch (err) {
      console.log(err);
    }
  };

  // conditionally rendered sections
  // AddCourse modal
  if(addCourse === true){
    addCourseModal = (
      <>
        <div className="overlay"></div>
        <div className="modal">

          <form
            // handleAddCourseApiCall has to be called from here. Calling it as onClick attribute on submit button overrode the required tag.
            onSubmit={handleAddCourseApiCall}
          >
            <h1 className="H1">Add Course</h1>
            
            <input 
              type="text" 
              id="title" 
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              max-length="80" 
              required
              />

            <input 
              type="text" 
              id="url" 
              placeholder="URL"
              onChange={(e) => setURL(e.target.value)} 
              required
              />

            <input 
              type="text" 
              id="courseType" 
              placeholder="Course or Specialization..."
              onChange={(e) => setCourseType(e.target.value)} 
              max-length="24"
              // required
              />

            <input 
              type="text" 
              id="platform" 
              placeholder="Host platform (Coursera, FCC, etc)"
              onChange={(e) => setPlatform(e.target.value)}
              max-length="24"
              // required
              />

            
              <button
                type="submit"
                className="modalBtn submitBtn"
            
              >Submit</button>
              <button 
                className="modalBtn cancelBtn"
                onClick={handleAddCourse}
                >Cancel</button>
            
          </form>

        </div>
      </>
    )
  } else {
    addCourseModal = null;
  }

   // DeleteCourse modal
   if(deleteCourse === true){
    deleteCourseModal = (
      <>
        <div className="overlay"></div>
        <div className="modal delete-course-modal">

        <h1 className="H1">Are you sure you want to delete this course?</h1>

          <button
          className="modalBtn submitBtn"
          onClick={handleDeleteCourseApiCall}
          >Delete</button>
          <button
          className="modalBtn cancelBtn"
          onClick={handleDeleteCourse}
          >Cancel</button>
          
        </div>
      </>
    )
  } else {
    deleteCourseModal = null;
  }

  // About modal
  if(aboutModal === true){
    aboutMyCourse = (
      <>
        <div className="overlay"></div>
        <div className="modal about-course-modal">

        <h1 className="H1">Welcome to MyCourse!</h1>

          <p className="aboutTxt">MyCourse is an app for storing metadata about online courses and programs users would like to keep track of. Select "Add course" and fill in the title and url of any course or program you might be excited about!</p>

          
          <button
          className="modalBtn cancelBtn"
          id="aboutBtn"
          onClick={handleAboutModal}
          >Got it!</button>
          
        </div>
      </>
    )
  } else {
    aboutMyCourse = null;
  }

  // courses section
  // statement checks if courses state variable is empty or not
  if(courses !== undefined && courses.length > 0){
    coursesSection = (
      // loop through all courses and display them
      courses.map((obj)=>{

      return ( 
     

        <div 
        className="course-block" 
        key={obj._id}
        // onMouseEnter={() => setDeleteBtn(true)}
        // onMouseLeave={() => setDeleteBtn(false)}
        >
          <button 
          // style={deleteBtn ? {display: "inline-block"} : null}
          // make delete button trashcan icon?
          className="delete-course-btn"
          onClick={() => handleDeleteCourse(obj._id)}
          >Delete</button>

          <p className="course-title">{obj.title}</p>
          <a 
          className="course-link" 
          href={obj.url}
          target="_blank"
          rel="noopener noreferrer"
          >Go to course ></a>
          {/* ^vscode says it's a problem but it's not. Just react/vscode reading this wrong select "ctrl + shift + m" to pull up the error*/}
          <p className="course-type">{obj.courseType ? "Course type: " + obj.courseType : null}</p>
          <p className="course-platform">{obj.platform ? "Platform: " + obj.platform : null}</p>
        </div>
           )

      })

    //  end coursesSection component
    )
  } else {
    coursesSection = (
      <div className="no-courses">Click "Add course" to add a new course.</div>
    )
  }

  // rendering of home page 
  return (
      <div className="background">

        <nav>
          <div className="nav-content">

            <div className="logo">MyCourse</div>

              <div className="welcome-message-wrapper">

             <div 
             className="link about"
             onClick={handleAboutModal}
             
             >About</div>   

              <Link className="link" to="/settings" state={{username: location.state.username, _id: location.state._id}}>Settings</Link>

              <div className="welcome-message">Welcome, {location.state.username}</div>

              </div>

            </div>
        </nav>


        {/* add course button */}
        <button className="add-course" onClick={handleAddCourse}>Add course</button>

        
        {/* container divs only renders if course blocks are going to render */}
        
          <div className="courses-container" style={courses ? null : {display: "none"}} >
            {/* conditionally rendered course blocks */}
            {coursesSection}
          </div>
        {/* conditionally rendered AddCourse modal */}
        {addCourseModal}

         {/* conditionally rendered DeleteCourse modal */}
         {deleteCourseModal}

          {/* conditionally rendered About MyCourse modal */}
          {aboutMyCourse}

      </div>
  )
}