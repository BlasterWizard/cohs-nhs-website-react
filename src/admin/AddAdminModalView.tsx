import * as React from 'react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Student } from '../App';
import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import { SelectionOption } from './admin-dashboard/events-nodes/AdminEditEventModal';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';

interface AddAdminModalViewProps {
    students: Student[];
    show: boolean;
    handleClose: () => void;
}

const AddAdminModalView: React.FC<AddAdminModalViewProps> = ({
    students, show, handleClose
  }) => {
    const [newAdminsDocIDs, setNewAdminsDocIDs] = useState<string[]>([]);
    const [adminsOptions, setAdminsOptions] = useState<SelectionOption[]>([]);

    useEffect(() => {
        createAdminsOptions();
    }, [students]);

    const addAdminsHandler = (e: any) => {
        const items: string[] = [];
        if (e.length > 0) {
            e.forEach((entry: SelectionOption) => {
                items.push(entry.value);
            });
            setNewAdminsDocIDs(items);
        }
    }

    const createAdminsOptions = () => {
        var items: SelectionOption[] = [];
        students.forEach((student) => {
            if (!student.isAdmin) {
                items.push({
                    value: student.docId,
                    label: student.name
                });
            }
        });
        setAdminsOptions(items);
    }

    async function addNewAdmins() {
        newAdminsDocIDs.forEach(async (newAdminDocID) => {
            const newAdminRef = doc(db, "users", newAdminDocID);
            await updateDoc(newAdminRef, {
                isAdmin: true
            }).then(() => {
                handleClose();
                toast.success("Added Admin(s)");
            }).catch(() => {
                toast.error("Could not add admins");
            });
        });
    }
  
  
    return (
        <Modal
        size="lg"
        centered
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add New Admins
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="mb-10">
                <p className="font-bold">Select Student:</p>
                <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={adminsOptions}
                    onChange={addAdminsHandler}
                />
            </div>
            
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Close</Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 font-bold text-white" onClick={addNewAdmins}>Add Admins</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default AddAdminModalView;