import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { TermDates } from "../App";
import DatePicker from "react-datepicker";
import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import toast from "react-hot-toast";

interface AdminTermDatesViewProps {
  termDates: TermDates | undefined;
}

interface AdminSetTermDatesModalProps {
  termDates: TermDates | undefined;
  show: boolean;
  handleClose: () => void;
}

const AdminTermDatesView: React.FC<AdminTermDatesViewProps> = ({termDates}) => {
    const [showSetTermDates, setSetTermDates] = useState(false);
    
    const toggleSetTermDates = () => {
        showSetTermDates ? setSetTermDates(false) : setSetTermDates(true);
    }

    return(
        <div className="bg-white/60 p-5 rounded-2xl flex flex-col items-center">
          <h3 className="font-bold text-2xl">Term Dates</h3>
          <div className="space-y-3 flex flex-col mt-3">
            <p><span className="font-bold mr-2">Term 1:</span>{termDates?.term1StartDate.toLocaleDateString("en-US") ?? "NULL"} - {termDates?.term1EndDate.toLocaleDateString("en-US") ?? "NULL"}</p>
            <p><span className="font-bold mr-2">Term 2:</span>{termDates?.term2StartDate.toLocaleDateString("en-US") ?? "NULL"} - {termDates?.term2EndDate.toLocaleDateString("en-US") ?? "NULL"}</p>
            <p><span className="font-bold mr-2">Term 3:</span>{termDates?.term3StartDate.toLocaleDateString("en-US") ?? "NULL"} - {termDates?.term3EndDate.toLocaleDateString("en-US") ?? "NULL"}</p>
            <p><span className="font-bold mr-2">Term 4:</span>{termDates?.term4StartDate.toLocaleDateString("en-US") ?? "NULL"} - {termDates?.term4EndDate.toLocaleDateString("en-US") ?? "NULL"}</p>
            <button className="bg-indigo-300 py-1 px-2 rounded-full font-bold text-white" onClick={toggleSetTermDates}>
              Edit Term Dates
            </button>
          </div>
          <AdminSetTermDatesModal termDates={termDates} show={showSetTermDates} handleClose={toggleSetTermDates} />
        </div>
    );
}

const AdminSetTermDatesModal: React.FC<AdminSetTermDatesModalProps> = ({ termDates, show, handleClose }) => {
  const [newTermDates, setNewTermDates] = useState<TermDates>({
    term1StartDate: termDates?.term1StartDate ?? new Date(),
    term1EndDate: termDates?.term1EndDate ?? new Date(),
    term2StartDate: termDates?.term2StartDate ?? new Date(),
    term2EndDate: termDates?.term2EndDate ?? new Date(),
    term3StartDate: termDates?.term3StartDate ?? new Date(),
    term3EndDate: termDates?.term3EndDate ?? new Date(),
    term4StartDate: termDates?.term4StartDate ?? new Date(),
    term4EndDate: termDates?.term4EndDate ?? new Date()
  });

  async function saveTermDatesChanges() {
    await updateDoc(doc(db, "settings", "termDates"), {
      term1StartDate: newTermDates.term1StartDate,
      term1EndDate: newTermDates.term1EndDate,
      term2StartDate: newTermDates.term2StartDate,
      term2EndDate: newTermDates.term2EndDate,
      term3StartDate: newTermDates.term3StartDate,
      term3EndDate: newTermDates.term3EndDate,
      term4StartDate: newTermDates.term4StartDate,
      term4EndDate: newTermDates.term4EndDate
    }).then(() => {
      toast.success("Term Dates successfully updated");
      handleClose();
    }).catch((error) => {
      toast.error(error.message);
    });
  }

  return (
    <Modal
    size="lg"
    centered
    show={show}
    scrollable={true}
  >
    <Modal.Header>
      <Modal.Title>
        Set Term Dates
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="space-y-3">
        {/* TERM 1 */}
        <div className="flex space-x-5">
          <div>
            <p className="font-bold">Term 1 Start Date:</p> 
            <DatePicker
            selected={newTermDates.term1StartDate}
            onChange={(date: Date) => setNewTermDates({...newTermDates, term1StartDate: date})}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            className="bg-blue-100 border-black border-solid border-2 rounded-full px-2" 
            />
          </div>

          <div>
            <p className="font-bold">Term 1 End Date:</p> 
            <DatePicker
            selected={newTermDates.term1EndDate}
            onChange={(date: Date) => setNewTermDates({...newTermDates, term1EndDate: date})}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            className="bg-blue-100 border-black border-solid border-2 rounded-full px-2" 
            />
          </div>
        </div>
        
        <hr />

        {/* TERM 2 */}
        <div className="flex space-x-5">
          <div>
            <p className="font-bold">Term 2 Start Date:</p> 
            <DatePicker
            selected={newTermDates.term2StartDate}
            onChange={(date: Date) => setNewTermDates({...newTermDates, term2StartDate: date})}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            className="bg-blue-100 border-black border-solid border-2 rounded-full px-2" 
            />
          </div>
          <div>
            <p className="font-bold">Term 2 End Date:</p> 
            <DatePicker
            selected={newTermDates.term2EndDate}
            onChange={(date: Date) => setNewTermDates({...newTermDates, term2EndDate: date})}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            className="bg-blue-100 border-black border-solid border-2 rounded-full px-2" 
            />
          </div>
        </div>

        <hr />

        {/* TERM 3 */}
        <div className="flex space-x-5">
          <div>
            <p className="font-bold">Term 3 Start Date:</p> 
            <DatePicker
            selected={newTermDates.term3StartDate}
            onChange={(date: Date) => setNewTermDates({...newTermDates, term3StartDate: date})}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            className="bg-blue-100 border-black border-solid border-2 rounded-full px-2" 
            />
          </div>
          <div>
            <p className="font-bold">Term 3 End Date:</p> 
            <DatePicker
            selected={newTermDates.term3EndDate}
            onChange={(date: Date) => setNewTermDates({...newTermDates, term3EndDate: date})}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            className="bg-blue-100 border-black border-solid border-2 rounded-full px-2" 
            />
          </div>
        </div>
        <hr />

        {/* TERM 4 */}
        <div className="flex space-x-5">
          <div>
            <p className="font-bold">Term 4 Start Date:</p> 
            <DatePicker
            selected={newTermDates.term4StartDate}
            onChange={(date: Date) => setNewTermDates({...newTermDates, term4StartDate: date})}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            className="bg-blue-100 border-black border-solid border-2 rounded-full px-2" 
            />
          </div>
          <div>
            <p className="font-bold">Term 4 End Date:</p> 
            <DatePicker
            selected={newTermDates.term4EndDate}
            onChange={(date: Date) => setNewTermDates({...newTermDates, term4EndDate: date})}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            className="bg-blue-100 border-black border-solid border-2 rounded-full px-2" 
            />
          </div>
        </div>
      </div>
        

    </Modal.Body>
    <Modal.Footer>
      <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Close</Button>
      <Button className="bg-emerald-500 hover:bg-emerald-600 font-bold text-white" onClick={saveTermDatesChanges}>Save Changes</Button>
    </Modal.Footer>
  </Modal>
  );
}

export default AdminTermDatesView;