import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import db from "../../firebase";
import { Button, Form, Modal } from "react-bootstrap";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Student } from "../../App";

interface AddStudentNonNHSHoursModalProps {
    handleClose: () => void;
    show: boolean;
    student: Student;
}

const AddStudentNonNHSHoursModal: React.FC<AddStudentNonNHSHoursModalProps> = ({ show, handleClose, student }) => {
    const [nonNHSProjectName, setNonNHSProjectName] = useState("");
    const [numOfNonNHSHours, setNumOfNonNHSHours] = useState("");
    const [startDate, setStartDate] = useState(new Date());
  
    useEffect(() => {
      setNonNHSProjectName("");
      setNumOfNonNHSHours("");
      setStartDate(new Date());
    }, [show]);
  
    const nonNHSProjectNameHandler = (e: any) => {
      setNonNHSProjectName(e.target.value);
    }
  
    const numOfNonNHSHoursHandler = (e: any) => {
      if (!isNaN(e.target.value)) {
        setNumOfNonNHSHours(e.target.value);
      }
    }
  
    const addNonNHSHours = async() => {
        if (nonNHSProjectName === "" || parseInt(numOfNonNHSHours) === 0) {
            toast.error("Fields can not be empty");
        } else {
            let NNEventCount = 0
            student.attendance.forEach((attendedEvent) => {
                if (attendedEvent.code.substring(0, 2) == "NN") {
                NNEventCount += 1;
                }
            });
        
            await updateDoc(doc(db, "users", student.docId), {
                attendance: arrayUnion({
                code: "NN" + NNEventCount.toString(),
                localEventName: nonNHSProjectName,
                projectHours: parseInt(numOfNonNHSHours),
                startDate: startDate
                })
            }).then(() => {
                toast.success("Added NON-NHS Hours!");
                handleClose();
            }).catch(() => {
                toast.error("Can't add NON-NHS Hours");
            });
        }
    }
  
    
  
    return (
      <Modal size="lg" centered show={show}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add Non-NHS Hours to <span className="font-bold">{student.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-5">
            <div>
              <p className="font-bold">Project Name:</p>
              <Form.Control
                  value={nonNHSProjectName}
                  onChange={nonNHSProjectNameHandler}
                  type="text"
                  placeholder=""
                  className="w-1/2"
                />
            </div>
  
            <hr/>
  
            <div>
              <p className="font-bold">Number of Non-NHS Hours:</p>
              <Form.Control
                  value={numOfNonNHSHours.toString()}
                  onChange={numOfNonNHSHoursHandler}
                  type="text"
                  placeholder=""
                  className="w-1/4 text-center"
                />
            </div>
  
            <hr/>
  
            <p className="font-bold">Date: </p>
              <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              className="bg-blue-100 border-black border-solid border-2 rounded-full px-2"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bg-red-500 hover:bg-red-600 font-bold text-white"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 font-bold text-white"
            onClick={addNonNHSHours}
          >
            Add Hours
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  export default AddStudentNonNHSHoursModal;
  