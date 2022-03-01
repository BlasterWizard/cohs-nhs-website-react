import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Announcement } from '../../../App';
import { doc, deleteDoc, getDocs, collection, updateDoc, deleteField, arrayRemove } from "firebase/firestore";
import db from "../../../firebase";
import toast from "react-hot-toast";
import { Badge } from "react-bootstrap";
import { useState } from 'react';

interface AdminAnnouncementsViewProps {
    announcements: Announcement[];
    show: boolean;
    handleClose: () => void;
}

interface AdminAnnouncementNodeProps {
    announcement: Announcement;
  }

const AdminAnnouncementsView: React.FC<AdminAnnouncementsViewProps> = ({announcements, show, handleClose}) => {
    return (
     <Modal
      size="lg"
      centered
      show={show}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {announcements.length} {announcements.length === 1 ? "Announcement" : "Announcements"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-3 flex flex-col items-center">
            {announcements.length > 0 ? announcements.map((announcement: Announcement, index: number) => (
                <AdminAnnouncementNode announcement={announcement} key={index}/>
            )) : <p className="text-center font-bold">No Announcements</p>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
    );
}

const AdminAnnouncementNode: React.FC<AdminAnnouncementNodeProps> = ({
    announcement
  }) => {
  
    async function deleteAdminAnnouncementNode() {
      await deleteDoc(doc(db, "announcements", announcement.docId)).then(() => {
        toast.success("Announcement Deleted");
      }).catch((error) => {
        toast.error("Announcement could not be deleted");
      });
  
      const studentsQS = await getDocs(collection(db, "users"));
      studentsQS.forEach(async (docItem) => {
        await updateDoc(doc(db, "users", docItem.id), {
          announcements: arrayRemove({
              title: announcement.title,
              content: announcement.content,
              author: announcement.author
          })
        });
      });
    }
  
    return (
      <div className="bg-indigo-100 rounded-2xl py-3 flex-col">
        <div className="flex items-center px-5 space-x-3">
          <p className="bg-indigo-300 rounded-full py-0.5 px-2 font-bold text-white w-fit">
            {announcement.author}
          </p>
          <div className="flex-grow"></div>
          <h4 className="font-bold text-center">{announcement.title}</h4>
          <div className="flex-grow"></div>
          <button className="bg-red-500 px-2 py-0.5 rounded-full text-white" onClick={deleteAdminAnnouncementNode}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <h6 className="px-5 text-center">{announcement.content}</h6>
      </div>
    );
  };
  

export default AdminAnnouncementsView;