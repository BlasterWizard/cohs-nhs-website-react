import React, { useEffect } from 'react';
import { Event, Student } from '../../App';
import { StudentSheetChange } from './AdminAttendance';
import StudentAttendanceCell from './StudentAttendanceCell';

interface StudentRowProps {
    student: Student;
    events: Event[];
    rowNum: number;
    changes: StudentSheetChange[];
    setChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
}
  
const StudentRow: React.FC<StudentRowProps> = ({
    student,
    rowNum,
    events,
    changes,
    setChanges,
  }) => {

    return (
      <tr>
        <th>{rowNum}</th>
        <td>{student.specialId}</td>
        <td className="font-bold">{student.name}</td>
        {events.map((event, index) => {
          return(event.code.substring(0,2) != "NN" && <StudentAttendanceCell student={student} event={event} key={index} changes={changes} setChanges={setChanges}/>);
        })}
      </tr>
    );
  };
  
export default StudentRow;