import React, {useEffect, useState} from 'react';
import { Student } from '../../../App';
import toast from "react-hot-toast";
import db from "../../../firebase";
import { Form, Modal, Button } from 'react-bootstrap';
import { addDoc, collection } from "firebase/firestore";

interface AddStudentModalViewProps {
    students: Student[];
    show: boolean;
    handleClose: () => void;
}

const AddStudentModalView: React.FC<AddStudentModalViewProps> = ({
    students,
    show,
    handleClose
  }) => {
    const [newStudentName, setNewStudentName] = useState<string>("");
    const [newStudentGrade, setNewStudentGrade] = useState<number>();
    const [newStudentID, setNewStudentID] = useState("");

    useEffect(() => {
      setNewStudentID(generateNewStudentId);
    }, []);
  
    const newStudentNameHandler = (e: any) => {
      setNewStudentName(e.target.value);
    };
  
    const newStudentGradeHandler = (e: any) => {
      setNewStudentGrade(parseInt(e.target.value));
    }
  
    async function addNewStudent() {
        if (newStudentName === "") {
            toast.error("Student Name can not be empty");
        } else if (newStudentGrade !== 12 && newStudentGrade !== 11 && newStudentGrade !== 10) {
            toast.error("Student Grade can not be empty");
        } else {
          const newStudentData = {
            announcements: [],
            name: newStudentName,
            specialId: newStudentID,
            attendance: [],
            grade: newStudentGrade,
            isAdmin: false,
            myProjects: [],
            nonNHSHoursSubmitted: [],
          };

          await addDoc(collection(db, "users"), newStudentData).then(() => {
            toast.success("Created new student");
          }).catch(() => {
            toast.error("Unable to create new student");
          });
        }
    };
  
    const generateNewStudentId = ():string => {
        const newStudentId: number = Math.round(Math.random() * 10000000000);
          //check to see if student id is taken
          students.forEach((student) => {
              if (parseInt(student.specialId) === newStudentId) {
                  generateNewStudentId();
              }
          });
        return newStudentId.toString();
    };
  
    return (

      <Modal size="lg" centered show={show}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add New Student
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-5">
            <p className="font-bold">Student Name:</p>
            <Form.Control
              value={newStudentName}
              onChange={newStudentNameHandler}
              type="text"
              placeholder=""
              className="w-1/2"
            />

            <hr/>

            <p className="font-bold">Student Grade Level:</p>
            <Form.Control value={newStudentGrade} onChange={newStudentGradeHandler} aria-label="Default select example" as="select" className="w-1/2">
              <option>Select Grade Level</option>
              <option value="12">Senior</option>
              <option value="11">Junior</option>
              <option value="10">Sophomore</option>
            </Form.Control>

            <hr />

            <p><span className="font-bold">NHS COHS ID:</span> {newStudentID}</p>
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
            onClick={handleClose}
          >
            Add Student
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

export default AddStudentModalView;
  