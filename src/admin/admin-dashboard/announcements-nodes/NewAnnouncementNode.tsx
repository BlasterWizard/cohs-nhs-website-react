import React, {useState} from 'react';
import db from '../../../firebase';
import { Form } from "react-bootstrap";
import { Announcement, Student } from '../../../App';
import toast from 'react-hot-toast';
import { doc, addDoc, getDocs, collection, updateDoc, arrayUnion } from "firebase/firestore";


interface NewAnnouncementNodeProps {
    newAnnouncement: Announcement;
    newAnnouncements: Announcement[];
    student: Student | undefined;
}
  
const NewAnnouncementNode: React.FC<NewAnnouncementNodeProps> = ({
    newAnnouncement,
    newAnnouncements,
    student
  }) => {
    const [newAnnouncementTitle, setNewAnnouncementTitle] = useState<string>("");
    const [newAnnouncementContent, setNewAnnouncementContent] = useState<string>("");

  
    async function addNewAnnouncement() {
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
          }).catch((error) => {
            toast.error("Could not create new announcement :(");
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
    };
  
    const newAnnouncementTitleHandler = (e: any) => {
      setNewAnnouncementTitle(e.target.value);
    };

    const newAnnouncementContentHandler = (e: any) => {
        setNewAnnouncementContent(e.target.value);
    }
  
    return (
      <div className="dashboard-glass new-node">
        <h4 className="text-xl font-bold">New Annoucement</h4>
        {/* Student Name */}
        <Form.Group
          className="mb-3 new-event-input"
          controlId="exampleForm.ControlInput1"
        >
          <Form.Label>Announcement Title:</Form.Label>
          <Form.Control
            value={newAnnouncementTitle}
            onChange={newAnnouncementTitleHandler}
            type="text"
            placeholder=""
          />
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Announcement Content:</Form.Label>
          <Form.Control value={newAnnouncementContent} onChange={newAnnouncementContentHandler} as="textarea" rows={4} />
        </Form.Group>
  
        <h6><strong>Author: </strong>{student?.name}</h6>
        <div className="button-group">
          <button className="delete-btn">
            <i className="fas fa-minus"></i>
          </button>
          <button className="add-btn" onClick={addNewAnnouncement}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    );
  };

  export default NewAnnouncementNode;