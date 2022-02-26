import React from 'react';
import { Badge, Button, Modal } from 'react-bootstrap';
import { Event } from '../../App';

interface EventInfoModalProps {
    show: boolean;
    handleClose: () => void;
    event: Event;
}
 
const EventInfoModal: React.FC<EventInfoModalProps> = ({ show, handleClose, event}) => {
    return (  
      <Modal scrollable={true} show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>{event.name} Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5><strong>Event Hosts:</strong></h5>
          {event.eventHosts.length !== 0 ? event.eventHosts.map((eventHost) => (
              <Badge pill className="primary-badge">{eventHost}</Badge>
          )) : <h6>No Event Hosts</h6>}
          <h5><strong>Event Description:</strong></h5>
          <h6>{event.description ? event.description : "No Event Description"}</h6>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-red-500 font-bold" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
}
 
export default EventInfoModal;