import React from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { SheetChange, SheetChangeType } from "../admin-attendance/AdminAttendance";
import db from "../../firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

interface AdminProjectChangesModalProps {
  projectChanges: SheetChange[];
  setProjectChanges: React.Dispatch<React.SetStateAction<SheetChange[]>>;
  show: boolean;
  handleClose: () => void;
}

interface ProjectHoursChangeNodeProps {
  projectHourChange: SheetChange;
  projectChanges: SheetChange[];
  setProjectChanges: React.Dispatch<React.SetStateAction<SheetChange[]>>;
}

const AdminProjectHoursChangesModal: React.FC<AdminProjectChangesModalProps> =
  ({ projectChanges, setProjectChanges, show, handleClose }) => {

  //push changes to firebase
  async function uploadProjectHoursChanges() {
    projectChanges.forEach(async (projectHourChange) => {
      await updateDoc(doc(db, "users", projectHourChange.studentDocId), {
        attendance: arrayRemove({
          code: projectHourChange.eventCode,
          didAttend: !projectHourChange.didAttend,
          projectHours: projectHourChange.projectHours,
          startDate: projectHourChange.startDate
        })
      });

      if (projectHourChange.changeType === SheetChangeType.Addition) {
        console.log("add");
        await updateDoc(doc(db, "users", projectHourChange.studentDocId), {
          attendance: arrayUnion({
            code: projectHourChange.eventCode,
            didAttend: projectHourChange.didAttend,
            projectHours: projectHourChange.projectHours,
            startDate: projectHourChange.startDate
          })
        });
      }
    })
    handleClose();
    setProjectChanges([]);
  };
  
    return (
      <>
        <Modal scrollable={true} show={show} onHide={handleClose} centered>
          <Modal.Header>
            <Modal.Title>Review {projectChanges.length} Proposed Changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {projectChanges.length > 0 ? projectChanges.map((projectChange, index) => (
              <ProjectHoursChangeNode projectHourChange={projectChange} projectChanges={projectChanges} setProjectChanges={setProjectChanges} key={index} />
            )) : <p className="font-bold text-center">No Changes</p>}
          </Modal.Body>
          <Modal.Footer>
            {<button className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white font-bold" onClick={handleClose}>
              Close
            </button>}
            {<button className="bg-emerald-400 hover:bg-emerlald-500 p-2 rounded-lg text-white font-bold" onClick={uploadProjectHoursChanges}>
              Save Changes
            </button>}
          </Modal.Footer>
        </Modal>
      </>
    );
  };

const ProjectHoursChangeNode: React.FC<ProjectHoursChangeNodeProps> = ({ projectHourChange, projectChanges, setProjectChanges }) => {
  const deleteProjectHoursChangeNode = () => {
    console.log("delete");
    const copyProjectChanges = [...projectChanges];
    copyProjectChanges.forEach((copyProjectChange) => {
      if (copyProjectChange.randId === projectHourChange.randId) {
        copyProjectChange.changeType = SheetChangeType.Deletion
        ;
      }
    });
    setProjectChanges(copyProjectChanges);
    console.log(projectChanges)
  }
  return (
    <div className="bg-indigo-100 p-2 rounded-2xl flex items-center space-x-3">
      <p className={projectHourChange.didAttend ? "bg-emerald-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2" : "bg-red-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2"}>
        {projectHourChange.didAttend ? "Add" : "Delete"}
      </p>
      <div className="flex flex-col">
        <h4 className="text-md font-bold">{projectHourChange.studentName}</h4>
        <h6 className="text-sm">{projectHourChange.eventName}</h6>
      </div>
     
      <div className="flex space-x-2 items-center">
        <p className={projectHourChange.didAttend ? "bg-red-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2 text-center" : "bg-emerald-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2"}>{projectHourChange.didAttend ? "Not Present" : "Present"}</p>
        <i className="fas fa-arrow-right"></i>
        <p className={projectHourChange.didAttend ? "bg-emerald-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2" : "bg-red-400 px-2 py-0.5 rounded-full w-fit text-sm text-white font-bold h-1/2 text-center"}>{projectHourChange.didAttend ? "Present" : "Not Present"}</p>
        <button className="bg-red-500 py-1 px-2 rounded-full text-white w-fit text-sm " onClick={deleteProjectHoursChangeNode}>
          <i className="fas fa-minus"></i>
        </button>
      </div>
    </div>
  );
};

export default AdminProjectHoursChangesModal;
