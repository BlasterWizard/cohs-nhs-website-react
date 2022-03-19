import React from "react";
import { Modal } from "react-bootstrap";
import { SheetChange, StudentSheetChange } from "../admin-attendance/AdminAttendance";
import db from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import Collapsible from "react-collapsible";
import DropdownHeader, { DropdownHeaderStates } from "../../components/DropdownHeader";

interface AdminProjectChangesModalProps {
  projectChanges: StudentSheetChange[];
  setProjectChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
  show: boolean;
  handleClose: () => void;
  totalProjectHoursSheetChanges: number;
}

interface ProjectHoursChangeNodeProps {
  studentSheetChange: StudentSheetChange;
  projectChanges: StudentSheetChange[];
  setProjectChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
}

interface ProjectHoursSheetChangeNodeProps {
  sheetChange: SheetChange;
  studentSheetChange: StudentSheetChange;
  projectChanges: StudentSheetChange[];
  setProjectChanges: React.Dispatch<React.SetStateAction<StudentSheetChange[]>>;
}

const AdminProjectHoursChangesModal: React.FC<AdminProjectChangesModalProps> =
  ({ projectChanges, setProjectChanges, show, handleClose, totalProjectHoursSheetChanges }) => {

  //push changes to firebase
  async function uploadProjectHoursChanges() {
    console.log(projectChanges);
    projectChanges.forEach(async (projectChange) => {
      var studentAttendanceArray = projectChange.student.attendance;
      projectChange.sheetChanges.forEach((studentSheetChange) => {
        let studentSheetChangeInStudentAttendanceArray = studentAttendanceArray.filter((attendedEvent) => attendedEvent.code === studentSheetChange.event.code);
        if (studentSheetChangeInStudentAttendanceArray.length === 0) {
          studentAttendanceArray.push({
            code: studentSheetChange.event.code,
            localEventName: studentSheetChange.event.name,
            projectHours: studentSheetChange.newProjectHours,
            didAttend: studentSheetChange.didAttend,
            startDate: studentSheetChange.startDate ?? new Date()
          });
        } else {
          let studentSheetChangeInStudentAttendanceArrayIndex = studentAttendanceArray.indexOf(studentSheetChangeInStudentAttendanceArray[0]);
          studentAttendanceArray[studentSheetChangeInStudentAttendanceArrayIndex].projectHours = studentSheetChange.newProjectHours!;
        }
      });
      console.log(studentAttendanceArray);
      await updateDoc(doc(db, "users", projectChange.student.docId), {
        attendance: studentAttendanceArray
      }).then(() => {
        
      }).catch((error) => {
        toast.error(error.message);
      });
    });

    handleClose();
    setProjectChanges([]);
  }
  
    return (
      <>
        <Modal scrollable={true} show={show} onHide={handleClose} centered>
          <Modal.Header>
            <Modal.Title>Review {totalProjectHoursSheetChanges} Proposed Changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-3">
              {projectChanges.length > 0 ? projectChanges.map((studentSheetChange, index) => (
                <ProjectHoursChangeNode studentSheetChange={studentSheetChange} projectChanges={projectChanges} setProjectChanges={setProjectChanges} key={index} />
              )) : <p className="font-bold text-center">No Changes</p>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {<button className="bg-sky-400 hover:bg-sky-500 p-2 rounded-lg text-white font-bold" onClick={() => setProjectChanges([])}>
              Clear All
            </button>}
            <div className="flex-grow"></div>
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

const ProjectHoursChangeNode: React.FC<ProjectHoursChangeNodeProps> = ({ studentSheetChange, projectChanges, setProjectChanges }) => {
  return (
    <Collapsible trigger={
    <DropdownHeader
      text={studentSheetChange.student.name}
      ddState={DropdownHeaderStates.Closed}
      list={studentSheetChange.sheetChanges}
      style={"bg-blue-200/60 p-1 px-2 rounded-md"}
    />}
    triggerWhenOpen={
      <DropdownHeader
        text={studentSheetChange.student.name}
        ddState={DropdownHeaderStates.Open}
        list={studentSheetChange.sheetChanges}
        style={"bg-blue-200/60 p-1 px-2 rounded-md"}
      />
    }
    >
      <div className="space-y-3 bg-indigo-100/40 p-2 rounded-md">     
      {
        studentSheetChange.sheetChanges.map((sheetChange: SheetChange, index: number) => {
          return <ProjectHoursSheetChangeNode studentSheetChange={studentSheetChange} sheetChange={sheetChange} key={index} projectChanges={projectChanges} setProjectChanges={setProjectChanges} />;
        })
      }
      </div>
    </Collapsible>
  );
};

const ProjectHoursSheetChangeNode: React.FC<ProjectHoursSheetChangeNodeProps> = ({sheetChange, studentSheetChange, projectChanges, setProjectChanges}) => {

  const deleteProjectHoursChangeNode = () => {
    var copyProjectChanges = [...projectChanges];
    for (var i = 0; i < copyProjectChanges.length; i++) {
      if (copyProjectChanges[i].student.specialId === studentSheetChange.student.specialId) {
        for (var j = 0; j < copyProjectChanges[i].sheetChanges.length; j++) {
          if (copyProjectChanges[i].sheetChanges[j].event.code === sheetChange.event.code) {
            copyProjectChanges[i].sheetChanges.splice(copyProjectChanges[i].sheetChanges.findIndex((singleSheetChange) => singleSheetChange.event.code === sheetChange.event.code),1);
            break;
          }
        }
      }
    }
    setProjectChanges(copyProjectChanges.filter((studentSheetChange) => studentSheetChange.sheetChanges.length > 0).length === 0 ? [] : copyProjectChanges);
  }

  return (
    <div className="bg-indigo-100/80 p-2 rounded-md flex items-center space-x-3">
      {sheetChange.originalValue === 0 ? <p className="text-white bg-emerald-300 rounded-full py-0.5 px-2 font-bold text-sm">New</p> : <p className="text-white bg-yellow-300 rounded-full py-0.5 px-2 font-bold text-sm">Edit</p>}
      <p>{sheetChange.event.name}</p>
      {sheetChange.originalValue === 0 ? "" : 
          <p className="bg-blue-200 px-2 rounded-full font-bold">{sheetChange.originalValue}</p>
      }
      {sheetChange.originalValue === 0 ? "" : 
        <i className="fas fa-chevron-right text-black"></i>
      }
      <p className="bg-blue-200 px-2 rounded-full font-bold">{sheetChange.newProjectHours}</p>
      <div className="flex-grow"></div>
      <button className="bg-red-500 hover:bg-red-600 py-1 px-2 rounded-full text-white w-fit text-sm " onClick={deleteProjectHoursChangeNode}>
        <i className="fas fa-minus"></i>
      </button>
    </div>
  );
}



export default AdminProjectHoursChangesModal;
