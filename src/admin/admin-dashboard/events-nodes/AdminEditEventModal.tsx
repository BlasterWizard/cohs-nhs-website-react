import React, { useState } from "react";
import db from "../../../firebase";
import { useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { AttendedEvent, Event, Student } from "../../../App";
import { doc, updateDoc } from "firebase/firestore";
import Select from "react-select";

interface AdminEditEventModalProps {
  show: boolean;
  handleShow: () => void;
  event: Event;
  students: Student[];
  getStudentNameFromID: (id:string) => string
}

export interface SelectionOption {
  value: string;
  label: string;
}

const AdminEditEventModal: React.FC<AdminEditEventModalProps> = ({
  show,
  handleShow,
  students,
  event,
  getStudentNameFromID
}) => {
  const [newEventName, setNewEventName] = useState<string>("");
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newOptionality, setNewOptionality] = useState<boolean>(true);
  const [newAllowsProjectHours, setNewAllowsProjectHours] =
    useState<boolean>(false);
  const [newEventAuthors, setNewEventAuthors] = useState<string[]>([]);
  const [defaultEventAuthors, setDefaultEventAuthors] = useState<SelectionOption[]>([]);
  const [eventAuthorOptions, setSelectionOptions] = useState<SelectionOption[]>([]);


  useEffect(() => {
    createSelectionOptions();
    createDefaultSelectionOptions();
    setNewEventName(event.name);
    if (event.startDate) {
      setNewStartDate(event.startDate);
    }
    if (event.endDate) {
      setNewEndDate(event.endDate);
    }
    setNewEventDescription(event.description);

    setNewOptionality(event.optionality === "O" ? true : false);
    setNewAllowsProjectHours(event.hasProjectHours);
  }, [event]);

  const newEventNameHandler = (e: any) => {
    setNewEventName(e.target.value);
  };

  const newEventDescriptionHandler = (e: any) => {
    setNewEventDescription(e.target.value);
  };

  const optionalitySwitchHandler = () => {
    setNewOptionality(!newOptionality);
  };

  const allowsProjectHoursSwitchHandler = () => {
    setNewAllowsProjectHours(!newAllowsProjectHours);
  };

  const checkEventsTime = (): boolean => {
    if (newStartDate > newEndDate) {
      //Throw Error
      toast.error("End Date cannot be earlier than start date");
      return false;
    } else if (newStartDate.valueOf() === newEndDate.valueOf()) {
      toast.error(
        "End Date & Time cannot be the same as the start date & time"
      );
      return false;
    }
    return true;
  };

  const createSelectionOptions = () => {
    const studentSelectionOptions: SelectionOption[] = [];
    students.forEach((student) => {
      studentSelectionOptions.push({
        value: student.name,
        label: student.name
      });
    });
    setSelectionOptions(studentSelectionOptions);
  }

  const createDefaultSelectionOptions = () => {
    const defaultSelectionOptionsArray: SelectionOption[] = [];
    console.log(event);
    event.eventHosts.forEach((host) => {
      const hostName = getStudentNameFromID(host);
      console.log(hostName);
      defaultSelectionOptionsArray.push({
        value: hostName,
        label: hostName
      });
    });

    setDefaultEventAuthors(defaultSelectionOptionsArray);
    console.log(defaultEventAuthors);
  }

  const updateEventWithAttendedEvents = (
    eventCode: string,
    newEventName: string,
    newStartDate: Date
  ) => {
    //update AttendedEvents data
    students.forEach(async (student) => {
      const copyStudentAttendance: AttendedEvent[] = student.attendance;
      copyStudentAttendance.forEach((attendedEvent) => {
        if (attendedEvent.code === eventCode) {
          attendedEvent.localEventName = newEventName;
          attendedEvent.startDate = newStartDate;
          console.log(copyStudentAttendance);
        }
      });

      await updateDoc(doc(db, "users", student.docId), {
        attendance: copyStudentAttendance,
      });
    });
  };


  async function saveNewEventChanges() {
    handleShow();
    if (newEventName === "") {
      toast.error("Event Name can not be empty");
    } else if (checkEventsTime()) {
      //upload event to firestore

      await updateDoc(doc(db, "events-Data", event.docId), {
        code: event.code,
        name: newEventName,
        optionality: newOptionality ? "O" : "M",
        startDate: newStartDate,
        endDate: newEndDate,
        hasProjectHours: newAllowsProjectHours,
        description: newEventDescription,
        hosts: newEventAuthors
      });
        updateEventWithAttendedEvents(event.code, newEventName, newStartDate);
    }
  };

  const addNewEventAuthor = (e: any) => {
    const items: string[] = [];
    if (e.length > 0) {
      e.forEach((entry: SelectionOption) => {
        console.log(getStudentIDFromName(entry.value));
        items.push(getStudentIDFromName(entry.value));
      });
      setNewEventAuthors(items);
    }
  }

  const getStudentIDFromName = (name: String):string => {
    for (var i = 0; i < students.length; i++) {
      if (students[i].name === name) {
        return students[i].specialId;
      }
    }
    return "";
  }

  return (
    <>
      <Modal scrollable={true} show={show} onHide={handleShow} centered>
        <Modal.Header>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Event Name */}
            <Form.Group
              className="mb-3 new-event-input"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label className="font-bold">New Event Name:</Form.Label>
              <Form.Control
                value={newEventName}
                onChange={newEventNameHandler}
                type="text"
                placeholder="Enter New Event Name"
              />
            </Form.Group>

            <Form.Group
              className="mb-3 new-event-input"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label className="font-bold">New Start Date and Time:</Form.Label>
              <ReactDatePicker
                selected={newStartDate}
                onChange={(date: Date) => setNewStartDate(date)}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                className="bg-blue-100 border-black border-solid border-2 rounded-full px-2"
              />
            </Form.Group>

            <Form.Group
              className="mb-3 new-event-input"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label className="font-bold">New End Date and Time:</Form.Label>
              <ReactDatePicker
                selected={newEndDate}
                onChange={(date: Date) => setNewEndDate(date)}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                className="bg-blue-100 border-black border-solid border-2 rounded-full px-2"
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="font-bold">New Event Description:</Form.Label>
              <Form.Control
                value={newEventDescription}
                onChange={newEventDescriptionHandler}
                as="textarea"
                rows={4}
              />
            </Form.Group>

            <div className="switches">
              {/* Event Optionality */}
              <Form.Group
                className="mb-3 new-event-input"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label className="font-bold">Optionality:</Form.Label>
                <div className="ml-5">
                  <Form.Check
                    type="switch"
                    id="optionality-switch"
                    checked={newOptionality}
                    onChange={optionalitySwitchHandler}
                  />
                  <h6>{newOptionality ? "True" : "False"}</h6>
                </div>
                
              </Form.Group>

              {/* {Allows Project Hours} */}
              <Form.Group
                className="mb-3 new-event-input"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label className="font-bold">Allows Project Hours:</Form.Label>
                <div className="ml-5">
                  <Form.Check
                    type="switch"
                    id="allow-project-hours-switch"
                    checked={newAllowsProjectHours}
                    onChange={allowsProjectHoursSwitchHandler}
                  />
                  <h6>{newAllowsProjectHours ? "True" : "False"}</h6>
                </div>
                
              </Form.Group>
            </div>

            <Form.Group>
              <Form.Label className="font-bold">New Event Authors:</Form.Label>
              <Select
                closeMenuOnSelect={false}
                isMulti
                value={defaultEventAuthors}
                options={eventAuthorOptions}
                onChange={addNewEventAuthor}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-rose-500 hover:bg-rose-600 font-bold"onClick={handleShow}>
            Close
          </Button>
          <Button className="bg-emerald-400 hover:bg-emerald-500 font-bold" onClick={saveNewEventChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminEditEventModal;