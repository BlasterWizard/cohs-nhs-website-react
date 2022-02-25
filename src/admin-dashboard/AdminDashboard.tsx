import React, { useState, useEffect } from "react";
import { Announcement, Event, Student } from "../App";
import "react-datepicker/dist/react-datepicker.css";
import AdminPagination, {
  AdminPaginationKeys,
} from "../components/AdminPagination";
import SpinnerNode from "../components/Spinner";
import AdminDashboardStats from "./AdminDashboardStats";
import AdminEventsDashboard from "./events-nodes/AdminEventsDashboard";
import AdminStudentsDashboard from "./students-nodes/AdminStudentsDashboard";
import AdminAnnouncementsDashboard from "./announcements-nodes/AdminAnnouncementsDashboard";

interface AdminDashboardProps {
  students: Student[];
  student: Student | undefined;
  events: Event[];
  isLoading: boolean;
  announcements: Announcement[];
  getStudentNameFromID: (id:string) => string;
}

export interface GradeAmountTabulation {
  seniors: number;
  juniors: number;
  sophomores: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  student,
  events,
  announcements,
  isLoading,
  getStudentNameFromID
}) => {
  const [gradesAmount, setGradesAmount] = useState<GradeAmountTabulation>({
    seniors: 0,
    juniors: 0,
    sophomores: 0,
  });

  useEffect(() => {
    setGradesAmount({ seniors: 0, juniors: 0, sophomores: 0 });
    tabulateRespectiveGradeLevelAmount();
  }, [students]);

  function tabulateRespectiveGradeLevelAmount() {
    students.forEach((student) => {
      switch (student.grade) {
        case 12:
          setGradesAmount((prevGradesAmount) => ({
            ...prevGradesAmount,
            seniores: prevGradesAmount.seniors + 1,
          }));
          break;
        case 11:
          setGradesAmount((prevGradesAmount) => ({
            ...prevGradesAmount,
            juniors: prevGradesAmount.juniors + 1,
          }));
          break;
        case 10:
          setGradesAmount((prevGradesAmount) => ({
            ...prevGradesAmount,
            sophomores: prevGradesAmount.sophomores + 1,
          }));
          break;
        default:
          setGradesAmount((prevGradesAmount) => ({
            ...prevGradesAmount,
          }));
      }
    });
  }

  if (isLoading) {
    return <SpinnerNode />;
  }

  return (
    <main>
      <h2 className="text-4xl font-bold">Admin Dashboard</h2>
      <AdminPagination defaultActiveKey={AdminPaginationKeys.AdminDashboard} />
      <AdminDashboardStats students={students} gradesAmount={gradesAmount} />

      <div className="flex flex-col space-y-5">
        <AdminAnnouncementsDashboard student={student} announcements={announcements}/>
        <AdminStudentsDashboard students={students} />
        <AdminEventsDashboard events={events} students={students} getStudentNameFromID={getStudentNameFromID}/>
      </div>
     
    </main>
  );
};

export default AdminDashboard;
