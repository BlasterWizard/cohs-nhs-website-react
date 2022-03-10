import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Event, Student } from "../../App";
import { SheetChange, SheetChangeType } from "./AdminAttendance";

interface StudentAttendanceCellProps {
  event: Event;
  index: number;
  student: Student;
  changes: SheetChange[];
  setChanges: React.Dispatch<React.SetStateAction<SheetChange[]>>;
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
    setNewChangedValue();
  }, [changes]);
  

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

  const setNewChangedValue = () => {
    for(var i = 0; i < changes.length; i++) {
      if (changes[i].eventCode === event.code && changes[i].studentDocId === student.docId) {
        //Check to see if delete from modal 
        if (changes[i].changeType === SheetChangeType.Deletion) {
          console.log("Delete");
          setCheckedBoxValue(!checkedBoxValue);
          setChanges(changes.filter((el) => el.randId !== changes[i].randId));
          return
        }
        setCheckedBoxValue(changes[i].didAttend);
        return
      } 
    }
  }

  const onCheckedBoxChanged = (e: any) => {
    console.log(changes);
    var options: SheetChange[] = [...changes];
    var addAttendanceChangeObj: boolean = true;

    const attendanceChangeObj = {
      studentDocId: student.docId,
      eventCode: event.code,
      didAttend: e.target.checked,
      eventName: event.name,
      studentName: student.name,
      randId: Math.random() * 1000000,
      startDate: event.startDate,
      changeType: SheetChangeType.Addition,
      projectHours: getAttendedEventProjectHours()
    };

    setCheckedBoxValue(e.target.checked);
    //TODO: Check to see if there's an previous opposition operation on the same cell.
    //TODO: If so, do not update current change to options and delete the opposition operation
    options.forEach((option) => {
      if (
        option.eventCode === attendanceChangeObj.eventCode &&
        option.studentDocId === attendanceChangeObj.studentDocId &&
        option.didAttend === !attendanceChangeObj.didAttend 
      ) {
        console.log("false");
        const indexOfAddChange = options.indexOf(option);
        options.splice(indexOfAddChange, 1);
        addAttendanceChangeObj = false;
      }
    });

    if (addAttendanceChangeObj) {
      options.push(attendanceChangeObj);
    }

    setChanges(options);
  };

  const getAttendedEventProjectHours = (): number => {
    for (var i = 0; i < student.attendance.length; i++) {
      if (student.attendance[i].code === event.code) {
        return student.attendance[i].projectHours
      }
    }
    return 0
  }

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