import { updateDoc, doc } from 'firebase/firestore';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Setting } from '../../App';
import db from "../../firebase";

interface AdminRequiredHoursViewProps {
    settings: Setting
}

interface AdminEditRequiredHoursViewProps {
    show: boolean;
    handleClose: () => void;
    settings: Setting
}

const AdminRequiredHoursView: React.FC<AdminRequiredHoursViewProps> = ({settings}) => {
    const [showEditRequiredHoursModal, setShowEditRequiredHoursModal] = useState(false);

    const toggleShowEditRequiredHoursModal = () => {
        showEditRequiredHoursModal ? setShowEditRequiredHoursModal(false) : setShowEditRequiredHoursModal(true);
    }

    return (
        <div className="bg-white/60 p-3 rounded-2xl m-4 flex flex-col justify-center items-center space-y-5">
            <p><span className="font-bold mr-2">Senior Required Hours:</span>{settings.seniorsRequiredHours ?? "NULL"}</p>
            <p><span className="font-bold mr-2">Junior Required Hours:</span>{settings.juniorsRequiredHours ?? "NULL"}</p>
            <button className="bg-indigo-300 hover:bg-indigo-400 py-0.5 px-2 rounded-full w-fit font-bold text-white" onClick={toggleShowEditRequiredHoursModal}>Edit</button>
            <AdminEditRequiredHoursView show={showEditRequiredHoursModal} handleClose={toggleShowEditRequiredHoursModal} settings={settings}/>
        </div>
    );
}

const AdminEditRequiredHoursView: React.FC<AdminEditRequiredHoursViewProps> = ({show, handleClose, settings}) => {
    const [newSeniorsRequiredHours, setNewSeniorsRequiredHours] = useState<string>("null");
    const [newJuniorsRequiredHours, setNewJuniorsRequiredHours] = useState<string>("");

    useEffect(() => {
        setNewSeniorsRequiredHours(settings.seniorsRequiredHours != null ? settings.seniorsRequiredHours.toString() : "");
        setNewJuniorsRequiredHours(settings.juniorsRequiredHours != null ? settings.juniorsRequiredHours.toString() : "");
    }, [settings]);

    const newSeniorsRequiredHoursHandler = (e: any) => {
        setNewSeniorsRequiredHours(e.target.value);
    }

    const newJuniorsRequiredHoursHandler = (e: any) => {
        setNewJuniorsRequiredHours(e.target.value);
    }

    async function saveRequiredHoursChanges() {
        await updateDoc(doc(db, "settings", "requiredHours"), {
            seniorsRequiredHours: newSeniorsRequiredHours,
            juniorsRequiredHours: newJuniorsRequiredHours
        }).then(() => {
            handleClose();
            toast.success("Updated Required Hours");
        }).catch((error) => {
            toast.error(error.message);
        });
    }

    return (
        <Modal scrollable={true} show={show} onHide={handleClose} centered>
            <Modal.Header>
                <Modal.Title>Edit Required Hours</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="flex items-center"> 
                    <p className="font-bold text-sm">New Seniors Required Hours: </p>
                    <Form.Control
                    value={newSeniorsRequiredHours}
                    onChange={newSeniorsRequiredHoursHandler}
                    type="text"
                    className="m-2 p-1 rounded-lg w-1/4 text-center"
                    />
                </div>
                <div className="flex items-center"> 
                    <p className="font-bold text-sm">New Juniors Required Hours: </p>
                    <Form.Control
                    value={newJuniorsRequiredHours}
                    onChange={newJuniorsRequiredHoursHandler}
                    type="text"
                    className="m-2 p-1 rounded-lg w-1/4 text-center"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button className="bg-red-500 hover:bg-red-600 font-bold" onClick={handleClose}>
                Close
            </Button>
            <Button className="bg-emerald-400 hover:bg-emerald-500 font-bold" onClick={saveRequiredHoursChanges}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AdminRequiredHoursView;