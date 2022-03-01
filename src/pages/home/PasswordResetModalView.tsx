import * as React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import toast from 'react-hot-toast';
import { useState } from 'react';

interface PasswordResetModalViewProps {
    show: boolean;
    handleClose: () => void;
}

const PasswordResetModalView: React.FC<PasswordResetModalViewProps> = ({show, handleClose}) => {
    const [userEmail, setUserEmail] = useState("");

    const userEmailTextHandler = (e: any) => {
        setUserEmail(e.target.value);
    }

    const resetPassword = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, userEmail)
        .then(() => {
            toast.success("Password Successfully Reseted");
            handleClose();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
        });
    }
    return (
    <Modal scrollable={true} show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="font-bold">Enter Email:</p>
          <Form.Control className="m-2 p-1 rounded-lg" value={userEmail} onChange={userEmailTextHandler} type="email"/>
          <hr/>
          <p className="text-sm">You will be sent further instructions on resetting your password at the email entered above.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-red-500 hover:bg-red-600 font-bold" onClick={handleClose}>
            Close
          </Button>
          <Button className="bg-emerald-400 hover:bg-emerald-500 font-bold" onClick={resetPassword}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default PasswordResetModalView;