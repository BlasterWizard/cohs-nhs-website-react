import React from 'react';
//import Components
import Nav from 'react-bootstrap/Nav';

export interface AdminPaginationProps {
    defaultActiveKey: AdminPaginationKeys
}

export enum AdminPaginationKeys {
    AdminDashboard = "admin-dashboard",
    AdminAttendance = "admin-attendance",
    AdminProjects = "admin-projects/NHS",
    AdminSettings = "admin-settings"
}

const AdminPagination: React.FC<AdminPaginationProps> = ({defaultActiveKey}) => {
    return (  
        <div className="bg-white/60 rounded-2xl p-3 m-3">
            <Nav variant="pills" defaultActiveKey={defaultActiveKey} className="flex flex-col sm:flex-row items-center">
                <Nav.Item>
                    <Nav.Link eventKey="admin-dashboard" href="/admin-dashboard">Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="admin-attendance" href="/admin-attendance">Attendance</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="admin-projects/NHS" href="/admin-projects/NHS">Project Hours</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="admin-settings" href="/admin-settings">Settings</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
}
 
export default AdminPagination;