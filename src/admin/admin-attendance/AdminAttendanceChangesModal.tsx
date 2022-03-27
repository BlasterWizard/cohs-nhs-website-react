import React from "react";
import { Modal } from "react-bootstrap";
import { StudentSheetChange, SheetChange } from "./AdminAttendance";
import db from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import Collapsible from "react-collapsible";
import DropdownHeader, { DropdownHeaderStates } from "../../components/DropdownHeader";
import toast from "react-hot-toast";

interface AdminAttendanceChangesModalProps {
  changes: StudentSheetChange[];
  show: boolean;
  handleClose: () => void;
  setChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
  totalAttendanceSheetChanges: number;

}

interface AttendanceChangeNodeProps {
  change: StudentSheetChange;
  changes: StudentSheetChange[];
  setChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
}

interface AttendanceSheetChangeNodeProps {
  attendanceSheetChange: SheetChange;
  change: StudentSheetChange;
  changes: StudentSheetChange[];
  setChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
}


const AdminAttendanceChangesModal: React.FC<AdminAttendanceChangesModalProps> =
  ({ changes, show, handleClose, setChanges, totalAttendanceSheetChanges}) => {
    async function submitAttendanceChanges() {
      changes.forEach(async (change) => {
        var studentAttendanceArray = change.student.attendance;
        change.sheetChanges.forEach((attendanceSheetChange) => {
          const attendanceSheetChangeInStudentAttendanceArray = studentAttendanceArray.filter((attendedEvent) => attendedEvent.code === attendanceSheetChange.event.code);
          const attendedEventObj = {
            code: attendanceSheetChange.event.code,
            localEventName: attendanceSheetChange.event.name,
            didAttend: attendanceSheetChange.didAttend = attendanceSheetChange.didAttend,
            projectHours: attendanceSheetChange.newProjectHours,
            startDate: attendanceSheetChange.startDate ?? new Date()
          }
          if (attendanceSheetChangeInStudentAttendanceArray.length === 0) {
            //push to studentAttendanceArray
            studentAttendanceArray.push(attendedEventObj);
          } else {
            const attendanceSheetChangeEventInStudentAttendanceArrayIndex = studentAttendanceArray.indexOf(attendanceSheetChangeInStudentAttendanceArray[0]);
            //modify studentAttendanceArray
            studentAttendanceArray[attendanceSheetChangeEventInStudentAttendanceArrayIndex] = attendedEventObj;
          }
        });
        console.log(studentAttendanceArray);
        await updateDoc(doc(db, "users", change.student.docId), {
          attendance: studentAttendanceArray
        }).then(() => {
          
        }).catch((error) => {
          toast.error(error.message);
        });
      });

      handleClose();
      setChanges([]);
    }

    return (
      <>
        <Modal scrollable={true} show={show} onHide={handleClose} centered>
          <Modal.Header>
            <Modal.Title>Review {totalAttendanceSheetChanges} Proposed Changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-3">
              {changes.length > 0 ? changes.map((change, index) => (
                <AttendanceChangeNode change={change} changes={changes} key={index} setChanges={setChanges}/>
              )) : <p className="font-bold text-center">No Changes</p>}
            </div>         
          </Modal.Body>
          <Modal.Footer>
          {<button className="bg-blue-400 hover:bg-blue-500 p-2 rounded-lg text-white font-bold" onClick={() => setChanges([])}>
              Clear All
            </button>}
            <div className="flex-grow"></div>
            {<button className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white font-bold" onClick={handleClose}>
              Close
            </button>}
            {<button className="bg-emerald-400 hover:bg-emerald-500 p-2 rounded-lg text-white font-bold" onClick={submitAttendanceChanges}>
              Save Changes
            </button>}
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const AttendanceChangeNode: React.FC<AttendanceChangeNodeProps> = ({ change, changes, setChanges }) => {
    return (
      <Collapsible trigger={
      <DropdownHeader
        text={change.student.name}
        ddState={DropdownHeaderStates.Closed}
        list={change.sheetChanges}
        style={"bg-blue-200/60 p-1 px-2 rounded-md"}
      />}
      triggerWhenOpen={
        <DropdownHeader
          text={change.student.name}
          ddState={DropdownHeaderStates.Open}
          list={change.sheetChanges}
          style={"bg-blue-200/60 p-1 px-2 rounded-md"}
        />
      }
      >
        <div className="space-y-3 bg-indigo-100/40 p-2 rounded-md">     
        {
          change.sheetChanges.map((attendanceSheetChange: SheetChange, index: number) => {
            return <AttendanceSheetChangeNode attendanceSheetChange={attendanceSheetChange} change={change} changes={changes} setChanges={setChanges} key={index}/>;
          })
        }
        </div>
      </Collapsible>
    );
  };

  const AttendanceSheetChangeNode: React.FC<AttendanceSheetChangeNodeProps> = ({attendanceSheetChange, change, changes, setChanges}) => {

    const deleteProjectHoursChangeNode = () => {
      let copyChanges = [...changes];
      copyChanges.forEach((studentChange) => {
        if (studentChange.student.specialId === change.student.specialId) {
          change.sheetChanges.forEach((sheetchange) => {
            if (sheetchange.event.code === attendanceSheetChange.event.code) {
              //check to see if sheetChanges for studentChange is 0, if so delete studentChange 
              if (studentChange.sheetChanges.length - 1 === 0) {
                //delete studentChange from copyChanges
                copyChanges.splice(copyChanges.indexOf(change), 1);
              } else {
                //delete sheetChange from studentChange.sheetChanges
                studentChange.sheetChanges.splice(studentChange.sheetChanges.indexOf(sheetchange), 1);
              }
            }
          });
        }
      });
     setChanges(copyChanges);
    }
  
    return (
      <div className="bg-indigo-100/80 p-2 rounded-md flex items-center space-x-3">
        {attendanceSheetChange.originalValue === false ? <p className="text-white bg-emerald-300 rounded-full py-0.5 px-2 font-bold text-sm">Add</p> : <p className="text-white bg-red-400 rounded-full py-0.5 px-2 font-bold text-sm">Delete</p>}
        <p>{attendanceSheetChange.event.name}</p>
        <p className={attendanceSheetChange.originalValue ? "bg-emerald-400 px-2 rounded-full font-bold text-white" : "bg-red-400 px-2 rounded-full font-bold text-white"}>{attendanceSheetChange.originalValue ? "Present" : "Absent"}</p>
        <i className="fas fa-chevron-right text-black"></i>
        <p className={attendanceSheetChange.didAttend ? "bg-emerald-400 px-2 rounded-full font-bold text-white" : "bg-red-400 px-2 rounded-full font-bold text-white"}>{attendanceSheetChange.didAttend ? "Present" : "Absent"}</p>
        <div className="flex-grow"></div>
        <button className="bg-red-500 hover:bg-red-600 py-1 px-2 rounded-full text-white w-fit text-sm " onClick={deleteProjectHoursChangeNode}>
          <i className="fas fa-minus"></i>
        </button>
      </div>
    );
  }
  

export default AdminAttendanceChangesModal;
