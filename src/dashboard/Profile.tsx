import React from "react";
import { Badge } from "react-bootstrap";
import { Student } from "../App";
import DashboardPagination, { DashboardPaginationKeys } from "../components/DashboardPagination";
import SpinnerNode from "../components/Spinner";

 interface ProfileProps {
  user: any;
  student: Student | undefined;
  isLoading: boolean;
}

const Profile: React.FC<ProfileProps> = ({ user, student, isLoading }) => {
  if (isLoading) {
    return <SpinnerNode />;
  }
  return (
    <main>
      <h1 className="text-4xl font-bold">Profile</h1>
      <DashboardPagination defaultActiveKey={DashboardPaginationKeys.Profile} />

      <div className="glass">
        {student?.isAdmin === true ? (
          <Badge pill className="success-badge admin-badge">
            Admin
          </Badge>
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
      </div>

      <div className="glass">
        <h5>
          If you find a <strong>bug</strong> or have any <strong>suggestions</strong>,
          it would be an awesome help if you could report it here!:
        </h5>
        <a className="link-btn" href="https://forms.gle/f4i5YVGBjrNChss37" target="_blank" rel="noopener noreferrer">
            Bug & Suggestion Report Form 
        </a>
      </div>
    </main>
  );
};

export default Profile;
