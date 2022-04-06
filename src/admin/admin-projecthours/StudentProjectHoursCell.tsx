import React, { useState } from "react";
import { useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import toast from "react-hot-toast";
import { Event, Student } from "../../App";
import { StudentSheetChange, SheetChange } from "../admin-attendance/AdminAttendance";


interface StudentProjectHoursCellProps {
  event: Event;
  student: Student;
  projectChanges: StudentSheetChange[];
  setProjectChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
}

const StudentProjectHoursCell: React.FC<StudentProjectHoursCellProps> = ({
  event,
  student,
  projectChanges,
  setProjectChanges,
}) => {
  const [originalProjectHoursValue, setOriginalProjectHoursValue] = useState<number>(0); //internal purposes. not UI
  const [newProjectHoursValue, setProjectHoursValue] = useState<string>("");

  useEffect(() => {
   fetchProjectHoursValueInStudentAttendance();
  }, [student?.attendance]);

  useEffect(() => {
    projectChangesOnChange();
  }, [projectChanges])

  const projectChangesOnChange = () => {
    if (projectChanges.length === 0) {
      setProjectHoursValue(originalProjectHoursValue === 0 ? "" : originalProjectHoursValue.toString());
      fetchProjectHoursValueInStudentAttendance();
    } else {
      for (var i = 0; i < projectChanges.length; i++) {
        if (projectChanges[i].student.specialId === student.specialId) {
          for (var j = 0; j < projectChanges[i].sheetChanges.length; j++) {
            let sheetChange = projectChanges[i].sheetChanges[j];
            if (sheetChange.event.code === event.code) {
              setProjectHoursValue(sheetChange.newProjectHours === 0 ? "" : sheetChange.newProjectHours!.toString());
              return;
            }
          }
          //can't find event in student sheet changes
          setProjectHoursValue(originalProjectHoursValue === 0 ? "" : originalProjectHoursValue.toString());
          fetchProjectHoursValueInStudentAttendance();
          break;
        }
      }
    }
  }

  const fetchProjectHoursValueInStudentAttendance = () => {
    student.attendance.forEach((attendedEvent) => {
      if (event.code === attendedEvent.code && event.hasProjectHours) {
        setProjectHoursValue(attendedEvent.projectHours === 0 ? "" : attendedEvent.projectHours.toString());
        setOriginalProjectHoursValue(attendedEvent.projectHours === 0 ? 0 : attendedEvent.projectHours);
      }
    });
  }

  const onProjectHoursValueChanged = (e: any) => {
    if (!isNaN(e.target.value)) {
      setProjectHoursValue(e.target.value);
      const parsedEnteredValue = e.target.value === "" ? 0 : parseInt(e.target.value);

      let didAttendForEvent = false;
      const studentAttendedEventArray = student.attendance.filter((attendedEvent) => attendedEvent.code === event.code)
      if (studentAttendedEventArray.length != 0) {
        didAttendForEvent = studentAttendedEventArray[0].didAttend ?? false;
      }

      const projectHoursChangeObj: SheetChange = {
        originalValue: originalProjectHoursValue!,
        newProjectHours: parsedEnteredValue,
        didAttend: didAttendForEvent,
        event: event
      };

      let studentsSheetChange = [...projectChanges];
      const thisStudentSheetChangeArray = studentsSheetChange.filter((studentSheetChange) => studentSheetChange.student.specialId === student.specialId)
      //find if there's existing StudentSheetChange entry, if not create one
      if (thisStudentSheetChangeArray.length === 0) {
        studentsSheetChange.push({
          student: student,
          sheetChanges: [projectHoursChangeObj]
        });
      } else {
        //else update existing StudentSheetChange entry
        const indexOfThisStudentSheetChange = studentsSheetChange.indexOf(thisStudentSheetChangeArray[0]);
        //TODO: Check to see if new value is back to originalValue, if so delete StudentSheetChange
        for (var i = 0; i < studentsSheetChange[indexOfThisStudentSheetChange].sheetChanges.length; i++) {
          //find specific SheetChange for project cell
          const priorEditProjectHours = studentsSheetChange[indexOfThisStudentSheetChange].sheetChanges.filter((sheetChange) => sheetChange.event.code === event.code);
          if (priorEditProjectHours.length === 0) {
            //if no, append projectHoursChangeObj to studentsSheetChange
            studentsSheetChange[indexOfThisStudentSheetChange].sheetChanges.push(projectHoursChangeObj);
          } else {
            const priorEditProjectHoursIndex = studentsSheetChange[indexOfThisStudentSheetChange].sheetChanges.indexOf(priorEditProjectHours[0]);
            //check if entered value is the same as original value, if so delete
            if (studentsSheetChange[indexOfThisStudentSheetChange].sheetChanges[priorEditProjectHoursIndex].originalValue === parsedEnteredValue) {
              studentsSheetChange[indexOfThisStudentSheetChange].sheetChanges.splice(priorEditProjectHoursIndex, 1);
              if (studentsSheetChange[indexOfThisStudentSheetChange].sheetChanges.length === 0) {
                studentsSheetChange.splice(indexOfThisStudentSheetChange, 1);
              }
              break;
            } else {
              //if not the same, change projectHours
              studentsSheetChange[indexOfThisStudentSheetChange].sheetChanges[priorEditProjectHoursIndex].newProjectHours = parsedEnteredValue;
            }
          }
        }
      }
     setProjectChanges(studentsSheetChange);
    } else {
      toast.error("Entered Value must be a valid number");
    }
  };

  return (
    <td>
      <div className="flex justify-center w-full">
        <OverlayTrigger placement="top" overlay={
          <Tooltip>{student.name}</Tooltip>
        }>
          <input
          type="text"
          value={newProjectHoursValue}
          onChange={onProjectHoursValueChanged}
          className="rounded-lg w-14 text-center"
        />
        </OverlayTrigger>
      </div>
    </td>
  );
};

export default StudentProjectHoursCell;
