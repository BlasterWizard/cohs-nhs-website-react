import React, { useState } from "react";
import { useEffect } from "react";
import { Badge, Form } from "react-bootstrap";
import { Student } from "../../../App";
import AddStudentModalView from "./AddStudentModalView";
import NewStudentModalView from "./AddStudentModalView";
import StudentsModalView from "./StudentsModalView";

interface AdminStudentsDashboardProps {
  students: Student[];
}

const AdminStudentsDashboard: React.FC<AdminStudentsDashboardProps> = ({
  students,
}) => {
  const [showStudentsView, setShowStudentsView] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const toggleShowStudentsView = () => {
    showStudentsView ? setShowStudentsView(false) : setShowStudentsView(true);
  }

  const toggleShowAddStudentModal = () => {
    showAddStudentModal ? setShowAddStudentModal(false) : setShowAddStudentModal(true);
  }

  useEffect(() => {
    // setStudentList(students.sort((a, b) => a.name.localeCompare(b.name)));
  }, [students]);


  return (
    <div className="bg-white/60 p-5 rounded-2xl flex flex-col items-center">
      <h3 className="text-2xl font-bold">Student Dashboard</h3>
      <div className="space-y-3 flex flex-col mt-3">
        <button className="bg-indigo-400 py-1 px-3 rounded-full font-bold text-white" onClick={toggleShowStudentsView}>
          View All Students <span className="bg-white/60 py-0.5 px-2 text-black rounded-full">{students.length}</span>
        </button>
        <button className="bg-green-400 py-1 px-2 rounded-full font-bold text-white" onClick={toggleShowAddStudentModal}>
          Add New Student
        </button>
      </div>
      <StudentsModalView show={showStudentsView} handleClose={toggleShowStudentsView} students={students} />
      <AddStudentModalView show={showAddStudentModal} handleClose={toggleShowAddStudentModal} students={students} />
    </div>
  );
};

export default AdminStudentsDashboard;
