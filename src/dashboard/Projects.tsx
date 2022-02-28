import React, { useEffect, useState } from "react";
import { Project, Student } from "../App";
import SpinnerNode from "../components/Spinner";
import DashboardPagination, {
  DashboardPaginationKeys,
} from "../components/DashboardPagination";
import { Button, Modal } from "react-bootstrap";
import { Timestamp } from "firebase/firestore";

export interface ProjectsProps {
  student: Student | undefined;
  isLoading: boolean;
  getStudentObjectFromID: (id: string) => Student | undefined;
}

interface ProjectViewAndModalProps {
  project: Project;
  show: boolean;
  handleClose: () => void;
  getStudentObjectFromID: (id: string) => Student | undefined;
}

const Projects: React.FC<ProjectsProps> = ({ student, isLoading, getStudentObjectFromID }) => {
  const [modalShow, setModalShow] = useState<boolean>(false);

  const toggleModalShow = () => {
    modalShow ? setModalShow(false) : setModalShow(true);
  }

  if (isLoading) {
    return <SpinnerNode />;
  }

  return (
    <main>
      <h1 className="text-4xl font-bold">NHS Led Projects </h1>

      <DashboardPagination
        defaultActiveKey={DashboardPaginationKeys.Projects}
      ></DashboardPagination>

      {student?.myProjects && student?.myProjects.length === 0 ? (
        <h4 className="font-bold m-10 bg-white/60 rounded-full p-2">No Projects Found</h4>
      ) : (
        student?.myProjects.map((ledProject: Project, index: number) => {
          return <button onClick={toggleModalShow} key={index}><ProjectView project={ledProject} show={modalShow} handleClose={toggleModalShow} getStudentObjectFromID={getStudentObjectFromID} key={index}/></button>;
        })
      )}
    </main>
  );
};

const ProjectView: React.FC<ProjectViewAndModalProps> = ({project, show, handleClose, getStudentObjectFromID}) => {
  return (
    <div className="bg-white/60 p-20 rounded-lg hover:drop-shadow-2xl hover:bg-sky-100">
      <h4 className="text-xl font-bold">{project.projectName}</h4>
      <p>{new Date(project.dates[0].toDate()).toLocaleDateString()} - {new Date(project.dates[project.dates.length - 1].toDate()).toLocaleDateString()}</p>
      <ProjectDetailModal project={project} show={show} handleClose={handleClose} getStudentObjectFromID={getStudentObjectFromID}/>
    </div>

  );
};

export const ProjectDetailModal: React.FC<ProjectViewAndModalProps> = ({project, show, handleClose, getStudentObjectFromID}) => {
  return (
    <div>
      <Modal scrollable={true} show={show} centered>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="font-bold">
            {project.projectName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="py-2">
            <h3 className="font-bold">Project Dates:</h3>
              {
                project.dates.map((timestamp: Timestamp, index: number) => {
                  return <p key={index}>{new Date(timestamp.toDate()).toLocaleDateString()}</p>
                })
              }
          </div>

          <hr/>

          <div className="py-2">
            <h3 className="font-lg font-bold">Project Leaders:</h3>
            {
              project.leaders.map((leaderDocID: string, index: number) => {
                  const studentObj = getStudentObjectFromID(leaderDocID);
                  return <h4 key={index}>{studentObj?.name}</h4>
              })
            }
          </div>
          <hr/>
          
          <div className="py-2">
            <h3 className="font-lg font-bold">Project Description:</h3>
            <p>{project.projectDescription}</p>
          </div>
          <hr/>

          <div className="py-2">
            <h3 className="font-lg font-bold">Project Attendees:</h3>
            {
              project.attendees.map((attendee: string, index: number) => {
                return <h4 key={index}>{attendee}</h4>
              })
            }
          </div>
         
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} className="bg-rose-500 hover:bg-rose-600 font-bold" >Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Projects;
