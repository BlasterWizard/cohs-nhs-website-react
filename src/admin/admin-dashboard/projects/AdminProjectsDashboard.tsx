import * as React from 'react';
import { useState, useEffect } from 'react';
import { Project, Student } from '../../../App';
import AdminAddNewProjectModalView from './AdminAddNewProjectModalView';
import AdminProjectsView from './AdminProjectsView';

interface AdminProjectsDashboardProps {
    students: Student[];
    getStudentObjectFromID: (id: string) => Student | undefined;
}

const AdminProjectsDashboard: React.FC<AdminProjectsDashboardProps> = ({students, getStudentObjectFromID}) => {
    const [showAddNewProjectModal, setShowAddNewProjectModal] = useState(false);
    const [showProjects, setProjects] = useState(false);
    const [allProjects, setAllProjects] = useState<Project[]>([]);

    useEffect(() => {
        findAllStudentProjects();
    }, [students]);

    const findAllStudentProjects = () => {
        const projects: Project[] = [];
        students.forEach((student) => {
            if (student.myProjects.length > 0) {
                student.myProjects.forEach((project) => {
                    if (!isProjectInAllProjects(project, projects)) {
                        console.log(projects);
                        projects.push(project);
                    }
                });
            }
        });
        setAllProjects(projects);
    }

    const isProjectInAllProjects = (project: Project, projects: Project[]):boolean => {
        if (projects.length > 0) {
            for (var i = 0; i < projects.length; i++) {
                if (projects[i].projectName === project.projectName) {
                    return true;
                }
            }
        }
        return false;
    }

    const toggleShowAddNewProjectModal = () => {
        showAddNewProjectModal ? setShowAddNewProjectModal(false) : setShowAddNewProjectModal(true);
    }

    const toggleShowProjects = () => {
        showProjects ? setProjects(false) : setProjects(true);
    }

    return (
        <div className="bg-white/60 p-5 rounded-2xl flex flex-col items-center">
            <h3 className="text-2xl font-bold">Projects Dashboard</h3>
            <div className="space-y-3 flex flex-col mt-3">
                <button className="bg-indigo-400 py-1 px-3 rounded-full font-bold text-white" onClick={toggleShowProjects}>View All Projects</button>
                <button className="bg-green-400 py-1 px-2 rounded-full font-bold text-white" onClick={toggleShowAddNewProjectModal}>
                Add New Project
                </button>
            </div>
            <AdminAddNewProjectModalView show={showAddNewProjectModal} handleClose={toggleShowAddNewProjectModal} students={students}/>
            <AdminProjectsView show={showProjects} handleClose={toggleShowProjects} allProjects={allProjects} getStudentObjectFromID={getStudentObjectFromID} students={students}/>
        </div>
    );
}

export default AdminProjectsDashboard;