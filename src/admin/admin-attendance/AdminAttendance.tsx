import React, { useState } from "react";
import { useEffect } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import { AttendedEvent, Event, Student } from "../../App";
import AdminPagination, {
  AdminPaginationKeys,
} from "../../components/AdminPagination";
import SpinnerNode from "../../components/Spinner";
import StudentRow from "./StudentRow";
import toast from "react-hot-toast";
import AdminAttendanceChangesModal from "./AdminAttendanceChangesModal";
import db from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

interface AdminAttendanceProps {
  events: Event[];
  students: Student[];
  isLoading: boolean;
}

export enum SheetChangeType {
  Addition,
  Deletion
}

export interface SheetChange {
  studentDocId: string;
  studentName: string;
  eventCode: string;
  eventName: string;
  randId: number;
  startDate?: Date;
  didAttend: boolean;
  projectHours: number;
  changeType: SheetChangeType
}

const AdminAttendance: React.FC<AdminAttendanceProps> = ({
  events,
  students,
  isLoading,
}) => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [changes, setChanges] = useState<SheetChange[]>([]);
  const [sortingOrderButtonState, setSortingOrderButtonState] =
    useState<boolean>(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setStudentList(students.sort((a, b) => a.name.localeCompare(b.name)));
  }, [students, events]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };

  if (isLoading) {
    return <SpinnerNode />;
  }

  const changeStudentSortingOrder = () => {
    sortingOrderButtonState
      ? setStudentList(
          studentList.sort((a, b) =>
            b.name.split(" ")[1].localeCompare(a.name.split(" ")[1])
          )
        )
      : setStudentList(students.sort((a, b) => a.name.localeCompare(b.name)));
    setSortingOrderButtonState(!sortingOrderButtonState);
  };

  return (
    <main>
      <h2 className="text-4xl font-bold">Admin Attendance</h2>
      <AdminPagination defaultActiveKey={AdminPaginationKeys.AdminAttendance} />
      <div className="absolute sticky left-5 top-5">
        <p
          className={changes.length > 0 ? "bg-red-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2" : "bg-emerald-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2"}
        >
          {changes.length} Unsaved Changes
        </p>
      </div>
        
      <div className="bg-white/60 p-2 rounded-2xl flex flex-col items-center mt-3">
        <h3 className="font-bold text-3xl text-center">Seniors</h3>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Row</th>
              <th>Special ID</th>
              <th>Student Name</th>
              {events.map((event, index) => (
                <th key={index}>{event.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentList.map((student, index) => (
              <StudentRow
                key={index}
                student={student}
                events={events}
                rowNum={index + 1}
                changes={changes}
                setChanges={setChanges}
              />
            ))}
          </tbody>
        </Table>
        <button className="bg-emerald-400 hover:bg-emerald-500 py-2 px-3 rounded-full font-bold text-white" onClick={handleShow}>
          Update
        </button>
        <AdminAttendanceChangesModal
          changes={changes}
          show={show}
          handleClose={handleClose}
          setChanges={setChanges}
        />
      </div>
    </main>
  );
};
export default AdminAttendance;
