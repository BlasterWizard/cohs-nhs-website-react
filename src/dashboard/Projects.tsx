import React, { useEffect, useState } from "react";
import { Project, Student } from "../App";
import SpinnerNode from "../components/Spinner";
import DashboardPagination, {
  DashboardPaginationKeys,
} from "../components/DashboardPagination";
import { Badge, Button, Modal } from "react-bootstrap";

export interface ProjectsProps {
  student: Student | undefined;
  isLoading: boolean;
  getStudentNameFromID: (id: string) => string;
}

interface ProjectViewAndModalProps {
  project: Project;
  show: boolean;
  handleClose: () => void;
  getStudentNameFromID: (id: string) => string;
}

const Projects: React.FC<ProjectsProps> = ({ student, isLoading, getStudentNameFromID }) => {
  const [modalShow, setModalShow] = useState<boolean>(false);

  useEffect(() => {
    console.log(student?.myProjects);
  }, [student]);

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
        <h4 className="no-found small-glass">No Projects Found</h4>
      ) : (
        student?.myProjects.map((ledProject: Project, index: number) => {
          return <button onClick={toggleModalShow} key={index}><ProjectView project={ledProject} show={modalShow} handleClose={toggleModalShow} getStudentNameFromID={getStudentNameFromID} key={index}/></button>;
        })
      )}
    </main>
  );
};

const ProjectView: React.FC<ProjectViewAndModalProps> = ({project, show, handleClose, getStudentNameFromID}) => {
  return (
    <div className="glass hover:drop-shadow-2xl hover:bg-sky-100">
      <h4 className="text-xl font-bold">{project.projectName}</h4>
      <ProjectDetailModal project={project} show={show} handleClose={handleClose} getStudentNameFromID={getStudentNameFromID}/>
    </div>

  );
};

const ProjectDetailModal: React.FC<ProjectViewAndModalProps> = ({project, show, handleClose, getStudentNameFromID}) => {
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
            <h3 className="font-lg font-bold">Project Leaders:</h3>
            {
              project.leaders.map((leader: string, index: number) => {
                if (!isNaN(parseInt(leader))) {
                  const studentLeaderName = getStudentNameFromID(leader);
                  return <h4 key={index}>{studentLeaderName}</h4>
                }
                return <h4 key={index}>{leader}</h4>
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
