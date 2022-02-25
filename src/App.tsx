import React, { useState, useEffect } from "react";
import { Badge, Nav, Navbar } from "react-bootstrap";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import db from "./firebase";
import { getAuth, onAuthStateChanged, signOut, UserCredential } from "firebase/auth";
import toast from "react-hot-toast";
import Signup from "./pages/home/Signup";
import { query, collection, onSnapshot } from "firebase/firestore";
import ToasterNode from "./components/ToasterNode";
import Dashboard from "./dashboard/Dashboard";
import FAQs from "./pages/FAQs";
import Officers from "./pages/Officers";
import Calendar from "./pages/calendar/Calendar";
import Profile from "./dashboard/profile/Profile";
import Attendance from "./dashboard/Attendance";
import Projects from "./dashboard/Projects";
import AdminDashboard from "./admin/admin-dashboard/AdminDashboard";
import AdminSettings from "./admin/AdminSettings";


export interface Event {
  code: string;
  startDate: Date;
  endDate: Date;
  name: string;
  optionality: string;
  description: string;
  hasProjectHours: boolean;
  docId: string;
  eventHosts: string[];
}

export interface Announcement {
  title: string;
  content: string;
  author: string;
  docId: string;
}

export interface AttendedEvent {
  code: string;
  didAttend?: boolean;
  localEventName: string;
  projectHours: number;
  startDate: any;
}


export interface Project {
  attendees: [string];
  dates: [Date];
  leaders: [string];
  projectDescription: string;
  projectName: string;
  totalHoursServed: number;
}

export interface Student {
  attendance: AttendedEvent[];
  grade: number;
  isAdmin: boolean;
  myProjects: Project[];
  name: string;
  nonNHSHoursSubmitted: Event[];
  announcements: Announcement[];
  specialId: string;
  docId: string;
  officerDescription?: OfficerDescription;
  studentUID: string;
}

export interface OfficerDescription {
  position: string;
}

function App() {
  const auth = getAuth();
  var [user, setUser] = useState<UserCredential["user"]>();
  var [student, setStudent] = useState<Student>();
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    authUser();
  }, [user]);

  function authUser() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log(user);
        setUser(user);
        // setIsAuthenticating(false);
        fetchAllStudentsFromFirestore();
        fetchEventsFromFirestore();
        fetchAnnouncementsFromFirestore();

        console.log("user logged in");
      } else {
        // User is signed out
        // setIsAuthenticating(false);
      }
    });
  }

  async function fetchAnnouncementsFromFirestore() {
    setLoading(true);
    console.log("fetch announcements");
    const announcementsQS = await query(collection(db, "announcements"));
    var items: Announcement[] = [];
    const unsubscribeToAnnouncementsQS = onSnapshot(announcementsQS, (querySnapshot) => {
      items = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        const { title, content, author } = doc.data();
          items.push({
            title: title,
            content: content,
            author: author,
            docId: doc.id,
          });
      });
      setAnnouncements(items);
    });
    setLoading(false);
  }
 

  const signoutHandler = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      window.location.href = "/home";
    }).catch((error) => {
      toast.error(error.message);
    });
  }


  async function fetchEventsFromFirestore() {
    setLoading(true);
    const eventsQS = await query(collection(db, "events-Data"));
    var items: Event[] = [];
    const unsubscribeToEventsQS = onSnapshot(eventsQS, (querySnapshot) => {
      items = [];
      querySnapshot.forEach((doc) => {
        var {
        code,
        startDate,
        endDate,
        name,
        description,
        optionality,
        hasProjectHours,
        hosts,
      } = doc.data();
      items.push({
        code: code,
        startDate: startDate ? new Date(startDate.toDate()) : new Date(),
        endDate: endDate ? new Date(endDate.toDate()) : new Date(),
        name: name,
        optionality: optionality,
        hasProjectHours: hasProjectHours,
        docId: doc.id,
        description: description,
        eventHosts: hosts
      });
      items.sort((a, b) => a.code.localeCompare(b.code));
      setEvents(items);
    });
    });
      setLoading(false);
  }

  async function fetchAllStudentsFromFirestore() {
    setLoading(true);
    var items: Student[] = [];
    const studentQS = await query(collection(db, "users"));
    const unsubscribeFromStudentQS = onSnapshot(studentQS, (querySnapshot) => {
      items = [];
      querySnapshot.forEach((doc) => {
        const studentData = doc.data();
        const studentObj: Student = {
            grade: studentData.grade,
            attendance: studentData.attendance,
            isAdmin: studentData.isAdmin,
            myProjects: studentData.myProjects,
            name: studentData.name,
            nonNHSHoursSubmitted: studentData.nonNHSHoursSubmitted,
            specialId: studentData.specialId,
            announcements: studentData.announcements,
            docId: doc.id,
            studentUID: studentData.UID ? studentData.UID : "",
          };
          items.push(studentObj);
  
          if (user?.uid != undefined && studentData.studentUID === user?.uid) {
            setStudent(studentObj);
          }
      });
      items = items.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(items);
    });
    setLoading(false);
  }

  const getStudentNameFromID = (id: string):string => {
    for (var i = 0; i < students.length; i++) {
      if (students[i].specialId === id) {
        return students[i].name;
      }
    }
    return "";
  }

  const getStudentObjectFromID = (id:string):Student | undefined => {
    for (var i = 0; i < students.length; i++) {
      if (students[i].specialId === id) {
        return students[i];
      }
    }
  }

  return (
    <div>
      <ToasterNode />
      <Navbar expand="sm" className="flex items-center p-3">
        <Navbar.Brand>
          COHS NHS{" "}
          <Badge className="bg-blue-500 p-1 text-white font-bold rounded-full">
            BETA
          </Badge>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="flex space-x-5 ml-4 items-center">
          <Nav className="mr-auto flex space-x-5 ml-4">
            {!user && <Nav.Link href="/home">Home</Nav.Link>} 
            {user && <Nav.Link href="/calendar">Calendar</Nav.Link>}
            {user && <Nav.Link href="/officers">Officers</Nav.Link>}
            {user && <Nav.Link href="/faqs">FAQs</Nav.Link>}
          </Nav>
          <Nav className="flex-grow">
          {!user && <Nav.Link href="/signup">Signup</Nav.Link>}
          </Nav>
          <Nav className="flex space-x-5 ml-4 items-center">
            {user && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
            {user && (
              <Nav.Link className="bg-red-500 rounded-lg p-2">
                <button onClick={signoutHandler}><p className="font-bold text-white">Logout</p></button>
              </Nav.Link>
            )}
            {student?.isAdmin && user && (
              <Nav.Link className="bg-emerald-300 font-bold rounded-lg p-2" href="/admin-dashboard">
                Admin Portal
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>


      
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Routes>
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup students={students}/>}> </Route>
        <Route path="/calendar" element={ <Calendar isLoading={loading} events={events} />}></Route>
        <Route path="/officers" element={<Officers />}></Route>
        <Route path="/faqs" element={<FAQs />}></Route>
        <Route path="/dashboard" element={<Dashboard
              student={student}
              isLoading={loading}
              events={events}
            />}></Route>
        <Route path="/attendance" element={<Attendance isLoading={loading} student={student}/>}></Route>
        <Route path="/projects" element={<Projects student={student} isLoading={loading}  getStudentNameFromID={getStudentNameFromID}/>}></Route>
        <Route path="/profile" element={<Profile user={user} student={student} isLoading={loading} />}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard
              student={student}
              students={students}
              events={events}
              isLoading={loading}
              announcements={announcements}
              getStudentNameFromID={getStudentNameFromID}
            />}></Route>
        <Route path="/admin-attendance">
            {/* <AdminAttendance
              events={events}
              students={students}
              isLoading={loading}
            /> */}
        </Route>
        <Route path="/admin-projects/NHS">
            {/* <AdminProjects
              events={events}
              students={students}
              isLoading={loading}
            /> */}
        </Route>
        <Route path="/admin-projects/non-NHS">
          {/* <AdminNonNHSProjects /> */}
        </Route>
        <Route path="/admin-settings" element={<AdminSettings students={students} isLoading={loading} />}></Route>
        <Route path="/home" element={ <Home />} />
      </Routes>
    </div>
    
  );
}



export default App;