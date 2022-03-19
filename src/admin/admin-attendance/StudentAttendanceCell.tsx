import { connected } from "process";
import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Event, Student } from "../../App";
import { StudentSheetChange, SheetChangeType, SheetChange } from "./AdminAttendance";

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
  const [originalValue, setOriginalValue] = useState<boolean>(false);
  const [checkedBoxValue, setCheckedBoxValue] = useState<boolean>(false);

  useEffect(() => {
    setCheckboxFromFirebase();
  }, [student?.attendance]);

  useEffect(() => {
    if (changes.filter((change) => change.student.specialId === student.specialId).length === 0) {
      setCheckboxFromFirebase();
    }
  }, [changes]);

  const setCheckboxFromFirebase = () => {
    for(var i = 0; i < student.attendance.length; i++) {
      if (event.code === student.attendance[i].code) {
        if (student.attendance[i].didAttend) {
          setCheckedBoxValue(true);
          setOriginalValue(true);
        } else {
          setCheckedBoxValue(false);
          setOriginalValue(false);
        }
      }
    }
  }


  const onCheckedBoxChanged = (e: any) => {
    setCheckedBoxValue(!checkedBoxValue);

    //set up projectHours for attendanceChangedObj
    let projectHoursForEvent = 0;
    const studentAttendedEventArray = student.attendance.filter((attendedEvent) => attendedEvent.code === event.code)
    if (studentAttendedEventArray.length != 0) {
      projectHoursForEvent = studentAttendedEventArray[0].projectHours;
    }

    const attendanceChangeObj: SheetChange = {
      originalValue: originalValue,
      didAttend: !checkedBoxValue,
      newProjectHours: projectHoursForEvent,
      event: event
    };

    let copyChanges = [...changes];
    const arrayContainingStudentSheetChange = copyChanges.filter((change) => change.student.specialId === student.specialId);
    if (arrayContainingStudentSheetChange.length === 0 && e.target != null) {
      //can't find StudentSheetChange for student, create one 
      copyChanges.push({
        student: student,
        sheetChanges: [attendanceChangeObj]
      })
    } else {
      //try to find student sheet change matching this cell
      const studentSheetChangeIndex = copyChanges.indexOf(arrayContainingStudentSheetChange[0]);
      const studentSheetChange = copyChanges[studentSheetChangeIndex];

      //find event SheetChange
      const arrayContainingEventSheetChange = studentSheetChange.sheetChanges.filter((sheetchange) => sheetchange.event.code === event.code);
      const eventSheetChangeIndex = studentSheetChange.sheetChanges.indexOf(arrayContainingEventSheetChange[0]);
      console.log(arrayContainingEventSheetChange);
      if (arrayContainingEventSheetChange.length === 0) {
        //create new sheet change for cell
        copyChanges[studentSheetChangeIndex].sheetChanges.push(attendanceChangeObj);
      } else {
        //modify existing sheet change entry 
        //check to see if new change is the same as original value if so, delete from sheet changes 
        if (!checkedBoxValue === originalValue) {
          studentSheetChange.sheetChanges.splice(eventSheetChangeIndex, 1);
        } else {
          //if not the same as original, modify 
          studentSheetChange.sheetChanges[eventSheetChangeIndex].didAttend = !checkedBoxValue;
        }
      }
    }
    console.log(copyChanges);
    setChanges(copyChanges);
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