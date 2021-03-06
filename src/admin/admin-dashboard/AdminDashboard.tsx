import React, { useState, useEffect } from "react";
import { Announcement, Event, Setting, Student } from "../../App";
import "react-datepicker/dist/react-datepicker.css";
import AdminPagination, {
  AdminPaginationKeys,
} from "../../components/AdminPagination";
import SpinnerNode from "../../components/Spinner";
import AdminDashboardStats from "./AdminDashboardStats";
import AdminEventsDashboard from "./events-nodes/AdminEventsDashboard";
import AdminStudentsDashboard from "./students-nodes/AdminStudentsDashboard";
import AdminAnnouncementsDashboard from "./announcements-nodes/AdminAnnouncementsDashboard";
import AdminRequiredHoursView from "./AdminRequiredHoursView";
import AdminProjectsDashboard from "./projects/AdminProjectsDashboard";
import AdminFAQDashboard from "./faqs/AdminFAQDashboard";
import { FAQNode } from "../../pages/FAQs";

interface AdminDashboardProps {
  students: Student[];
  student: Student | undefined;
  events: Event[];
  isLoading: boolean;
  announcements: Announcement[];
  getStudentNameFromID: (id:string) => string;
  getStudentObjectFromID: (id:string) => Student | undefined;
  settings: Setting;
  faqs: FAQNode[];
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
  getStudentNameFromID,
  getStudentObjectFromID,
  settings,
  faqs
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
            seniors: prevGradesAmount.seniors + 1,
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
      <div className="flex flex-col sm:flex-row">
        <AdminDashboardStats students={students} gradesAmount={gradesAmount} />
        <AdminRequiredHoursView settings={settings}/>
      </div>
     
        <div className="grid grid-cols-2 grid-flow-row gap-3">
          <AdminAnnouncementsDashboard student={student} announcements={announcements}/>
          <AdminStudentsDashboard students={students} />
          <AdminEventsDashboard events={events} students={students} getStudentNameFromID={getStudentNameFromID}/>
          <AdminProjectsDashboard students={students} getStudentObjectFromID={getStudentObjectFromID}/>
        </div>

        <div className="flex flex-col space-y-5 mt-3">
          <AdminFAQDashboard faqs={faqs} />
        </div>
    </main>
  );
};

export default AdminDashboard;
