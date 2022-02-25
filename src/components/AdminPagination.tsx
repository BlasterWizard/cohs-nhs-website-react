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
        <div className="bg-white/60 p-3 rounded-full m-3">
            <Nav variant="pills" defaultActiveKey={defaultActiveKey}>
                <Nav.Item>
                    <Nav.Link eventKey="admin-dashboard" href="/admin-dashboard">Adminboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="admin-attendance" href="/admin-attendance">Attendance Sheet</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="admin-projects/NHS" href="/admin-projects/NHS">Projects Sheet</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="admin-settings" href="/admin-settings">Settings</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
}
 
export default AdminPagination;