import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Button, Form, Overlay, Table, Tooltip } from "react-bootstrap";
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
  const [displayEventsAmount, setDisplayEventsAmount] = useState<number>(6);
  const [preDisplayEventsAmount, setPreDisplayEventsAmount] = useState<number>(6);
  const [startShowEventIndex, setStartShowEventIndex] = useState<number>(0);
  const [endShowEventIndex, setEndShowEventIndex] = useState<number>(displayEventsAmount);
  const gradeSelectionOptions= [
    {value: GradeType.Senior, label: "Seniors"},
    {value: GradeType.Junior, label: "Juniors"}
  ];
  const [gradeSelection, setGradeSelection] = useState<SelectionOption>({
    value: GradeType.Senior, 
    label: "Seniors"
  });
  const [showAdminAttendanceSettings, setShowAdminAttendanceSettings] = useState(false);
  const [showDisplayEventsAmountError, setShowDisplayEventsAmountError] = useState(false);

  useEffect(() => {
    setStudentList(students.sort((a, b) => a.name.localeCompare(b.name)));
  }, [students, events, displayEventsAmount]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };
  const settingsTarget = useRef(null);

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
    if ((startShowEventIndex - displayEventsAmount - 1) >= 0) {
      setStartShowEventIndex(startShowEventIndex - displayEventsAmount - 1);
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

    if ((endShowEventIndex + displayEventsAmount) >= events.length) {
      setEndShowEventIndex(events.length);
    } else {
      setEndShowEventIndex(endShowEventIndex + displayEventsAmount);
    } 
  }

  const preDisplayEventAmountsHandler = (e: any) => {
    setPreDisplayEventsAmount(e.target.value);
    if (e.target.value <= events.length && e.target.value > 0) {
      setEndShowEventIndex(startShowEventIndex + e.target.value);
      setShowDisplayEventsAmountError(false);
    } else {
      setShowDisplayEventsAmountError(true);
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
          <button disabled={startShowEventIndex === 0} onClick={reverseEventIndicies}>
            <i className={startShowEventIndex === 0 ? "fas fa-chevron-left ml-5 bg-indigo-300 py-2.5 px-3 rounded-full text-white" : "fas fa-chevron-left ml-5 bg-indigo-400 hover:bg-indigo-500 py-2.5 px-3 rounded-full text-white"}></i>
          </button>
          <div className="flex-grow"></div>
          <div className="flex space-x-3 items-center">
            <ReactSelect defaultValue={gradeSelection} value={gradeSelection} options={gradeSelectionOptions} onChange={gradeSelectionHandler} className="text-black font-bold w-48 text-center text-xl" closeMenuOnSelect={true}/>
            <Button ref={settingsTarget} onClick={() => setShowAdminAttendanceSettings(!showAdminAttendanceSettings)} className="hover:bg-transparent hover:text-black text-black border-0 text-xl">
              {
                showAdminAttendanceSettings ?
                <p className="bg-red-400 px-2 py-0.5 rounded-full text-white">Close</p>
                :<i className="fas fa-cog"></i>
              }

            </Button>
            <Overlay target={settingsTarget.current} show={showAdminAttendanceSettings} placement="bottom">
              <Tooltip>
                <div className="flex flex-col items-center">
                  <p className="font-bold">Events Display Amount:</p>
                  <Form.Control
                  value={preDisplayEventsAmount}
                  onChange={preDisplayEventAmountsHandler}
                  type="text"
                  placeholder=""
                  className="w-1/2 text-center"
                  />
                  {showDisplayEventsAmountError ? <p className="text-red-400">Amount must be greater than 0 and less than or equal to {events.length}</p> : <div></div>}
                </div>
              </Tooltip>
            </Overlay>
          </div>
          <div className="flex-grow"></div>
          <button onClick={advanceEventIndicies} disabled={endShowEventIndex === events.length}>
            <i className={endShowEventIndex === events.length ? "fas fa-chevron-right mr-5 bg-indigo-300 py-2.5 px-3 rounded-full text-white" : "fas fa-chevron-right mr-5 bg-indigo-400 hover:bg-indigo-500 py-2.5 px-3 rounded-full text-white"}></i>
          </button>
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
