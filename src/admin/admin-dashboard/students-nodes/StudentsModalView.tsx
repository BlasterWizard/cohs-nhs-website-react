import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Student } from '../../../App';

interface StudentsModalViewProps {
    students: Student[];
    show: boolean;
    handleClose: () => void;
}

interface StudentNodeProps {
    student: Student;
}

const StudentsModalView: React.FC<StudentsModalViewProps> = ({ students, show, handleClose }) => {
    return (
        <Modal size="lg" centered show={show} scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title>
            {students.length} {students.length === 1 ? "Student" : "Students"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {students.length > 0 ?  <div className="space-y-3 flex flex-col items-center">
            {students.map((student, index) => (
                <StudentNode key={index} student={student} />
            ))}
          </div> : <p className="font-bold">No Students</p>}
         
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

const StudentNode: React.FC<StudentNodeProps> = ({ student }) => {
    const [studentGradeText, setStudentGradeText] = useState<string>("");
  
    useEffect(() => {
      determineStudentGradeText();
    }, [student]);
  
    const determineStudentGradeText = () => {
      switch (student.grade) {
        case 12:
          setStudentGradeText("Senior");
          break;
        case 11:
          setStudentGradeText("Junior");
          break;
        case 10:
          setStudentGradeText("Sophomore");
          break;
      }
    };
  
    return (
      <div className="bg-indigo-100 w-1/2 py-2 px-4 rounded-2xl flex flex-row space-x-4 items-center">
         <p className="bg-blue-300 py-1 px-2 rounded-full font-bold flex items-center text-sm">
          {studentGradeText}
        </p>
  
        <div className="flex-1 flex-row align-items">
          <h4 className="text-lg font-bold">{student.name}</h4>
          <h6>
            <strong>Special ID:</strong> {student.specialId}
          </h6>
        </div>
      </div>
    );
  };

  export default StudentsModalView;