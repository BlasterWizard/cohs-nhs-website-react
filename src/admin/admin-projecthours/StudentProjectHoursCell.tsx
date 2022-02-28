import React, { useState } from "react";
import { useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import toast from "react-hot-toast";
import { AttendedEvent, Event, Student } from "../../App";
import { SheetChange, SheetChangeType } from "../admin-attendance/AdminAttendance";


interface StudentProjectHoursCellProps {
  event: Event;
  index: number;
  student: Student;
  projectChanges: SheetChange[];
  setProjectChanges: React.Dispatch<React.SetStateAction<SheetChange[]>>;
}

const StudentProjectHoursCell: React.FC<StudentProjectHoursCellProps> = ({
  event,
  index,
  student,
  projectChanges,
  setProjectChanges,
}) => {
  const [projectHoursValue, setProjectHoursValue] = useState<string>("");

  useEffect(() => {
    student.attendance.forEach((attendedEvent) => {
      if (event.code === attendedEvent.code && event.hasProjectHours) {
        if (attendedEvent.projectHours) {
          setProjectHoursValue(attendedEvent.projectHours.toString());
        }
      }
    });
  }, [student?.attendance]);

  useEffect(() => {
    setNewChangedValue();
  }, [projectChanges]);

  const setNewChangedValue = () => {
    for(var i = 0; i < projectChanges.length; i++) {
      if (projectChanges[i].eventCode === event.code && projectChanges[i].studentDocId === student.docId) {
        //Check to see if delete from modal 
        if (projectChanges[i].changeType === SheetChangeType.Deletion) {
          setProjectChanges(projectChanges.filter((el) => el.randId !== projectChanges[i].randId));
          return 
        }
        setProjectHoursValue(projectChanges[i].projectHours === 0 ? "" : projectChanges[i].projectHours.toString());
        return
      } 
    }
  }

  const onProjectHoursValueChanged = (e: any) => {
    var options: SheetChange[] = [...projectChanges];
    var addAttendanceChangeObj: boolean = true;

    const attendanceChangeObj = {
      studentDocId: student.docId,
      eventCode: event.code,
      projectHours: e.target.value === "" ? 0 : parseInt(e.target.value),
      eventName: event.name,
      studentName: student.name,
      startDate: event.startDate,
      randId: Math.random() * 1000000,
      changeType: SheetChangeType.Addition,
      didAttend: isStudentChangeEventInStudentAttendance(student.attendance, event.code)
    };
    
    if (!isNaN(e.target.value)) {
      setProjectHoursValue(e.target.value);
       // //TODO: Check to see if there's an previous opposition operation on the same cell.
      // //TODO: If so, do not update current change to options and delete the opposition operation
      options.forEach((option) => {
        if (
          option.eventCode === attendanceChangeObj.eventCode &&
          option.studentDocId === attendanceChangeObj.studentDocId 
        ) {
          if (e.target.value !== "") {
            console.log("not NAN");
            option.projectHours = parseInt(e.target.value);
          } else {
            console.log("NAN");
            const indexOfAddChange = options.indexOf(option);
            options.splice(indexOfAddChange, 1);
          }
          addAttendanceChangeObj = false;
        }
      });

      if (addAttendanceChangeObj) {
        options.push(attendanceChangeObj);
      }

      setProjectChanges(options);
    } else {
      toast.error("Entry must be a number");
    }
  };

  const isStudentChangeEventInStudentAttendance = (studentAttendance: AttendedEvent[], eventCode: string):boolean => {
    for (var i = 0; i < studentAttendance.length; i++) {
      if (studentAttendance[i].code === eventCode) {
        return true;
      } 
    }
    return false;
  }

  return (
    <td key={index}>
      <div className="flex justify-center">
        <OverlayTrigger placement="top" overlay={
          <Tooltip>{student.name}</Tooltip>
        }>
          <input
          type="text"
          value={projectHoursValue}
          onChange={onProjectHoursValueChanged}
          className="rounded-lg w-10 text-center"
        />
        </OverlayTrigger>
      </div>
    </td>
  );
};

export default StudentProjectHoursCell;
