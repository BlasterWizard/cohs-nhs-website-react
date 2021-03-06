import { useState, useEffect } from "react";
import { Badge, Nav, Navbar } from "react-bootstrap";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import db from "./firebase";
import { getAuth, onAuthStateChanged, signOut, UserCredential } from "firebase/auth";
import toast from "react-hot-toast";
import Signup from "./pages/home/Signup";
import { query, collection, onSnapshot, doc, Timestamp } from "firebase/firestore";
import ToasterNode from "./components/ToasterNode";
import Dashboard from "./dashboard/Dashboard";
import FAQs, { FAQNode } from "./pages/FAQs";
import Officers from "./pages/Officers";
import Calendar from "./pages/calendar/Calendar";
import Profile from "./dashboard/profile/Profile";
import Attendance from "./dashboard/Attendance";
import Projects from "./dashboard/Projects";
import AdminDashboard from "./admin/admin-dashboard/AdminDashboard";
import AdminSettings from "./admin/AdminSettings";
import AdminAttendance from "./admin/admin-attendance/AdminAttendance";
import AdminProjectHours from "./admin/admin-projecthours/AdminProjectsHours";


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
  dates: [Timestamp];
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
  userImage?: string
}

export interface OfficerDescription {
  position: string;
}

export interface Setting {
  seniorsRequiredHours: number | null;
  juniorsRequiredHours: number | null;
}

export interface TermDates {
  term1StartDate: Date;
  term1EndDate: Date;
  term2StartDate: Date;
  term2EndDate: Date;
  term3StartDate: Date;
  term3EndDate: Date;
  term4StartDate: Date;
  term4EndDate: Date;
}

function App() {
  const auth = getAuth();
  var [user, setUser] = useState<UserCredential["user"]>();
  var [student, setStudent] = useState<Student>();
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState<Setting>({
    seniorsRequiredHours: null,
    juniorsRequiredHours: null
  });
  const [termDates, setTermDates] = useState<TermDates>();
  const [faqs, setFAQs] = useState<FAQNode[]>([]);
  const localStorage = window.localStorage;


  useEffect(() => {
    fetchAllStudentsFromFirestore();
    authUser();
  }, [user]);

  function authUser() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
        fetchEventsFromFirestore();
        fetchAnnouncementsFromFirestore();
        fetchSettings();
        fetchFAQs();
        localStorage.setItem("isLoggedIn", "true");
      } else {
        // User is signed out
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("isAdmin");
      }
    });
  }

  async function fetchSettings() {
    setLoading(true);
    const unsubscribeToSettings = onSnapshot(doc(db, "settings", "requiredHours"), (doc) => {
      if (doc.data() != undefined) {
        setSettings({
          seniorsRequiredHours: doc.data()!.seniorsRequiredHours,
          juniorsRequiredHours: doc.data()!.juniorsRequiredHours
        });
      }
    });

    const unsubscribeToTermDates = onSnapshot(doc(db, "settings", "termDates"), (doc) => {
      if (doc.data() != undefined) {
        const {
            term1StartDate, 
            term1EndDate, 
            term2StartDate, 
            term2EndDate, 
            term3StartDate, 
            term3EndDate, 
            term4StartDate, 
            term4EndDate} = doc.data()!;
        setTermDates({
          term1StartDate: new Date(term1StartDate.toDate()),
          term1EndDate: new Date(term1EndDate.toDate()),
          term2StartDate: new Date(term2StartDate.toDate()),
          term2EndDate: new Date(term2EndDate.toDate()),
          term3StartDate: new Date(term3StartDate.toDate()),
          term3EndDate: new Date(term3EndDate.toDate()),
          term4StartDate: new Date(term4StartDate.toDate()),
          term4EndDate: new Date(term4EndDate.toDate())
        });
      }
    });
    setLoading(false);
  }

  async function fetchFAQs() {
    var items: FAQNode[] = [];
    const FAQsQS = await query(collection(db, "faqs"))
    const unsubscribeToFAQsQS = onSnapshot(FAQsQS, (querySnapshot) => {
      items = [];
      querySnapshot.forEach((doc) => {
        const {title, content, link} = doc.data();
        if (link != undefined) {
         items.push({
          title: title,
          content: content,
          link: {
            title: link.title,
            url: link.url
          },
          docId: doc.id
         });
        } else {
          items.push({
            title: title,
            content: content,
            docId: doc.id
          });
        }
      });
      setFAQs(items);
    });
  }

  async function fetchAnnouncementsFromFirestore() {
    setLoading(true);
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
      window.location.href = "/";
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
      items.sort((a, b) => a.startDate.getTime()-b.startDate.getTime());
    });
    setEvents(items);
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
            studentUID: studentData.UID ?? "",
            userImage: studentData.userImage ?? ""
          };
          items.push(studentObj);
  
          if (user?.uid != undefined && studentData.studentUID === user?.uid) {
            setStudent(studentObj);
            localStorage.setItem("isAdmin", studentData.isAdmin ? "true" : "false");
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
      if (students[i].docId === id) {
        return students[i];
      }
    }
  }

  if (!window.navigator.onLine) {
    return <p>No Internet</p>
  } 

  return (
    <div>
      <ToasterNode />
      <Navbar expand="sm" className="flex items-center p-3">
        <Navbar.Brand className="font-bold flex items-center space-x-2">
          COHS NHS{" "}
          <Badge className="bg-blue-500 p-1 text-white font-bold rounded-full ml-2">
            BETA
          </Badge>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="flex space-x-5 ml-4 items-center">
          <Nav className="mr-auto flex ml-4">
            {!JSON.parse(localStorage.getItem("isLoggedIn")!) && <Nav.Link href="/">Home</Nav.Link>} 
            {JSON.parse(localStorage.getItem("isLoggedIn")!) && <Nav.Link href="/calendar">Calendar</Nav.Link>}
            {JSON.parse(localStorage.getItem("isLoggedIn")!) && <Nav.Link href="/officers">Officers</Nav.Link>}
            {JSON.parse(localStorage.getItem("isLoggedIn")!) && <Nav.Link href="/faqs">FAQs</Nav.Link>}
            {JSON.parse(localStorage.getItem("isLoggedIn")!) && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
          </Nav>
          <Nav className="flex-grow">
          {!JSON.parse(localStorage.getItem("isLoggedIn")!) && <Nav.Link href="/signup">Signup</Nav.Link>}
          </Nav>
          <Nav className="space-x-5 flex flex-row items-center">
            {JSON.parse(localStorage.getItem("isLoggedIn")!) && (
              <Nav.Link className="bg-red-500 rounded-lg p-2">
                <button onClick={signoutHandler}><p className="font-bold text-white">Logout</p></button>
              </Nav.Link>
            )}
            {JSON.parse(localStorage.getItem("isAdmin")!) && JSON.parse(localStorage.getItem("isLoggedIn")!) && (
              <Nav.Link className="bg-emerald-300 font-bold rounded-lg p-2 text-center" href="/admin-dashboard">
                Admin Portal
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>


      
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Routes>
        <Route path="/signup" element={JSON.parse(localStorage.getItem("isLoggedIn")!) && student ? <Navigate to="/dashboard" /> : <Signup students={students}/>}> </Route>
        <Route path="/calendar" element={ <Calendar isLoading={loading} events={events} />}></Route>
        <Route path="/officers" element={<Officers />}></Route>
        <Route path="/faqs" element={<FAQs faqs={faqs}/>}></Route>
        <Route path="/dashboard" element={
            <Dashboard
              student={student}
              isLoading={loading}
              events={events}
              settings={settings}
            /> }></Route>
        <Route path="/attendance" element={<Attendance isLoading={loading} student={student} events={events}/>}></Route>
        <Route path="/projects" element={<Projects student={student} isLoading={loading}  getStudentObjectFromID={getStudentObjectFromID}/>}></Route>
        <Route path="/profile" element={<Profile user={user} student={student} isLoading={loading} />}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard
              student={student}
              students={students}
              events={events}
              isLoading={loading}
              announcements={announcements}
              getStudentNameFromID={getStudentNameFromID}
              getStudentObjectFromID={getStudentObjectFromID}
              settings={settings}
              faqs={faqs}
            />}></Route>
        <Route path="/admin-attendance" element={ <AdminAttendance
              events={events}
              students={students}
              isLoading={loading}
            />}></Route>
        <Route path="/admin-projects/NHS" element={<AdminProjectHours
              events={events}
              students={students}
              isLoading={loading}
            />}></Route>
        <Route path="/admin-projects/non-NHS">
          {/* <AdminNonNHSProjects /> */}
        </Route>
        <Route path="/admin-settings" element={<AdminSettings students={students} termDates={termDates} isLoading={loading} />}></Route>
        <Route path="/" element={JSON.parse(localStorage.getItem("isLoggedIn")!) && student ? <Navigate to="/dashboard" /> : <Home />} />
      </Routes>
    </div>
    
  );
}



export default App;