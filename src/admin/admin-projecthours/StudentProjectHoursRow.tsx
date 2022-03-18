import React, { useEffect } from "react";
import { Event, Student } from "../../App";
import { StudentSheetChange } from "../admin-attendance/AdminAttendance";
import StudentProjectCell from "./StudentProjectHoursCell";

interface StudentProjectHoursRowProps {
    student: Student;
    events: Event[];
    rowNum: number;
    projectChanges: StudentSheetChange[];
    setProjectChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
}

const StudentProjectHoursRow: React.FC<StudentProjectHoursRowProps> = ({ student, events, rowNum, projectChanges, setProjectChanges}) => {
  return (
    <tr>
      <th>{rowNum}</th>
      <td>{student.specialId}</td>
      <td className="font-bold">{student.name}</td>
      {events.map((event, index) => {
        return (
        <StudentProjectCell student={student} event={event} key={index} index={index} projectChanges={projectChanges} setProjectChanges={setProjectChanges}/>
        );
      })}
    </tr>
  );
};

export default StudentProjectHoursRow;
