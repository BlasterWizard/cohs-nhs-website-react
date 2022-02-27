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
    // bg-white/60 p-3 rounded-full m-3
        <div className="bg-white/60 rounded-2xl p-3 m-3">
            <Nav variant="pills" defaultActiveKey={defaultActiveKey} className="flex flex-col sm:flex-row items-center">
                <Nav.Item>
                    <Nav.Link eventKey="dashboard" href="/dashboard" className="text-sm sm:text-lg">Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="attendance" href="/attendance" className="text-sm sm:text-lg">Attendance</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="projects" href="/projects" className="text-sm sm:text-lg">Projects</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="profile" href="/profile" className="text-sm sm:text-lg">Profile</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default DashboardPagination;
