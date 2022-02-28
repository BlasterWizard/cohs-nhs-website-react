import * as React from 'react';
import { SelectionOption } from '../events-nodes/AdminEditEventModal';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import db from '../../../firebase';
import toast from 'react-hot-toast';
import { Modal, Button, Form} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Student } from '../../../App';

interface AdminAddNewProjectModalViewProps {
    show: boolean;
    handleClose: () => void;
    students: Student[];
}

interface AdminProjectDateViewProps {
    projectDate: Date;
    projectDates: Date[];
    index: number;
    setProjectDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

const AdminAddNewProjectModalView: React.FC<AdminAddNewProjectModalViewProps> = ({ students, show, handleClose}) => {
    const [studentOptions, setStudentOptions] = useState<SelectionOption[]>([]);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectTotalHoursServed, setProjectTotalHoursServed] = useState("");
    const [projectAttendees, setProjectAttendees] = useState<string[]>([]);
    const [projectLeadersDocID, setProjectLeadersDocID] = useState<string[]>([]);
    const [projectDates, setProjectDates] = useState<Date[]>([]);

    useEffect(() => {
        createStudentsOptions();
        clearFields();
    }, [students, show]);

    const clearFields = () => {
        setProjectName("");
        setProjectDescription("");
        setProjectTotalHoursServed("");
        setProjectLeadersDocID([]);
        setProjectAttendees([]);
        setProjectDates([]);
    }
    
    const projectNameTextHandler = (e: any) => {
        setProjectName(e.target.value);
    }

    const projectDescriptionTextHandler = (e: any) => {
        setProjectDescription(e.target.value);
    }

    const projectTotalHoursServedTextHandler = (e: any) => {
        setProjectTotalHoursServed(e.target.value);
    }

    const createStudentsOptions = () => {
        var items: SelectionOption[] = [];
        students.forEach((student) => {
            items.push({
                value: student.docId,
                label: student.name
            });
        });
        setStudentOptions(items);
    }

    const selectAttendeesHandler = (e: any) => {
        const items: string[] = [];
        if (e.length > 0) {
            e.forEach((entry: SelectionOption) => {
                items.push(entry.label);
            });
            setProjectAttendees(items);
        }
    }

    const selectProjectDatesHandler = (projectDate: Date) => {
        if (!checkIfDateIsInProjectDates(projectDate)) {
            setProjectDates(projectDates => [...projectDates, projectDate]); 
        }
    }

    const checkIfDateIsInProjectDates = (projectDate: Date):boolean => {
        for (var i = 0; i < projectDates.length; i++) {
            if (projectDates[i].getTime() === projectDate.getTime()) {
                return true;
            }
        }
        return false;
    }

    const selectLeadersHandler = (e: any) => {
        const items: string[] = [];
        if (e.length > 0) {
            e.forEach((entry: SelectionOption) => {
                items.push(entry.value);
            });
            setProjectLeadersDocID(items);
        }
    }

    async function addProject() {
        projectLeadersDocID.forEach(async (projectLeaderDocID) => {
            await updateDoc(doc(db, "users", projectLeaderDocID), {
                myProjects: arrayUnion({
                    attendees: projectAttendees,
                    dates: projectDates,
                    leaders: projectLeadersDocID,
                    projectDescription: projectDescription,
                    projectName: projectName,
                    totalHoursServed: projectTotalHoursServed
                })
            }).then(() => {
                handleClose();
            }).catch((error) => {
                toast.error(error.message);
            });
        });
    }

    return (
        <Modal size="lg" centered show={show} scrollable={true}>
            <Modal.Header closeButton>
                <Modal.Title>Add Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-10 space-y-3">
                    <p className="font-bold">Project Name:</p>
                    <Form.Control
                    value={projectName}
                    onChange={projectNameTextHandler}
                    type="text"
                    className="m-2 p-1 rounded-lg w-1/2"
                    />

                    <hr />

                    <p className="font-bold">Project Description:</p>
                    <Form.Control
                    value={projectDescription}
                    onChange={projectDescriptionTextHandler}
                    as="textarea"
                    rows={3}
                    />

                    <hr />

                    <p className="font-bold">Total Hours Served:</p>
                    <Form.Control
                    value={projectTotalHoursServed}
                    onChange={projectTotalHoursServedTextHandler}
                    type="text"
                    className="m-2 p-1 rounded-lg w-1/5 text-center"
                    />

                    <hr />

                    <p className="font-bold">Project Dates:</p>
                    <div className="flex space-x-2">
                        {
                            projectDates.map((projectDate: Date, index: number) => {
                                return <AdminProjectDateView projectDate={projectDate} projectDates={projectDates} setProjectDates={setProjectDates} key={index} index={index}/>
                                
                            })
                        }
                    </div>
                    <DatePicker
                    onChange={(date: Date) => selectProjectDatesHandler(date)}
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    showTimeInput
                    className="bg-blue-100 border-black border-solid border-2 rounded-full px-2" 
                    inline
                    />
                    <hr />

                    <p className="font-bold">Leaders:</p>
                    <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={studentOptions}
                    onChange={selectLeadersHandler}
                    className="w-1/2"
                    />

                    <hr />

                    <p className="font-bold">Attendees:</p>
                    <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={studentOptions}
                    onChange={selectAttendeesHandler}
                    className="w-1/2"
                    />

                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>
                Close
            </Button>
            <Button className="bg-emerald-400 hover:bg-emerald-500 font-bold text-white" onClick={addProject}>
                Add Project
            </Button>
            </Modal.Footer>
        </Modal>
    );
}

export const AdminProjectDateView: React.FC<AdminProjectDateViewProps> = ({projectDate, projectDates, index, setProjectDates}) => {

    const deleteSelectedProjectDate = () => {
        setProjectDates(projectDates => projectDates.filter((pd) => pd.getTime() !== projectDate.getTime()));
    }

    return (
        <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg">
            <p>{projectDate.toLocaleDateString()}</p>
            <button className="bg-red-500 px-1 rounded-full text-white" onClick={deleteSelectedProjectDate}>
                <i className="fas fa-minus"></i>
            </button>
        </div>
    );
}

export default AdminAddNewProjectModalView;
