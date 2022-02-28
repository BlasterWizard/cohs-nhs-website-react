import * as React from 'react';
import { SelectionOption } from '../events-nodes/AdminEditEventModal';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Project, Student } from '../../../App';
import { AdminProjectDateView } from './AdminAddNewProjectModalView';
import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import toast from 'react-hot-toast';
import db from '../../../firebase';

interface AdminEditProjectViewProps {
    show: boolean;
    handleClose: () => void;
    students: Student[];
    project: Project;
    getStudentObjectFromID: (id:string) => Student | undefined;
}

const AdminEditProjectView: React.FC<AdminEditProjectViewProps> = ({project, show, handleClose, students, getStudentObjectFromID}) => {
    const [studentOptions, setStudentOptions] = useState<SelectionOption[]>([]);
    const [leadersDefaultOptions, setLeadersDefaultOptions] = useState<SelectionOption[]>([]);
    const [attendeesDefaultOptions, setAttendeesDefaultOptions] = useState<SelectionOption[]>([]);
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectDescription, setNewProjectDescription] = useState("");
    const [newProjectTotalHoursServed, setNewProjectTotalHoursServed] = useState("");
    const [newProjectAttendees, setNewProjectAttendees] = useState<string[]>([]);
    const [newProjectLeadersDocID, setNewProjectLeadersDocID] = useState<string[]>([]);
    const [newProjectDates, setNewProjectDates] = useState<Date[]>([]);

    useEffect(() => {
        setNewProjectName(project.projectName);
        setNewProjectDescription(project.projectDescription);
        setNewProjectTotalHoursServed(project.totalHoursServed.toString());
        setNewProjectDates(project.dates.map((timestamp) => new Date(timestamp.toDate())));
        createStudentsOptions();
        createAttendeesDefaultOptions();
        createLeadersDefaultOptions();
    }, [project]);

    const newProjectNameTextHandler = (e: any) => {
        setNewProjectName(e.target.value);
    }

    const newProjectDescriptionTextHandler = (e: any) => {
        setNewProjectDescription(e.target.value);
    }

    const newProjectTotalHoursServedTextHandler = (e: any) => {
        setNewProjectTotalHoursServed(e.target.value);
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

    const createLeadersDefaultOptions = () => {
        var items: SelectionOption[] = [];
        project.leaders.forEach((leaderDocID) => {
            items.push({
                value: leaderDocID,
                label: getStudentObjectFromID(leaderDocID)?.name ?? "Student Not Found"
            })
        });
        setLeadersDefaultOptions(items);
    }

    const createAttendeesDefaultOptions = () => {
        var items: SelectionOption[] = [];
        project.attendees.forEach((attendee) => {
            items.push({
                value: attendee,
                label: attendee
            })
        });
        setAttendeesDefaultOptions(items);
    }

    const newSelectAttendeesHandler = (e: any) => {
        const items: string[] = [];
        if (e.length > 0) {
            e.forEach((entry: SelectionOption) => {
                items.push(entry.label);
            });
            setNewProjectAttendees(items);
        }
    }

    const newSelectProjectDatesHandler = (projectDate: Date) => {
        if (!checkIfDateIsInProjectDates(projectDate)) {
            setNewProjectDates(projectDates => [...projectDates, projectDate]); 
        }
    }

    const checkIfDateIsInProjectDates = (projectDate: Date):boolean => {
        for (var i = 0; i < newProjectDates.length; i++) {
            if (newProjectDates[i].getTime() === projectDate.getTime()) {
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
            setNewProjectLeadersDocID(items);
        }
    }

    async function saveEditChanges() {
        const projectLeadersToDelete: string[] = project.leaders.filter((pl) => !newProjectLeadersDocID.includes(pl));
        console.log(projectLeadersToDelete);
        projectLeadersToDelete.forEach(async (projectLeaderDocID) => {
            await updateDoc(doc(db, "users", projectLeaderDocID), {
                myProjects: arrayRemove({
                    attendees: newProjectAttendees,
                    dates: newProjectDates,
                    leaders: project.leaders,
                    projectDescription: newProjectDescription,
                    projectName: newProjectName,
                    totalHoursServed: newProjectTotalHoursServed
                })
            }).catch((error) => {
                toast.error(error.message);
            });
        });

        newProjectLeadersDocID.forEach(async (projectLeaderDocID) => {
            await updateDoc(doc(db, "users", projectLeaderDocID), {
                myProjects: arrayUnion({
                    attendees: newProjectAttendees,
                    dates: newProjectDates,
                    leaders: project.leaders.filter((pl) => newProjectLeadersDocID.includes(pl)),
                    projectDescription: newProjectDescription,
                    projectName: newProjectName,
                    totalHoursServed: newProjectTotalHoursServed
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
            <Modal.Header>
                <Modal.Title>
                    Edit Project
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-10 space-y-3">
                    <p className="font-bold">Project Name:</p>
                    <Form.Control
                    value={newProjectName}
                    onChange={newProjectNameTextHandler}
                    type="text"
                    className="m-2 p-1 rounded-lg w-1/2"
                    />

                    <hr />

                    <p className="font-bold">Project Description:</p>
                    <Form.Control
                    value={newProjectDescription}
                    onChange={newProjectDescriptionTextHandler}
                    as="textarea"
                    rows={3}
                    />

                    <hr />

                    <p className="font-bold">Total Hours Served:</p>
                    <Form.Control
                    value={newProjectTotalHoursServed}
                    onChange={newProjectTotalHoursServedTextHandler}
                    type="text"
                    className="m-2 p-1 rounded-lg w-1/5 text-center"
                    />

                    <hr />

                    <p className="font-bold">Project Dates:</p>
                    <div className="flex space-x-2">
                        {
                            newProjectDates.map((projectDate: Date, index: number) => {
                                return <AdminProjectDateView projectDate={projectDate} projectDates={newProjectDates} setProjectDates={setNewProjectDates} key={index} index={index}/>
                                
                            })
                        }
                    </div>

                    <DatePicker
                    onChange={(date: Date) => newSelectProjectDatesHandler(date)}
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
                    defaultValue={leadersDefaultOptions}
                    options={studentOptions}
                    onChange={selectLeadersHandler}
                    className="w-1/2"
                    />

                    <hr />

                    <p className="font-bold">Attendees:</p>
                    <Select
                    closeMenuOnSelect={false}
                    isMulti
                    defaultValue={attendeesDefaultOptions}
                    options={studentOptions}
                    onChange={newSelectAttendeesHandler}
                    className="w-1/2"
                    />

                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Cancel</Button>
            <Button className="bg-emerald-400 hover:bg-emerald-500 font-bold text-white" onClick={saveEditChanges}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AdminEditProjectView;