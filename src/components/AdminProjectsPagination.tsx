import React from 'react';
import { Nav } from 'react-bootstrap';

export interface AdminProjectsPaginationProps {
    defaultActiveKey: AdminProjectsPaginationKeys
}

export enum AdminProjectsPaginationKeys {
    NHS = "admin-projects/NHS",
    nonNHS = "admin-projects/non-NHS"
}
 
const AdminProjectsPagination: React.FC<AdminProjectsPaginationProps> = ({defaultActiveKey}) => {
    return (  
        <div className="small-glass">
            <Nav variant="pills" defaultActiveKey={defaultActiveKey}>
                <Nav.Item>
                    <Nav.Link eventKey="admin-projects/NHS" href="/admin-projects/NHS">NHS</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="admin-projects/non-NHS" href="/admin-projects/non-NHS">Non-NHS</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
}
 
export default AdminProjectsPagination;