import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import db from "../../firebase";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { updateDoc, doc } from "firebase/firestore";
import { Student } from "../../App";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

interface SignupProps {
  students: Student[];
}

const Signup: React.FC<SignupProps> = ({students}) => {
  const [suEmailAddress, setSuEmailAddress] = useState<string>("");
  const [suPassword, setSuPassword] = useState<string>("");
  const [suConfirmPassword, setSuConfirmPassword] = useState<string>("");
  const [suFullName, setSuFullName] = useState<string>("");
  const [suStudentID, setSuStudentID] = useState<string>("");

  useEffect(() => {
    console.log(students);
  }, []);

  const suEmailAddressHandler = (e: any) => {
    setSuEmailAddress(e.target.value);
  };

  const suPasswordHandler = (e: any) => {
    setSuPassword(e.target.value);
  };

  const suConfirmPasswordHandler = (e: any) => {
    setSuConfirmPassword(e.target.value);
  };

  const suFullNameHandler = (e: any) => {
    setSuFullName(e.target.value);
  };

  const suStudentIDHandler = (e: any) => {
    setSuStudentID(e.target.value);
  };

  const signupHandler = (e: any) => {
    if (!checkIfConfirmPasswordsMatch(suPassword, suConfirmPassword)) {
      toast.error("Passwords do not match");
    } else if (isStudentIDValid()) {
      tryToFirestoreSignup();
    } else {
      toast.error("If you were not able to sign up please contact one of the officers");
    }
  };

  const checkIfConfirmPasswordsMatch = (
    firstPassword: string,
    secondPassword: string
  ): boolean => {
    return firstPassword === secondPassword;
  };

  async function checkStudentUIDFieldExists(
    user: any) {
      console.log(students);
      for (const student of students) {
        console.log(suStudentID);
        console.log(student.specialId);
        if (student.specialId === suStudentID) {
          console.log("yoooo");
          await updateDoc(doc(db, "users", student.docId), {studentUID: user.uid, docId: student.docId});
        }
      }
    }

  const isStudentIDValid = (): boolean => {
    isStudentIDInFirestore();
    //TODO: implement Password check
    if (isNaN(parseInt(suStudentID))) {
      toast.error("Special Identifier is not a number");
      return false;
    } else if (suStudentID.length !== 10) {
      console.log(suStudentID.length);
      toast.error(
        "Incorrect Number of Digits for Special Identifier. Please Check Again"
      );
      return false;
    }
    return true;
  };

  const isStudentIDInFirestore = (): boolean => {
    for (const student of students) {
      if (student.specialId === suStudentID) {
        return true;
      }
    }
    return false;
  }

  function tryToFirestoreSignup() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, suEmailAddress, suPassword).then((userCredential) => {
        toast.success("Sign Up Successful!");
        const user = userCredential.user;
        checkStudentUIDFieldExists(user);
      }).catch((error) => {
        console.log(error.message);
      });
      console.log(students);
  }



  return (
    <div className="flex justify-center">
      <Form className="bg-white/60 p-5 m-5 rounded-lg w-1/2">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <div className="bg-white/60 p-2 rounded-lg m-1 flex items-center text-center justify-center">
          <p className="m-2 px-2 py-0.5 bg-red-500 rounded-full flex items-center font-bold text-white">Important!</p>
          <p>You must be registered before you can sign up! <br></br>Please contact an officer if you are not yet registered.</p>
        </div>
        {/* Email and Password */}
        <div className="space-y-5">
          <Form.Group as={Row} className="mb-3 flex flex-col" controlId="formBasicEmail">
            <Form.Label className="font-bold">Email Address:</Form.Label>
            <Form.Control
              value={suEmailAddress}
              onChange={suEmailAddressHandler}
              type="text"
              placeholder="johnsmith@gmail.com"
              className="m-2 p-1 rounded-lg w-1/2"
            />
            <Form.Text className="text-muted">
              Please enter a valid non 997 number email
            </Form.Text>
          </Form.Group>

          <hr/>

          <Form.Group as={Row} className="mb-3 flex flex-col" controlId="formBasicPassword">
            <Form.Label className="font-bold">Password:</Form.Label>
            <Form.Control
              value={suPassword}
              onChange={suPasswordHandler}
              type="password"
              placeholder="Password"
              className="m-2 p-1 rounded-lg w-1/2"
            />
            <Form.Text id="passwordHelpBlock" muted>
              Your password must be 8-20 characters long, contain letters and
              numbers, and must not contain spaces, special characters, or
              emoji.
            </Form.Text>
          </Form.Group>

          <hr/>

          <Form.Group as={Row} className="mb-3 flex flex-col" controlId="formControlPassword">
            <Form.Label className="font-bold">Confirm Password:</Form.Label>
            <Form.Control
              value={suConfirmPassword}
              onChange={suConfirmPasswordHandler}
              type="password"
              placeholder="Password"
              className="m-2 p-1 rounded-lg w-1/2"
            />
            <Form.Text id="passwordHelpBlock" muted>
              Your password must be 8-20 characters long, contain letters and
              numbers, and must not contain spaces, special characters, or
              emoji.
            </Form.Text>
          </Form.Group>

          <hr />


        <Form.Group as={Row} className="mb-3 flex flex-col">
          <Form.Label className="font-bold">Full Name (First Middle Last):</Form.Label>
          <Form.Control
            value={suFullName}
            onChange={suFullNameHandler}
            type="text"
            placeholder="John Appleseed Smith"
            className="m-2 p-1 rounded-lg w-1/2"
          />
        </Form.Group>

        <hr />

        <Form.Group as={Row} className="mb-3 flex flex-col">
          <Form.Label className="font-bold">NHS Special ID:</Form.Label>
          <Form.Control
            value={suStudentID}
            onChange={suStudentIDHandler}
            type="text"
            placeholder="1234567890"
            className="m-2 p-1 rounded-lg w-1/2"
          />
        </Form.Group>
      </div>

        {/* Sign Up Button */}
        <Form.Group className="flex justify-center m-4">
          <Button onClick={signupHandler} className="bg-emerald-400 hover:bg-emerald-500 font-bold text-white p-2 rounded-lg"  variant="primary">
            Sign Up
          </Button>
        </Form.Group> 
      </Form>
    </div>
  );
};

export default Signup;
