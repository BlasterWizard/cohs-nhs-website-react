import React from 'react';
import { Event, Student } from '../../App';
import { SheetChange } from './AdminAttendance';
import StudentAttendanceCell from './StudentAttendanceCell';

interface StudentRowProps {
    student: Student;
    events: Event[];
    rowNum: number;
    changes: SheetChange[];
    setChanges: React.Dispatch<React.SetStateAction<SheetChange[]>>;
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
          return(<StudentAttendanceCell student={student} event={event} key={index} index={index} changes={changes} setChanges={setChanges}/>);
        })}
      </tr>
    );
  };
  
export default StudentRow;