import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import db from "../../firebase";
import { Button, Form, Modal } from "react-bootstrap";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AttendedEvent, Student } from "../../App";

interface ShowAllStudentNonNHSHoursModalProps {
    handleClose: () => void;
    show: boolean;
    student: Student;
}

interface NNEventNodeProps {
    NNEvent: AttendedEvent;
    student: Student;
    handleClose: () => void;
}

const ShowAllStudentNonNHSHoursModal: React.FC<ShowAllStudentNonNHSHoursModalProps> = ({ show, handleClose, student }) => {
    const [studentNNEvents, setStudentNNEvents] = useState<AttendedEvent[]>([]);

    useEffect(() => {
        queryStudentNNEvents();
    }, [student.attendance]);

    const queryStudentNNEvents = () => {
        setStudentNNEvents(student.attendance.filter((attendedEvent) => attendedEvent.code.substring(0,2) === "NN"));
    }

    return (
      <Modal size="lg" centered show={show}>
        <Modal.Header closeButton>
          <Modal.Title>
            View Non-NHS Hours for <span className="font-bold">{student.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-5">
            {
                studentNNEvents.length != 0 ? 
                studentNNEvents.map((NNEvent, index) => {
                    return <NNEventNode key={index} NNEvent={NNEvent} student={student} handleClose={handleClose}/>;
                }) :
                <p className="text-center">No Non NHS Events</p>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bg-red-500 hover:bg-red-600 font-bold text-white"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const NNEventNode: React.FC<NNEventNodeProps> = ({NNEvent, student, handleClose}) => {
    const deleteNonNHSEvent = async() => {
        await updateDoc(doc(db, "users", student.docId), {
            attendance: arrayRemove({
                code: NNEvent.code,
                localEventName: NNEvent.localEventName,
                projectHours: NNEvent.projectHours,
                startDate: NNEvent.startDate
            })
        }).then(() => {
            toast.success("Non NHS Event Deleted");
            handleClose();
        }).catch(() => {
            toast.error("Can not delete Non NHS Event");
        });
    }

    return (
        <div className="bg-indigo-100/80 p-2 rounded-md flex items-center space-x-3">
            <p className="font-bold">{NNEvent.localEventName}</p>
            <p className="bg-blue-200 px-2 rounded-full">{NNEvent.projectHours}</p>
            <div className="flex-grow"></div>
            <button className="bg-red-500 hover:bg-red-600 py-1 px-2 rounded-full text-white w-fit text-sm" onClick={deleteNonNHSEvent}>
            <i className="fas fa-minus"></i>
            </button>
      </div>
    );
  }

  export default ShowAllStudentNonNHSHoursModal;
  