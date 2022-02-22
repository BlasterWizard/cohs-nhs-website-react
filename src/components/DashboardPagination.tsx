import React from 'react';
//import Components
import Nav from 'react-bootstrap/Nav';

interface DashboardPaginationProps {
    defaultActiveKey: string
}

export enum DashboardPaginationKeys {
    Dashboard = "dashboard",
    Attendance = "attendance",
    Projects = "projects",
    Profile = "profile"
}

const DashboardPagination: React.FC<DashboardPaginationProps> = ({defaultActiveKey}) => {
  return (
        <div className="bg-white/60 p-3 rounded-full m-3">
            <Nav variant="pills" defaultActiveKey={defaultActiveKey} className="flex space-x-5">
                <Nav.Item>
                    <Nav.Link eventKey="dashboard" href="/dashboard">Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="attendance" href="/attendance">Attendance</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="projects" href="/projects">Projects</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="profile" href="/profile">Profile</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default DashboardPagination;
