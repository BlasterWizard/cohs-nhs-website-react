import React, { useEffect, useState } from "react";
import db from "../../firebase";
import { Badge, Table } from "react-bootstrap";
import { AttendedEvent, Event, Student } from "../../App";
import AdminPagination, {
  AdminPaginationKeys,
} from "../../components/AdminPagination";
import SpinnerNode from "../../components/Spinner";
import {SheetChange } from "../admin-attendance/AdminAttendance";
import AdminProjectChangesModal from "./AdminProjectHoursChangesModal";
import StudentProjectsRow from "./StudentProjectHoursRow";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";

interface AdminProjectsHoursProps {
  events: Event[];
  students: Student[];
  isLoading: boolean;
}

const AdminProjectHours: React.FC<AdminProjectsHoursProps> = ({
  events,
  students,
  isLoading,
}) => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [projectChanges, setProjectChanges] = useState<SheetChange[]>([]);
  const [projectEvents, setProjectEvents] = useState<Event[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setStudentList(students.sort((a, b) => a.name.localeCompare(b.name)));
    setProjectEvents(events.filter((el) => el.hasProjectHours === true));
    console.log("hello");
  }, [students, events]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };

  if (isLoading) {
    return <SpinnerNode />;
  }

  const getCopyOfStudentAttendance = (studentAttendance: AttendedEvent[]) => {
    const studentAttendanceObj: AttendedEvent[] = [];
    studentAttendance.forEach((attendedEvent: AttendedEvent) => {
      studentAttendanceObj.push({
        code: attendedEvent.code,
        localEventName: attendedEvent.localEventName,
        projectHours: attendedEvent.projectHours
          ? attendedEvent.projectHours
          : 0,
        startDate: attendedEvent.startDate,
        didAttend: attendedEvent.didAttend,
      });
    });
    return studentAttendanceObj;
  };

  return (
    <main>
      <h2 className="text-4xl font-bold">Project Hours</h2>
      <AdminPagination defaultActiveKey={AdminPaginationKeys.AdminProjects} />
      <div className="absolute sticky left-5 top-5">
        <p
          className={projectChanges.length > 0 ? "bg-red-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2" : "bg-emerald-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2"}
        >
          {projectChanges.length} Unsaved Changes
        </p>
      </div>
      {/* <AdminProjectsPagination defaultActiveKey={AdminProjectsPaginationKeys.NHS} /> */}
      <div className="bg-white/60 p-2 rounded-2xl flex flex-col items-center mt-3">
        <h3 className="font-bold text-3xl text-center">Seniors</h3>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Row</th>
              <th>Special ID</th>
              <th>Student Name</th>
              {projectEvents.map((event, index) => (
                <th key={index} className="text-center">{event.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentList.map((student, index) => (
              <StudentProjectsRow
                key={index}
                student={student}
                events={projectEvents}
                rowNum={index + 1}
                projectChanges={projectChanges}
                setProjectChanges={setProjectChanges}
              />
            ))}
          </tbody>
        </Table>
        <button className="bg-emerald-400 hover:bg-emerald-500 py-2 px-3 rounded-full font-bold text-white" onClick={handleShow}>
          Update
        </button>
        <AdminProjectChangesModal
          projectChanges={projectChanges}
          setProjectChanges={setProjectChanges}
          show={show}
          handleClose={handleClose}
        />
      </div>
    </main>
  );
};

export default AdminProjectHours;
