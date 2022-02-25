import React from 'react';
import Table from "react-bootstrap/Table";
import { Student } from '../../App';
import { GradeAmountTabulation } from './AdminDashboard';

interface AdminDashboardStatsProps {
    students: Student[];
    gradesAmount: GradeAmountTabulation;
}

const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({
    students,
    gradesAmount,
  }) => {
    return (
      <div className="bg-white/60 p-3 rounded-2xl m-4">
        <Table striped bordered>
          <tbody>
            <tr>
              <td>
                <strong>Total Students:</strong>
              </td>
              <td>{students.length}</td>
            </tr>
            <tr>
              <td>
                <strong>Total Seniors:</strong>
              </td>
              <td>{gradesAmount.seniors}</td>
            </tr>
            <tr>
              <td>
                <strong>Total Juniors:</strong>
              </td>
              <td>{gradesAmount.juniors}</td>
            </tr>
            <tr>
              <td>
                <strong>Total Sophomores:</strong>
              </td>
              <td>{gradesAmount.sophomores}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  };

  export default AdminDashboardStats;