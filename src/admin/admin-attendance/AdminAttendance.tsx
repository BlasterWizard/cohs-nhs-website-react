import React, { useState } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import {Event, Student } from "../../App";
import AdminPagination, {
  AdminPaginationKeys,
} from "../../components/AdminPagination";
import SpinnerNode from "../../components/Spinner";
import StudentRow from "./StudentRow";
import AdminAttendanceChangesModal from "./AdminAttendanceChangesModal";
import GradeSelectionDropdown from "../../components/GradeSelectionDropdown";
import { SelectionOption } from "../admin-dashboard/events-nodes/AdminEditEventModal";

interface AdminAttendanceProps {
  events: Event[];
  students: Student[];
  isLoading: boolean;
}

export enum SheetChangeType {
  Addition,
  Deletion
}

export interface StudentSheetChange {
  student: Student;
  sheetChanges: SheetChange[];
}

export interface SheetChange {
  event: Event;
  originalValue: boolean | number;
  didAttend: boolean;
  newProjectHours: number;
  startDate?: Date;
}

export enum GradeType {
  Senior,
  Junior
}

const AdminAttendance: React.FC<AdminAttendanceProps> = ({
  events,
  students,
  isLoading,
}) => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [changes, setChanges] = useState<StudentSheetChange[]>([]);
  const [totalAttendanceSheetChanges, setTotalAttendanceSheetChanges] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [tableGradeSelection, setTableGradeSelection] = useState<SelectionOption>({
    value: GradeType.Senior, 
    label: "Seniors"
});

  useEffect(() => {
    setStudentList(students.sort((a, b) => a.name.localeCompare(b.name)));
  }, [students, events]);

  useEffect(() => {
    calculateTotalAttendanceSheets();
  }, [changes]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };


  const calculateTotalAttendanceSheets = () => {
    var total = 0;
    changes.forEach((change) => {
      total += change.sheetChanges.length;
    })
    setTotalAttendanceSheetChanges(total);
  }

  if (isLoading) {
    return <SpinnerNode />;
  }

  return (
    <main>
      <h2 className="text-4xl font-bold">Attendance</h2>
      <AdminPagination defaultActiveKey={AdminPaginationKeys.AdminAttendance} />
      <div className="absolute sticky left-5 top-5 m-3">
        <p
          className={totalAttendanceSheetChanges > 0 ? "bg-red-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2 z-10" : "bg-emerald-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2 z-10"}
        >
          {totalAttendanceSheetChanges} Unsaved Changes
        </p>
      </div>
        
      <GradeSelectionDropdown gradeSelection={tableGradeSelection} setGradeSelection={setTableGradeSelection} />
      <Table striped bordered hover responsive className="bg-white/60 p-2 rounded-2xl">
        <thead>
          <tr>
            <th>Row</th>
            <th>Special ID</th>
            <th>Student Name</th>
            {events.map((event, index) => (
              event.code.substring(0,2) != "NN" && <th key={index}>{event.name}</th>
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
        totalAttendanceSheetChanges={totalAttendanceSheetChanges}
      />
    </main>
  );
};
export default AdminAttendance;
