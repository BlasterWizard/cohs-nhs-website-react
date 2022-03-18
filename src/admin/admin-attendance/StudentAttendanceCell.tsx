import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Event, Student } from "../../App";
import { StudentSheetChange, SheetChangeType } from "./AdminAttendance";

interface StudentAttendanceCellProps {
  event: Event;
  index: number;
  student: Student;
  changes: StudentSheetChange[];
  setChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
}

const StudentAttendanceCell: React.FC<StudentAttendanceCellProps> = ({
  student,
  event,
  index,
  changes,
  setChanges,
}) => {
  const [checkedBoxValue, setCheckedBoxValue] = useState<boolean>(false);

  useEffect(() => {
    for(var i = 0; i < student.attendance.length; i++) {
      if (event.code === student.attendance[i].code) {
        if (student.attendance[i].didAttend) {
          setCheckedBoxValue(true);
        } else {
          setCheckedBoxValue(false);
        }
      }
    }
  }, [student?.attendance]);

  // const setNewChangedValue = () => {
  //   for(var i = 0; i < changes.length; i++) {
  //     if (changes[i].eventCode === event.code && changes[i].studentDocId === student.docId) {
  //       //Check to see if delete from modal 
  //       if (changes[i].changeType === SheetChangeType.Deletion) {
  //         console.log("Delete");
  //         setCheckedBoxValue(!checkedBoxValue);
  //         setChanges(changes.filter((el) => el.randId !== changes[i].randId));
  //         return
  //       }
  //       setCheckedBoxValue(changes[i].didAttend!);
  //       return
  //     } 
  //   }
  // }

  const onCheckedBoxChanged = (e: any) => {
 
  };

  return (
    <td key={index}>
      <div className="flex justify-center">
        <OverlayTrigger placement="top" overlay={
          <Tooltip>{student.name}</Tooltip>
        }>
          <input
            type="checkbox"
            checked={checkedBoxValue}
            onChange={onCheckedBoxChanged}
          ></input>     
        </OverlayTrigger>
        
        {/* <span className="student-name-attendance-cell">{student.name}</span> */}
      </div>
    </td>
  );
};

export default StudentAttendanceCell;