import React, { useState } from "react";
import { Student } from "../../App";
import DashboardPagination, { DashboardPaginationKeys } from "../../components/DashboardPagination";
import SpinnerNode from "../../components/Spinner";
import ProfileEditView from "./ProfileEditView";

 interface ProfileProps {
  user: any;
  student: Student | undefined;
  isLoading: boolean;
}

const Profile: React.FC<ProfileProps> = ({ user, student, isLoading }) => {
  const [showProfileEditView, setShowProfileEditView] = useState(false);

  const toggleShowProfileEditView = () => {
    showProfileEditView ? setShowProfileEditView(false) : setShowProfileEditView(true);
  }
  
  if (isLoading) {
    return <SpinnerNode />;
  }

  return (
    <main>
      <h1 className="text-4xl font-bold">Profile</h1>
      <DashboardPagination defaultActiveKey={DashboardPaginationKeys.Profile} />

      <div className="bg-white/60 p-3 rounded-lg space-y-3 flex flex-col items-center">
        {student?.isAdmin === true ? (
          <p className="bg-emerald-400 p-0.5 px-1 rounded-full w-fit text-sm font-bold text-white">
            Admin
          </p>
        ) : (
          ""
        )}
        <h6>
          <strong>Name:</strong>{" "}
          {student ? student.name : "Unable to display name"}
        </h6>
        <h6>
          <strong>Email:</strong>{" "}
          {user ? user.email : "Unable to display email"}
        </h6>
        <h6>
          <strong>Grade:</strong>{" "}
          {student ? student.grade : "Unable to display grade"}
        </h6>
        <h6>
          <strong>Special ID:</strong>{" "}
          {student ? student.specialId : "Unable to display Student ID"}
        </h6>
        <button className="bg-indigo-400 hover:bg-indigo-500 py-1 px-3 rounded-full font-bold text-white" onClick={toggleShowProfileEditView}><p>Edit</p></button>
      </div>

      <div className="bg-white/60 p-3 rounded-lg m-10 flex flex-col items-center">
        <h5>
          If you find a <strong>bug</strong> or have any <strong>suggestions</strong>,
          it would be an awesome help if you could report it here!:
        </h5>
        <a className="block bg-indigo-300 hover:bg-indigo-400 hover:scale-120 p-2 rounded-full m-2 text-white font-bold w-fit" href="https://forms.gle/f4i5YVGBjrNChss37" target="_blank" rel="noopener noreferrer">
            Bug & Suggestion Report Form 
        </a>
      </div>

      <ProfileEditView show={showProfileEditView} handleClose={toggleShowProfileEditView} student={student} user={user} />
    </main>
  );
};

export default Profile;
