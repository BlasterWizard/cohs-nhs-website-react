import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import toast from "react-hot-toast";
import PasswordResetModalView from './PasswordResetModalView';

interface SigninFormProps {
}

const SigninForm: React.FC<SigninFormProps> = () => {
    const [emailText, setEmailText] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

    const toggleShowPasswordResetModal = () => {
        showPasswordResetModal ? setShowPasswordResetModal(false) : setShowPasswordResetModal(true);
    }


    const emailTextHandler = (e: any) => {
        setEmailText(e.target.value);
    }

    const passwordTextHandler = (e: any) => {
        setPasswordText(e.target.value);
    }

    const signIn = (e: any) => {
        e.preventDefault();
        signinHandler(emailText, passwordText);
    }

    const signinHandler = (emailText: string, passwordText: string) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, emailText, passwordText)
        .then((userCredential) => {
            console.log("user logged in");
            toast.success("Logged In! Welcome Back!");
            window.location.href = "/dashboard";
        })
        .catch((error) => {
            switch (error.code) {
                case "auth/wrong-password":
                    toast.error("Wrong Password. Please try again");
                    break;
                case "auth/too-many-requests":
                    toast.error("Too many requests. Please try again later");
                    break;
                default: 
                    toast.error(error.message);
            }
        });
      }
    
    return (
        <div className="flex flex-col items-center">
            <div className="bg-white/60 py-5 px-20 rounded-lg mt-10 w-fit">
                <Form>
                    <Form.Group controlId="fromBasicEmail">
                        <Form.Label className="font-bold">Email Address:</Form.Label>
                        <Form.Control value={emailText} className="m-2 p-1 rounded-lg" onChange={emailTextHandler} type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="font-bold">Password:</Form.Label>
                        <Form.Control className="m-2 p-1 rounded-lg" value={passwordText} onChange={passwordTextHandler} type="password" placeholder="Password" aria-describedby="passwordHelpBlock" />
                    </Form.Group>

                
                    <Form.Group className="flex justify-center mt-2">
                        <Button onClick={signIn} className="bg-blue-400 p-2 rounded-lg hover:bg-blue-500 font-bold text-white" type="submit">
                            Login
                        </Button>
                    </Form.Group>
                </Form>
            </div>

            <div>
                <button onClick={toggleShowPasswordResetModal}><p className="text-sm hover:text-red-500">Forgot Password</p></button>
                <PasswordResetModalView show={showPasswordResetModal} handleClose={toggleShowPasswordResetModal} />
            </div>
        </div>
    );
}

export default SigninForm;
