import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import {Event, Student } from "../../App";
import AdminPagination, {
  AdminPaginationKeys,
} from "../../components/AdminPagination";
import SpinnerNode from "../../components/Spinner";
import StudentRow from "./StudentRow";
import AdminAttendanceChangesModal from "./AdminAttendanceChangesModal";
import ReactSelect from "react-select";
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
  const [changes, setChanges] = useState<SheetChange[]>([]);
  const [show, setShow] = useState(false);
  const [showEventsAmount, setShowEventsAmount] = useState<number>(6);
  const [startShowEventIndex, setStartShowEventIndex] = useState<number>(0);
  const [endShowEventIndex, setEndShowEventIndex] = useState<number>(showEventsAmount);
  const gradeSelectionOptions= [
    {value: GradeType.Senior, label: "Seniors"},
    {value: GradeType.Junior, label: "Juniors"}
  ];
  const [gradeSelection, setGradeSelection] = useState<SelectionOption>({
    value: GradeType.Senior, 
    label: "Seniors"
  });

  useEffect(() => {
    setStudentList(students.sort((a, b) => a.name.localeCompare(b.name)));
  }, [students, events]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };

  const gradeSelectionHandler = (e: any) => {
    switch(e.value) {
      case GradeType.Senior:
        setGradeSelection(gradeSelectionOptions[0]);
        break;
      case GradeType.Junior:
        setGradeSelection(gradeSelectionOptions[1]);
        break;
    }
  }

  const reverseEventIndicies = () => {
    if ((startShowEventIndex - showEventsAmount - 1) >= 0) {
      setStartShowEventIndex(startShowEventIndex - showEventsAmount - 1);
    } else {
      setStartShowEventIndex(0);
    }

    if (startShowEventIndex != 0) {
      setEndShowEventIndex(startShowEventIndex);
    }
  }

  const advanceEventIndicies = () => {
    //endShowEventIndex is exclusive 
    if (endShowEventIndex != events.length) {
      setStartShowEventIndex(endShowEventIndex);
    }

    if ((endShowEventIndex + showEventsAmount) >= events.length) {
      setEndShowEventIndex(events.length);
    } else {
      setEndShowEventIndex(endShowEventIndex + showEventsAmount);
    } 
  }

  if (isLoading) {
    return <SpinnerNode />;
  }

  return (
    <main>
      <h2 className="text-4xl font-bold">Attendance</h2>
      <AdminPagination defaultActiveKey={AdminPaginationKeys.AdminAttendance} />
      <div className="absolute sticky left-5 top-5">
        <p
          className={changes.length > 0 ? "bg-red-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2" : "bg-emerald-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2"}
        >
          {changes.length} Unsaved Changes
        </p>
      </div>
        
      <div className="bg-white/60 p-2 rounded-2xl flex flex-col items-center mt-3">
        <div className="flex items-center w-full my-3">
          <button onClick={reverseEventIndicies}><i className="fas fa-chevron-left ml-5 bg-indigo-400 hover:bg-indigo-500 py-2.5 px-3 rounded-full text-white"></i></button>
          <div className="flex-grow"></div>
          <div className="flex space-x-3 items-center">
            <ReactSelect defaultValue={gradeSelection} value={gradeSelection} options={gradeSelectionOptions} onChange={gradeSelectionHandler} className="text-black font-bold w-48 text-center text-xl" closeMenuOnSelect={true}/>
            <Button className="text-black border-0 text-xl"><i className="fas fa-cog"></i></Button>
          </div>
          <div className="flex-grow"></div>
          <button onClick={advanceEventIndicies}><i className="fas fa-chevron-right mr-5 bg-indigo-400 hover:bg-indigo-500 py-2.5 px-3 rounded-full text-white"></i></button>
        </div>
       
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Row</th>
              <th>Special ID</th>
              <th>Student Name</th>
              {events.slice(startShowEventIndex, endShowEventIndex).map((event, index) => (
                <th key={index}>{event.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentList.map((student, index) => (
              <StudentRow
                key={index}
                student={student}
                events={events.slice(startShowEventIndex, endShowEventIndex)}
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
