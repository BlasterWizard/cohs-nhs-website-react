import React, {useState, useEffect} from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Student } from "../../App";
import { getAuth, updateEmail, UserCredential } from "firebase/auth";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../firebase";

interface ProfileEditViewProps {
    student: Student | undefined;
    user: UserCredential["user"];
    show: boolean;
    handleClose: () => void;
}

const ProfileEditView: React.FC<ProfileEditViewProps> = ({student, user, show, handleClose}) => {
    const [newEmail, setNewEmail] = useState("");
    const [newUsername, setNewUsername] = useState("");

    useEffect(() => {
        setNewEmail(user?.email ?? "");
        setNewUsername(student?.name ?? "");
    });

    const newUsernameTextHandler = (e: any) => {
        setNewUsername(e.target.value);
    }

    const newEmailTextHandler = (e: any) => {
        setNewEmail(e.target.value);
    }

    async function saveChanges() {
        const auth = getAuth();

        //update user email
        if (auth.currentUser != null && student != undefined) {
            updateEmail(auth.currentUser, newEmail).then(() => {
                    toast.success("Successfully updated email!");
                }).catch((error) => {
                    toast.error(error.message);
                });
            //update student name 
            await updateDoc(doc(db, "users", student?.docId), {
                name: newUsername
            });
        }        
    }

    return (
        <Modal scrollable={true} show={show} onHide={handleClose} centered>
          <Modal.Header>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-5">
                <p className="font-bold">New Username:</p>
                <Form.Control
                    value={newUsername}
                    onChange={newUsernameTextHandler}
                    type="text"
                    placeholder="John Smith"
                    className="m-2 p-1 rounded-lg w-1/2"
                    spellCheck={false}
                    />

                <p className="font-bold">New User Email:</p>
                <Form.Control
                    value={newEmail}
                    onChange={newEmailTextHandler}
                    type="email"
                    placeholder="johnsmith@gmail.com"
                    className="m-2 p-1 rounded-lg w-1/2"
                    />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-red-500 hover:bg-red-600 font-bold" onClick={handleClose}>
              Close
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 font-bold" onClick={saveChanges}>
                Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
    );
}

export default ProfileEditView;