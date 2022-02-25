import { updateDoc, addDoc, getDocs, collection, arrayUnion, doc } from 'firebase/firestore';
import * as React from 'react';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Student } from '../../App';
import db from '../../firebase';

interface AddNewAnnouncementViewProps {
    show: boolean;
    handleClose: () => void;
    student: Student | undefined;
}

const AddNewAnnouncementView: React.FC<AddNewAnnouncementViewProps> = ({student, show, handleClose}) => {
    const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
    const [newAnnouncementContent, setNewAnnouncementContent] = useState("");

    const newAnnouncementTitleTextHandler = (e: any) => {
        setNewAnnouncementTitle(e.target.value);
    }

    const newAnnouncementContentTextHandler = (e: any) => {
        setNewAnnouncementContent(e.target.value);
    }

    async function sendAnnouncement() {
        if (newAnnouncementTitle === "") {
            toast.error("Announcement Title can not be empty");
        } else if (newAnnouncementContent === "") {
            toast.error("Announcement Context can not be empty");
        } else {

          const newAnnouncementData = {
            title: newAnnouncementTitle,
            content: newAnnouncementContent,
            author: student?.name
          }

          await addDoc(collection(db, "announcements"), newAnnouncementData).then(() => {
            toast.success("New Announcement Created!");
            handleClose();
          }).catch((error) => {
            toast.error("Could not create new announcement 🙁");
          });

          //Loop through all of the students and enter new anouncement 
          console.log("hello");
          const studentsQS = await getDocs(collection(db, "users"));
          studentsQS.forEach(async (docItem) => {
            await updateDoc(doc(db, "users", docItem.id), {
              announcements: arrayUnion({
                title: newAnnouncementTitle,
                content: newAnnouncementContent,
                author: student?.name
              })
            });
          });
        }
    }

    
    return (
    <Modal
      size="lg"
      centered
      show={show}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Add New Announcement
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-3">
            <h3 className="font-bold">Announcement Title:</h3>
            <Form.Control value={newAnnouncementTitle} className="m-2 p-1 rounded-lg w-1/2" onChange={newAnnouncementTitleTextHandler} type="text" placeholder="" />
            <hr />
            <h3 className="font-bold">Announcement Content:</h3>
            <Form.Control value={newAnnouncementContent} onChange={newAnnouncementContentTextHandler} as="textarea" rows={4} />
            <hr />
            <div className="flex items-center space-x-3">
                <p className="font-bold">Author:</p>
                <p className="font-bold w-fit">{student?.name}</p>
            </div>
        </div>
        
      </Modal.Body>
      <Modal.Footer>
        <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Close</Button>
        <Button className="bg-green-400 hover:bg-green-500 font-bold text-white" onClick={sendAnnouncement}>Send</Button>
      </Modal.Footer>
    </Modal>
    );
}

export default AddNewAnnouncementView;