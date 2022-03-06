import { updateDoc, doc } from 'firebase/firestore';
import db from '../../../firebase';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FAQNode } from '../../../pages/FAQs';
import toast from 'react-hot-toast';

interface AdminEditFAQViewProps {
    faq: FAQNode;
    show: boolean;
    handleClose: () => void;
}

const AdminEditFAQView: React.FC<AdminEditFAQViewProps> = ({ show, handleClose, faq }) => {
    const [newFAQTitle, setNewFAQTitle] = useState(faq.title);
    const [newFAQContent, setNewFAQContent] = useState(faq.content);
    const [newFAQLinkTitle, setNewFAQLinkTitle] = useState(faq.link?.title ?? "");
    const [newFAQURL, setNewFAQURL] = useState(faq.link?.url ?? "");

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

    async function saveFAQEdits() {
        if (newFAQLinkTitle != "" || newFAQURL != "") {
            await updateDoc(doc(db, "faqs", faq.docId!), {
                title: newFAQTitle,
                content: newFAQContent,
                link: {
                    title: newFAQLinkTitle,
                    url: newFAQURL
                }
            }).then(() => {
                handleClose();
                toast.success("FAQ updated");
            }).catch((error) => {
                toast.error(error.message);
            });
        } else {
            await updateDoc(doc(db, "faqs", faq.docId!), {
                title: newFAQTitle,
                content: newFAQContent
            }).then(() => {
                handleClose();
                toast.success("FAQ updated");
            }).catch((error) => {
                toast.error(error.message);
            });
        }
    }

    
    return (
        <Modal
        size="lg"
        centered
        show={show}
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit FAQ
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
          <Button className="bg-emerald-400 hover:bg-emerald-500 font-bold text-white" onClick={saveFAQEdits}>Update FAQ</Button>
        </Modal.Footer>
      </Modal>
    );
}

export default AdminEditFAQView;