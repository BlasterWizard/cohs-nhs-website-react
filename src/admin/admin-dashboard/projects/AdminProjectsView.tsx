import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Project, Student } from '../../../App';
import { ProjectDetailModal } from '../../../dashboard/Projects';
import db from '../../../firebase';
import AdminEditProjectView from './AdminEditProjectView';


interface AdminProjectsViewProps {
    allProjects: Project[];
    show: boolean;
    handleClose: () => void;
    getStudentObjectFromID: (id: string) => Student | undefined;
    students: Student[];
}

interface AdminProjectViewProps {
    project: Project;
    getStudentObjectFromID: (id: string) => Student | undefined;
    students: Student[];
}

interface AdminDeleteProjectConfirmationModalProps {
    project: Project;
    show: boolean;
    handleClose: () => void;
    getStudentObjectFromID: (id: string) => Student | undefined;
}



const AdminProjectsView: React.FC<AdminProjectsViewProps> = ({ allProjects , show, handleClose, getStudentObjectFromID, students }) => {
    return (
    <Modal size="lg" centered show={show} scrollable={true}>
        <Modal.Header>
          <Modal.Title>
            View Projects
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="space-y-3 flex flex-col items-center">
            {allProjects.length > 0 ? allProjects.map((project: Project, index: number) => (
                <AdminProjectView project={project} key={index} getStudentObjectFromID={getStudentObjectFromID} students={students}/>
            )) : <p className="font-bold text-center">No Projects</p>}
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>

    );
}

const AdminProjectView: React.FC<AdminProjectViewProps> = ({project, getStudentObjectFromID, students}) => {
    const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
    const [showConfirmDeleteProjectModal, setShowConfirmDeleteProjectModal] = useState(false);
    const [showProjectEditModal, setShowProjectEditModal] = useState(false);

    const toggleShowProjectDetailModal = () => {
        showProjectDetailModal ? setShowProjectDetailModal(false) : setShowProjectDetailModal(true);
    }

    const toggleShowConfirmDeleteProjectModal = () => {
        showConfirmDeleteProjectModal ? setShowConfirmDeleteProjectModal(false) : setShowConfirmDeleteProjectModal(true);
    }

    const toggleShowProjectEditModal = () => {
        showProjectEditModal ? setShowProjectEditModal(false) : setShowProjectEditModal(true);
    }

    return (
        <div className="bg-indigo-100 p-2 rounded-lg flex flex-row w-3/4 items-center">
            <strong>{project.projectName}</strong>
    
            <div className="flex-grow"></div>
    
            <div className="flex space-x-3">
                <button
                    className="bg-sky-300 hover:bg-sky-400 rounded-full p-1 px-2"
                    onClick={toggleShowProjectDetailModal}
                >
                    <h3 className="text-white font-bold">Info</h3>
                </button>
                <button
                    className="bg-rose-400 hover:bg-rose-500 rounded-full px-2.5"
                    onClick={toggleShowConfirmDeleteProjectModal}
                >
                    <i className="fas fa-minus text-white"></i>
                </button>
                <button className="bg-indigo-400 hover:bg-indigo-500 py-0.5 px-2 rounded-full text-white" onClick={toggleShowProjectEditModal}>
                    <h3 className="font-bold">Edit</h3>
                </button>
            </div>
            <ProjectDetailModal show={showProjectDetailModal} handleClose={toggleShowProjectDetailModal} project={project} getStudentObjectFromID={getStudentObjectFromID} />
            <AdminDeleteProjectConfirmationModal show={showConfirmDeleteProjectModal} handleClose={toggleShowConfirmDeleteProjectModal} project={project} getStudentObjectFromID={getStudentObjectFromID}/>
            <AdminEditProjectView show={showProjectEditModal} handleClose={toggleShowProjectEditModal} students={students} project={project} getStudentObjectFromID={getStudentObjectFromID}/>
      </div>
    );
}

const AdminDeleteProjectConfirmationModal: React.FC<AdminDeleteProjectConfirmationModalProps> = ({show, handleClose, project, getStudentObjectFromID}) => {
    async function deleteProject() {
        project.leaders.forEach(async (leaderDocID: string) => {
            await updateDoc(doc(db, "users", leaderDocID), {
                myProjects: arrayRemove({
                    attendees: project.attendees,
                    dates: project.dates,
                    leaders: project.leaders,
                    projectDescription: project.projectDescription,
                    projectName: project.projectName,
                    totalHoursServed: project.totalHoursServed
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
                    Confirm Project Deletion
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p>Are you sure you want to delete <span className="font-bold">{project.projectName}</span> from these students?:</p>
               <div className="space-y-3 list-disc mt-3">
                {
                    project.leaders.map((leaderDocID: string, index: number) => {
                        const studentObj = getStudentObjectFromID(leaderDocID);
                        return <li key={index}>{studentObj?.name}</li>
                    })
                }
               </div>
              
            </Modal.Body>
            <Modal.Footer>
            <Button className="bg-red-500 hover:bg-red-600 font-bold text-white" onClick={handleClose}>Cancel</Button>
            <Button className="bg-emerald-400 hover:bg-emerald-500 font-bold text-white" onClick={deleteProject}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}




export default AdminProjectsView;