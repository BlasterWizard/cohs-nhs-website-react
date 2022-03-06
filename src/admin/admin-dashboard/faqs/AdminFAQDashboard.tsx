import { doc, deleteDoc } from 'firebase/firestore';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import db from '../../../firebase';
import { FAQNode } from '../../../pages/FAQs';
import AdminAddFAQView from './AdminAddFAQView';
import AdminEditFAQView from './AdminEditFAQView';

interface AdminFAQDashboardProps {
    faqs: FAQNode[];
}

interface AdminFAQsViewProps {
    faqs: FAQNode[];
    show: boolean;
    handleClose: () => void;
}


interface AdminFAQNodeViewProps {
    faq: FAQNode;
}

const AdminFAQDashboard: React.FC<AdminFAQDashboardProps> = ({faqs}) => {

    const [showFAQs, setShowFAQs] = useState(false);
    const [showAddNewFAQ, setShowAddNewFAQ] = useState(false);

    const toggleShowFAQs = () => {
        showFAQs ? setShowFAQs(false) : setShowFAQs(true);
    }

    const toggleShowAddNewFAQ = () => {
        showAddNewFAQ ? setShowAddNewFAQ(false) : setShowAddNewFAQ(true);
    }

    return (
        <div className="bg-white/60 p-5 rounded-2xl flex flex-col items-center">
            <h3 className="text-2xl font-bold">FAQ Dashboard</h3>
            <div className="space-y-3 flex flex-col mt-3">
                <button className="bg-indigo-400 py-1 px-3 rounded-full font-bold text-white" onClick={toggleShowFAQs}>View FAQs</button>
                <button className="bg-green-400 py-1 px-2 rounded-full font-bold text-white" onClick={toggleShowAddNewFAQ}>
                Add New FAQ
                </button>
            </div>
            <AdminFAQsView show={showFAQs} handleClose={toggleShowFAQs} faqs={faqs} />
            <AdminAddFAQView show={showAddNewFAQ} handleClose={toggleShowAddNewFAQ} />
         </div>
    );
}

const AdminFAQsView: React.FC<AdminFAQsViewProps> = ({show, handleClose, faqs}) => {

    return (
        <Modal
        size="lg"
        centered
        show={show}
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            FAQs
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {faqs.length > 0 ? 
                <div className="flex flex-col items-center space-y-3">
                {faqs.map((faq: FAQNode, index: number) => {
                    return <AdminFAQNodeView faq={faq} key={index} />
                })}
                </div>
                :
                <p className="text-center font-bold">No FAQs</p>
            }
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

const AdminFAQNodeView: React.FC<AdminFAQNodeViewProps> = ({faq}) => {

    const [showEditFAQView, setShowEditFAQView] = useState(false);

    const toggleShowEditFAQView = () => {
        showEditFAQView ? setShowEditFAQView(false) : setShowEditFAQView(true);
    }

    async function deleteFAQ() {
        if (faq.docId != undefined) {
            await deleteDoc(doc(db, "faqs", faq.docId)).then(() => {
                toast.success("FAQ Deleted");
            }).catch((error) => {
                toast.error(error.message);
            });
        } else {
            toast.error("Could not find FAQ Document ID");
        }
       
    }

    return (
        <div className="bg-indigo-100 p-2 rounded-lg text-center w-4/5 flex items-center">
            <div className="flex-grow"></div>

            <div className="flex flex-col items-center">
                <h5>
                    <strong>{faq.title}</strong>
                </h5>
                <h6>{faq.content}</h6>

                {faq.link && (
                    <a className="block bg-indigo-300 hover:bg-indigo-400 hover:scale-120 p-2 rounded-full m-2 text-white font-bold w-fit" href={faq.link.url}>
                    {faq.link.title}
                    </a>
                )}
            </div>

            <div className="flex-grow"></div>

            <div className="flex space-x-2"> 
                <button className="bg-indigo-400 hover:bg-indigo-500 py-0.5 px-2 rounded-full text-white" onClick={toggleShowEditFAQView}>
                    <h3 className="font-bold">Edit</h3>
                </button>
                <button className="bg-red-500 py-0.5 px-2 rounded-full text-white" onClick={deleteFAQ}>
                    <i className="fas fa-minus"></i>
                </button>
            </div>
            <AdminEditFAQView faq={faq} show={showEditFAQView} handleClose={toggleShowEditFAQView} />
        </div>
    );
}


export default AdminFAQDashboard;