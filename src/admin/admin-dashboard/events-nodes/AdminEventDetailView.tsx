import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Event } from '../../../App';

interface AdminEventDetailViewProps {
    event: Event;
    show: boolean;
    handleClose: () => void;
    getStudentNameFromID: (id:string) => string;
}

const AdminEventDetailView: React.FC<AdminEventDetailViewProps> = ({event, show, handleClose, getStudentNameFromID}) => {
    return (
        <Modal
        size="lg"
        centered
        show={show}
        scrollable={true}
      >
        <Modal.Header>
          <Modal.Title>{event.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="space-y-3">
                <p className="font-bold">Event Description:</p>
                <p>{event.description === "" ? "No Description" : event.description}</p>
                <hr/>
                <p className="font-bold">Event Optionality:</p>
                <p>{event.optionality === "O" ? "Optional" : "Mandatory"}</p>
                <hr/>
                <p className="font-bold">Has Project Hours:</p>
                <p>{event.hasProjectHours ? "Yes" : "No"}</p>
                <hr/>
                <p className="font-bold">Event Hosts:</p>
                <div className="flex flex-col space-y-1">
                    {event.eventHosts.length > 0 ? event.eventHosts.map((eventHostID: string, index: number) => {
                    return <p key={index}>{getStudentNameFromID(eventHostID)}</p>
                }) : "No Event Hosts"}
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

export default AdminEventDetailView;