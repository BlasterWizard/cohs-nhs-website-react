import React, { useState } from "react";
import { Event, Student } from "../../../App";
import AdminEditEventModal from "./AdminEditEventModal";
import db from "../../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import AdminEventDetailView from "./AdminEventDetailView";

interface AdminEventNodeProps {
  event: Event;
  students: Student[];
  getStudentNameFromID: (id:string) => string;
}

interface AdminEventsViewProps {
  show: boolean;
  handleClose: () => void;
  events: Event[];
  students: Student[];
  getStudentNameFromID: (id:string) => string;
}

const AdminEventsView: React.FC<AdminEventsViewProps> = ({
  show,
  events,
  handleClose,
  students,
  getStudentNameFromID
}) => {
  return (
    <Modal size="lg" centered show={show}>
      <Modal.Header closeButton>
        <Modal.Title>
          {events.length} {events.length === 1 ? "Event" : "Events"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-3">
          {events.map((event: Event, index: number) => (
            <AdminEventNode key={index} event={event} students={students} getStudentNameFromID={getStudentNameFromID}/>
          ))}
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
};

const AdminEventNode: React.FC<AdminEventNodeProps> = ({ event, students, getStudentNameFromID }) => {
  const [show, setShow] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);

  const toggleModalShow = () => {
    show ? setShow(false) : setShow(true);
  };

  const toggleDetailModalShow = () => {
    showDetailView ? setShowDetailView(false) : setShowDetailView(true);
  };

  async function deleteEvent() {
    console.log(event.docId);
    await deleteDoc(doc(db, "events-Data", event.docId));

    //delete Event from every student
    students.forEach(async (student) => {
      const studentAttendance = student.attendance.filter(
        (el) => el.code !== event.code
      );
      await updateDoc(doc(db, "students", student.docId), {
        attendance: studentAttendance,
      });
    });
    console.log("deleted!");
  }

  return (
    <div className="bg-indigo-100 p-2 rounded-lg flex flex-row w-full items-center">
      <div className="flex space-x-3 items-center">
        <h6>
          {event.startDate ? event.startDate.toLocaleDateString("en-US") : ""}
        </h6>
        <h4 className="flex-1 text-center">
          <strong className="text-sm sm:text-lg">{event.name}</strong>
        </h4>
      </div>

      <div className="flex-grow"></div>

      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 items-center justify-center sm:space-x-3">
        <button
          className="bg-sky-300 hover:bg-sky-400 rounded-full p-1 px-2"
          onClick={toggleDetailModalShow}
        >
          <h3 className="text-white font-bold">Info</h3>
        </button>
        <button
          className="bg-rose-400 hover:bg-rose-500 rounded-full px-2.5"
          onClick={deleteEvent}
        >
          <i className="fas fa-minus text-white"></i>
        </button>
        <button className="bg-indigo-400 hover:bg-indigo-500 py-0.5 px-2 rounded-full text-white" onClick={toggleModalShow}>
          <h3 className="font-bold">Edit</h3>
        </button>
      </div>
      {show ? <AdminEditEventModal
        show={show}
        event={event}
        students={students}
        handleShow={toggleModalShow}
        getStudentNameFromID={getStudentNameFromID}
      /> : <div></div> }
      <AdminEventDetailView show={showDetailView} handleClose={toggleDetailModalShow} event={event} getStudentNameFromID={getStudentNameFromID}/>
    </div>
  );
};

export default AdminEventsView;
