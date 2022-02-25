import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Student } from '../App';
import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase"

interface AdminsModalViewProps {
    admins: Student[];
    show: boolean;
    handleClose: () => void;
}

interface AdminNodeViewProps {
    admin: Student;
}

const AdminsModalView: React.FC<AdminsModalViewProps> = ({admins, show, handleClose}) => {
    return(
        <Modal
        size="lg"
        centered
        show={show}
        scrollable={true}
      >
        <Modal.Header>
          <Modal.Title>
            {admins.length} {admins.length === 1 ? "Admin" : "Admins"} 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="space-y-3 flex flex-col items-center">
                {admins.map((admin: Student, key: number) => (
                    <AdminNodeView
                        admin={admin}
                        key={key}
                    />
                ))}  
            </div>     
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

const AdminNodeView: React.FC<AdminNodeViewProps> = ({
    admin,
  }) => {
      async function deleteAdmin() {
      if (admin.specialId) {
  
        const docRef = doc(db, "users", admin.docId);
        await updateDoc(docRef, {
          isAdmin: false
        });
      }
    };
  
    return (
      <div className="bg-indigo-100 p-2 rounded-2xl flex items-center w-1/2">
        <h5 className="font-bold">{admin.name}</h5>
        <div className="flex-grow"></div>
        <button className="bg-red-500 py-0.5 px-2 rounded-full text-white" onClick={deleteAdmin}>
          <i className="fas fa-minus"></i>
        </button>
      </div>
    );
  };

export default AdminsModalView;