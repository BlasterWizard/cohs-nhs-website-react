import React, { useState, useEffect } from "react";
import { Student } from "../App";
import AdminPagination, {
  AdminPaginationKeys,
} from "../components/AdminPagination";
import SpinnerNode from "../components/Spinner";
import AddAdminModalView from "./AddAdminModalView";
import AdminsModalView from "./AdminsModalView";

interface AdminSettingsProps {
  students: Student[];
  isLoading: boolean;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({
  students,
  isLoading,
}) => {
  const [admins, setAdmins] = useState<Student[]>([]);
  const [showAdminsView, setShowAdminsView] = useState(false);
  const [showAddAdminView, setAddAdminView] = useState(false);

  const toggleShowAdminsView = () => {
    showAdminsView ? setShowAdminsView(false) : setShowAdminsView(true);
  }

  const toggleShowAddAdminView = () => {
    showAddAdminView ? setAddAdminView(false) : setAddAdminView(true);
  }

  // fetchAdmins();
  useEffect(() => {
    fetchAdmins();
  }, [students]);


  function fetchAdmins() {
    var items: Student[] = [];
    students.forEach((student) => {
      if (student.isAdmin) {
        items.push(student);
      }
    });
    items = items.sort((a, b) => a.name.localeCompare(b.name));
    setAdmins(items);
  }

  if (isLoading) {
    return <SpinnerNode />;
  }

  return (
    <main>
      <h2 className="font-bold text-4xl">Settings</h2>
      <AdminPagination defaultActiveKey={AdminPaginationKeys.AdminSettings} />

      <div className="bg-white/60 p-5 rounded-2xl flex flex-col items-center">
        <h3 className="font-bold text-2xl">Admins</h3>
        <div className="space-y-3 flex flex-col mt-3">
          <button className="bg-indigo-400 py-1 px-3 rounded-full font-bold text-white" onClick={toggleShowAdminsView}>
            View All Admins <span className="bg-white/60 py-0.5 px-2 text-black rounded-full">{admins.length}</span>
          </button>
          <button className="bg-green-400 py-1 px-2 rounded-full font-bold text-white" onClick={toggleShowAddAdminView}>
            Add New Admin
          </button>
        </div>
      </div>
      <AdminsModalView admins={admins} show={showAdminsView} handleClose={toggleShowAdminsView} />
      <AddAdminModalView students={students} show={showAddAdminView} handleClose={toggleShowAddAdminView} />
    </main>
  );
};


export default AdminSettings;
