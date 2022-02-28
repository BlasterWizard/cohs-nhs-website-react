import React from "react";
import { Modal } from "react-bootstrap";
import { SheetChange, SheetChangeType } from "./AdminAttendance";
import db from "../../firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

interface AdminAttendanceChangesModalProps {
  changes: SheetChange[];
  show: boolean;
  handleClose: () => void;
  setChanges: React.Dispatch<React.SetStateAction<SheetChange[]>>;

}

interface AttendanceChangeNodeProps {
  change: SheetChange;
  changes: SheetChange[];
  setChanges: React.Dispatch<React.SetStateAction<SheetChange[]>>;
}

const AdminAttendanceChangesModal: React.FC<AdminAttendanceChangesModalProps> =
  ({ changes, show, handleClose, setChanges }) => {
    async function submitAttendanceChanges() {
      //delete from Attendance array
      changes.forEach(async (change) => {
        await updateDoc(doc(db, "users", change.studentDocId), {
          attendance: arrayRemove({
            code: change.eventCode,
            didAttend: !change.didAttend,
            projectHours: change.projectHours,
            startDate: change.startDate
          })
        });

        if (change.changeType === SheetChangeType.Addition) {
          console.log("add");
          await updateDoc(doc(db, "users", change.studentDocId), {
            attendance: arrayUnion({
              code: change.eventCode,
              didAttend: change.didAttend,
              projectHours: change.projectHours,
              startDate: change.startDate
            })
          });
        }
      });
      handleClose();
      setChanges([]);
    }

    return (
      <>
        <Modal scrollable={true} show={show} onHide={handleClose} centered>
          <Modal.Header>
            <Modal.Title>Review {changes.length} Proposed Changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-3">
              {changes.length > 0 ? changes.map((change, index) => (
                <AttendanceChangeNode change={change} changes={changes} key={index} setChanges={setChanges}/>
              )) : <p className="font-bold text-center">No Changes</p>}
            </div>         
          </Modal.Body>
          <Modal.Footer>
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
  const deleteChange = () => {
    const copyAttendanceChanges = [...changes];
    copyAttendanceChanges.forEach((copyAttendanceChange) => {
      if (copyAttendanceChange.randId === change.randId) {
        copyAttendanceChange.changeType = SheetChangeType.Deletion;
      }
    });
    setChanges(copyAttendanceChanges);
  }

  return (
    <div className="bg-indigo-100 p-2 rounded-2xl flex items-center space-x-3">
      <p className={change.didAttend ? "bg-emerald-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2" : "bg-red-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2"}>
        {change.didAttend ? "Add" : "Delete"}
      </p>
      <div className="flex flex-col">
        <h4 className="text-md font-bold">{change.studentName}</h4>
        <h6 className="text-sm">{change.eventName}</h6>
      </div>
     
      <div className="flex space-x-2 items-center">
        <p className={change.didAttend ? "bg-red-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2 text-center" : "bg-emerald-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2"}>{change.didAttend ? "Not Present" : "Present"}</p>
        <i className="fas fa-arrow-right"></i>
        <p className={change.didAttend ? "bg-emerald-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2" : "bg-red-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2 text-center"}>{change.didAttend ? "Present" : "Not Present"}</p>
        <button className="bg-red-500 py-1 px-2 rounded-full text-white w-fit text-sm " onClick={deleteChange}>
          <i className="fas fa-minus"></i>
        </button>
      </div>
    </div>
  );
};

export default AdminAttendanceChangesModal;
