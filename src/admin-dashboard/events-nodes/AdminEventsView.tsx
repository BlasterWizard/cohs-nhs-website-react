import React, { useState } from "react";
import { Event, Student } from "../../App";
import AdminEditEventModal from "./AdminEditEventModal";
import db from "../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";

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
    //   <Modal scrollable={true} show={show} centered>
    //     <Modal.Header>
    //       <Modal.Title
    //         id="contained-modal-title-vcenter"
    //         className="font-bold"
    //       >{event.name}</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       <h6>{event.description}</h6>
    //       <h6>
    //         <strong>Start Date & Time:</strong>
    //       </h6>
    //       <div className="start-date-time">
    //         <div className="event-date-time">
    //           <i className="fas fa-calendar-day"></i>
    //           <h6>
    //             {event.startDate
    //               ? event.startDate.toLocaleDateString("en-US")
    //               : ""}
    //           </h6>
    //         </div>
    //         <div className="event-date-time">
    //           <i className="fas fa-clock"></i>
    //           <h6>
    //             {event.startDate
    //               ? event.startDate.toLocaleTimeString([], { timeStyle: "short" })
    //               : ""}
    //           </h6>
    //         </div>
    //       </div>

    //       <h6>
    //         <strong>End Date & Time:</strong>
    //       </h6>
    //       <div className="end-date-time">
    //         <div className="event-date-time">
    //           <i className="fas fa-calendar-day"></i>
    //           <h6>
    //             {event.endDate ? event.endDate.toLocaleDateString("en-US") : ""}
    //           </h6>
    //         </div>
    //         <div className="event-date-time">
    //           <i className="fas fa-clock"></i>
    //           <h6>
    //             {event.endDate
    //               ? event.endDate.toLocaleTimeString([], { timeStyle: "short" })
    //               : ""}
    //           </h6>
    //         </div>
    //       </div>
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
    <div className="bg-indigo-200  p-2 rounded-lg flex flex-row w-full items-center">
      <div className="flex space-x-3">
        <h6>
          {event.startDate ? event.startDate.toLocaleDateString("en-US") : ""}
        </h6>
        <h4 className="flex-1">
          <strong>{event.name}</strong>
        </h4>
      </div>

      <div className="flex-grow"></div>

      <div className="space-x-3">
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
    </div>
  );
};

export default AdminEventsView;
