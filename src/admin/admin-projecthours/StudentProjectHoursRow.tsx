import React, {useEffect, useState } from "react";
import { Event, Student } from "../../App";
import { StudentSheetChange } from "../admin-attendance/AdminAttendance";
import AddStudentNonNHSHoursModal from "./AddStudentNonNHSHoursModal";
import ShowAllStudentNonNHSHoursModal from "./ShowStudentNonNHSHoursModal";
import StudentProjectHoursCell from "./StudentProjectHoursCell";


interface StudentProjectHoursRowProps {
    student: Student;
    events: Event[];
    rowNum: number;
    projectChanges: StudentSheetChange[];
    setProjectChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
}

const StudentProjectHoursRow: React.FC<StudentProjectHoursRowProps> = ({ student, events, rowNum, projectChanges, setProjectChanges}) => {
  const [viewStudentNonNHSHours, setViewStudentNonNHSHours] = useState(false);
  const [addStudentNonNHSHours, setAddStudentNonNHSHours] = useState(false);
  const [studentTotalNonNHSHours, setStudentTotalNonNHSHours] = useState(0);

  useEffect(() => {
    calculateStudentTotalNonNHSHours();
  }, [student.attendance])
  
  const toggleViewStudentNonNHSHours = () => {
    setViewStudentNonNHSHours(!viewStudentNonNHSHours);
  }

  const toggleAddStudentNonNHSHours = () => {
    setAddStudentNonNHSHours(!addStudentNonNHSHours);
  }

  const calculateStudentTotalNonNHSHours = () => {
    let totalNonNHSHours = 0;
    student.attendance.forEach((attendedEvent) => {
      if (attendedEvent.code.substring(0,2) === "NN") {
        totalNonNHSHours += attendedEvent.projectHours;
      }
    });
    setStudentTotalNonNHSHours(totalNonNHSHours);
  }

  return (
    <tr>
      <th>{rowNum}</th>
      <td>{student.specialId}</td>
      <td className="font-bold">{student.name}</td>
      <td className="text-center flex items-center">
        <p>{studentTotalNonNHSHours}</p>
        <div className="flex-grow"></div>
        <div className="space-x-3">
          <button onClick={toggleAddStudentNonNHSHours}>
          <i className="fa-solid fa-plus hover:text-green-400"></i>
          </button>
          <button onClick={toggleViewStudentNonNHSHours}>
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
        </div>
      </td>
      {events.map((event, index) => {
        <StudentProjectHoursCell student={student} index={index} event={event} projectChanges={projectChanges} setProjectChanges={setProjectChanges}/>
      })}
      <AddStudentNonNHSHoursModal show={addStudentNonNHSHours} handleClose={toggleAddStudentNonNHSHours} student={student}/>
      <ShowAllStudentNonNHSHoursModal show={viewStudentNonNHSHours} handleClose={toggleViewStudentNonNHSHours} student={student}/>
    </tr>
  );
};

export default StudentProjectHoursRow;



