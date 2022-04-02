import * as React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore';
import { Modal, Button, Form } from 'react-bootstrap';
import db from '../../../firebase';

interface AdminAddFAQViewProps  {
    show: boolean;
    handleClose: () => void;
}

const AdminAddFAQView: React.FC<AdminAddFAQViewProps> = ({ show, handleClose}) => {
    const [newFAQTitle, setNewFAQTitle] = useState("");
    const [newFAQContent, setNewFAQContent] = useState("");
    const [newFAQLinkTitle, setNewFAQLinkTitle] = useState("");
    const [newFAQURL, setNewFAQURL] = useState("");

    useEffect(() => {
        setNewFAQTitle("");
        setNewFAQContent("");
        setNewFAQLinkTitle("");
        setNewFAQURL("");
    }, [show]);


    const newFAQTitleHandler = (e: any) => {
        setNewFAQTitle(e.target.value);
    }

    const newFAQContentHandler = (e: any) => {
        setNewFAQContent(e.target.value);
    }

    const newFAQLinkTitleHandler = (e: any) => {
        setNewFAQLinkTitle(e.target.value);
    }

    const newFAQURLHandler = (e: any) => {
        setNewFAQURL(e.target.value);
    }

    async function addFAQ() {
        if (!checkFieldsIsEmpty()) {
            if (newFAQLinkTitle == "" || newFAQURL == "") {
                console.log("regular");

                await addDoc(collection(db, "faqs"), {
                    title: newFAQTitle,
                    content: newFAQContent,
                }).then(() => {
                    handleClose();
                    toast.success("Added FAQ");
                }).catch((error) => {
                    toast.error(error.message);
                });
            } else {
                await addDoc(collection(db, "faqs"), {
                    title: newFAQTitle,
                    content: newFAQContent,
                    link: {
                        title: newFAQLinkTitle,
                        url: newFAQURL
                    }
                }).then(() => {
                    handleClose();
                 toast.success("Added FAQ");
                }).catch((error) => {
                    toast.error(error.message)
                });
            }
        } else {
            toast.error("FAQ Title and Content can not be empty");
        }
        
    }

    const checkFieldsIsEmpty = ():boolean => {
        if (newFAQTitle == "" && newFAQContent == "") {
            return true;
        } 
        return false;
    }

    return (
        <Modal
        size="lg"
        centered
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add New FAQ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="flex flex-col space-y-3">
                <div className="flex space-x-3 items-center">
                    <p className="font-bold">FAQ Title:</p>
                    <Form.Control
                    value={newFAQTitle}
                    onChange={newFAQTitleHandler}
                    type="text"
                    placeholder=""
                    className="w-1/2"
                    />
                </div>

                <hr />

                <div className="flex space-x-3 items-center">
                    <p className="font-bold">FAQ Content:</p>
                    <Form.Control value={newFAQContent} onChange={newFAQContentHandler} as="textarea" rows={4} className="w-1/2"/>
                </div>

                <hr />

                <div className="flex space-x-3 items-center">
                    <p className="font-bold">FAQ Link Title (Optional):</p>
                    <Form.Control
                    value={newFAQLinkTitle}
                    onChange={newFAQLinkTitleHandler}
                    type="text"
                    placeholder=""
                    className="w-1/2"
                    />
                </div>

                <hr />

                <div className="flex space-x-3 items-center">
                    <p className="font-bold">FAQ Link URL (Optional):</p>
                    <Form.Control
                    value={newFAQURL}
                    onChange={newFAQURLHandler}
                    type="text"
                    placeholder=""
                    className="w-1/2"
                    />
                </div>
            </div>
            
           
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Close</Button>
          <Button className="bg-emerald-400 hover:bg-emerald-500 font-bold text-white" onClick={addFAQ}>Add FAQ</Button>
        </Modal.Footer>
      </Modal>
    );
}

export default AdminAddFAQView;
