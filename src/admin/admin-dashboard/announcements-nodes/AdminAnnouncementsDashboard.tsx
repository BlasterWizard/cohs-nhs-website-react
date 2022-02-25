import React, { useEffect, useState } from "react";
import { Student, Announcement } from "../../../App";
import AddNewAnnouncementView from "./AddNewAnnouncementView";
import AdminAnnouncementsView from "./AdminAnnouncementsView";

interface AdminAnnouncementsDashboardProps {
  student: Student | undefined;
  announcements: Announcement[];
}

const AdminAnnouncementsDashboard: React.FC<AdminAnnouncementsDashboardProps> =
  ({ student, announcements}) => {
    const [showAnnouncementsView, setShowAnnouncementsView] = useState(false);
    const [showNewAnnouncementView, setShowNewAnnouncementView] = useState(false);
    
    const toggleShowNewAnnouncementView = () => {
        showNewAnnouncementView ? setShowNewAnnouncementView(false) : setShowNewAnnouncementView(true);
    }

    const toggleShowAnnouncementsView = () => {
      showAnnouncementsView ? setShowAnnouncementsView(false) : setShowAnnouncementsView(true);
    }

    return (
      <div className="bg-white/60 p-5 rounded-2xl flex flex-col items-center">
        <h3 className="font-bold text-2xl">Announcement Dashboard</h3>
        <div className="space-y-3 flex flex-col mt-3">
          <button className="bg-indigo-400 py-1 px-3 rounded-full font-bold text-white" onClick={toggleShowAnnouncementsView}>
            View All Announcements <span className="bg-white/60 py-0.5 px-2 text-black rounded-full">{announcements.length}</span>
          </button>
          <button className="bg-green-400 py-1 px-2 rounded-full font-bold text-white" onClick={toggleShowNewAnnouncementView}>
            Add New Announcement
          </button>
        </div>
       
        <AdminAnnouncementsView show={showAnnouncementsView} handleClose={toggleShowAnnouncementsView} announcements={announcements} />
        <AddNewAnnouncementView show={showNewAnnouncementView} handleClose={toggleShowNewAnnouncementView} student={student} />
      </div>
    );
  };


export default AdminAnnouncementsDashboard;
