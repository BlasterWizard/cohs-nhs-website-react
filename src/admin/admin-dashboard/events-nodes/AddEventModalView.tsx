import React, { useEffect, useState } from "react";
import db from "../../../firebase";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { Event, Student } from "../../../App";
import { addDoc, collection } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import { SelectionOption } from "./AdminEditEventModal";

interface AddEventModalViewProps {
  eventList: Event[];
  show: boolean;
  handleClose: () => void;
  students: Student[];
}

const AddEventModalView: React.FC<AddEventModalViewProps> = ({
  eventList,
  show,
  handleClose,
  students
}) => {
  const [eventName, setEventName] = useState<string>("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [eventDescription, setEventDescription] = useState("");
  const [optionality, setOptionality] = useState<boolean>(true);
  const [allowsProjectHours, setAllowsProjectHours] = useState<boolean>(false);
  const [newEventAuthors, setNewEventAuthors] = useState<string[]>([]);
  const [eventAuthorOptions, setSelectionOptions] = useState<SelectionOption[]>([]);

  useEffect(() => {
    createSelectionOptions();
  }, [students, eventList]); 

  const clearFields = () => {
    setEventName("");
    setStartDate(new Date());
    setEndDate(new Date());
    setEventDescription("");
    setOptionality(false);
    setAllowsProjectHours(false);
    setNewEventAuthors([]);
    setSelectionOptions([]);
  }

  const eventNameHandler = (e: any) => {
    setEventName(e.target.value);
  };

  const eventDescriptionHandler = (e: any) => {
    setEventDescription(e.target.value);
  };

  const optionalitySwitchHandler = () => {
    setOptionality(!optionality);
  };

  const allowsProjectHoursSwitchHandler = () => {
    setAllowsProjectHours(!allowsProjectHours);
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


  async function addNewEvent() {
    if (eventName === "") {
      toast.error("Event Name can not be empty");
    } else if (checkEventsTime()) {
      //upload event to firestore

      const newEventData = {
        code: `E${eventList.length + 1}`,
        name: eventName,
        startDate: startDate,
        endDate: endDate,
        optionality: optionality ? "O" : "M",
        hasProjectHours: allowsProjectHours,
        description: eventDescription,
        interested: [],
        hosts: newEventAuthors
      };

      await addDoc(collection(db, "events-Data"), newEventData).then(() => {
        handleClose();
        toast.success("Added event");
      }).catch(() => {
        toast.error("Unable to create new event");
      });
    }
  };

  const checkEventsTime = (): boolean => {
    if (startDate > endDate) {
      //Throw Error
      toast.error("End Date cannot be earlier than start date");
      return false;
    } else if (startDate.valueOf() === endDate.valueOf()) {
      toast.error(
        "End Date & Time cannot be the same as the start date & time"
      );
      return false;
    }
    return true;
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

  const closeModal = () => {
    handleClose();
    clearFields();
  }

  return (
    <Modal size="lg" centered show={show} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>
          Add New Event
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-5">
          <div>
            <p className="font-bold">Event Name:</p>
            <Form.Control
                value={eventName}
                onChange={eventNameHandler}
                type="text"
                placeholder=""
                className="w-1/2"
              />
          </div>
          <hr/>
          <div>
            <p className="font-bold">Start Date & Time</p>
              <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              className="bg-blue-100 border-black border-solid border-2 rounded-full px-2"
              />
          </div>
          <hr/>
          <div>
          <p className="font-bold">End Date & Time:</p>
            <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            className="bg-blue-100 border-black border-solid border-2 rounded-full px-2"
          />
          </div>
          <hr/>
          <div>
            <p className="font-bold">Event Description:</p>
            <Form.Control
            value={eventDescription}
            onChange={eventDescriptionHandler}
            as="textarea"
            rows={4}
          />
          </div>
          <hr/>
          <div className="flex justify-center space-x-16">
            <div>
              <p className="font-bold">Optionality:</p>
              <div className="ml-5">
                <Form.Check
                  type="switch"
                  id="optionality-switch"
                  checked={optionality}
                  onChange={optionalitySwitchHandler}
                />
                <h6>{optionality ? "True" : "False"}</h6>
              </div>
            </div>
            
            <div>
              <p className="font-bold">Allow Project Hours:</p>
              <div className="ml-5">
                  <Form.Check
                  type="switch"
                  id="allow-project-hours-switch"
                  checked={allowsProjectHours}
                  onChange={allowsProjectHoursSwitchHandler}
                />
                <h6>{allowsProjectHours ? "True" : "False"}</h6>
              </div>
            </div>
          </div>
          <hr/>
          <div>
              <Form.Label className="font-bold">Event Hosts:</Form.Label>
              <Select
                closeMenuOnSelect={false}
                isMulti
                options={eventAuthorOptions}
                onChange={addNewEventAuthor}
                className="w-1/2"
              />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="bg-red-500 hover:bg-red-600 font-bold text-white"
          onClick={closeModal}
        >
          Close
        </Button>
        <Button
          className="bg-emerald-500 hover:bg-emerald-600 font-bold text-white"
          onClick={addNewEvent}
        >
          Add Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEventModalView;
