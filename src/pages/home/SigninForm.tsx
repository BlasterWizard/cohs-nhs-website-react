import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import toast from "react-hot-toast";

interface SigninFormProps {
}

const SigninForm: React.FC<SigninFormProps> = () => {
    const [emailText, setEmailText] = useState("");
    const [passwordText, setPasswordText] = useState("");


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
            const user = userCredential.user;
            console.log("user logged in");
            toast.success("Logged In! Welcome Back!");
            window.location.href = "/dashboard";
        })
        .catch((error) => {
            toast.error(error.message);
        });
      }
    
    return (
        <div className="bg-white/60 p-5 rounded-lg mt-10">
            <Form>
                <Form.Group controlId="fromBasicEmail">
                    <Form.Label className="font-bold">Email Address:</Form.Label>
                    <Form.Control value={emailText} className="m-2 p-1 rounded-lg" onChange={emailTextHandler} type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="font-bold">Password:</Form.Label>
                    <Form.Control className="m-2 p-1 rounded-lg" value={passwordText} onChange={passwordTextHandler} type="password" placeholder="Password" aria-describedby="passwordHelpBlock" />
                </Form.Group>

                <Form.Group className="flex justify-center">
                    <Button onClick={signIn} className="bg-blue-400 p-2 rounded-lg hover:bg-blue-500 font-bold text-white" type="submit">
                        Login
                    </Button>
                </Form.Group>
            </Form>
        </div>
    );
}

export default SigninForm;
