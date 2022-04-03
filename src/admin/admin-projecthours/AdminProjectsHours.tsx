import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Event, Student } from "../../App";
import AdminPagination, {
  AdminPaginationKeys,
} from "../../components/AdminPagination";
import GradeSelectionDropdown from "../../components/GradeSelectionDropdown";
import SpinnerNode from "../../components/Spinner";
import { GradeType, StudentSheetChange } from "../admin-attendance/AdminAttendance";
import { SelectionOption } from "../admin-dashboard/events-nodes/AdminEditEventModal";
import AdminProjectChangesModal from "./AdminProjectHoursChangesModal";
import StudentProjectsRow from "./StudentProjectHoursRow";

interface AdminProjectsHoursProps {
  events: Event[];
  students: Student[];
  isLoading: boolean;
}

const AdminProjectHours: React.FC<AdminProjectsHoursProps> = ({
  events,
  students,
  isLoading,
}) => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [projectChanges, setProjectChanges] = useState<StudentSheetChange[]>([]);
  const [projectEvents, setProjectEvents] = useState<Event[]>([]);
  const [totalProjectHoursSheetChanges, setTotalProjectHoursSheetChanges] = useState(0);
  const [show, setShow] = useState(false);
  const [tableGradeSelection, setTableGradeSelection] = useState<SelectionOption>({
    value: GradeType.Senior, 
    label: "Seniors"
});


  useEffect(() => {
    setStudentList(students.sort((a, b) => a.name.localeCompare(b.name)));
    setProjectEvents(events.filter((el) => el.hasProjectHours === true));
  }, [students, events]);

  useEffect(() => {
   calculateProjectHourSheetChanges();
  }, [projectChanges]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };

  const calculateProjectHourSheetChanges = () => {
    var total = 0;
    projectChanges.forEach((studentSheetChange) => {
      total += studentSheetChange.sheetChanges.length;
    });
    setTotalProjectHoursSheetChanges(total);
  }

  if (isLoading) {
    return <SpinnerNode />;
  }

  return (
    <main>
      <h2 className="text-4xl font-bold">Project Hours</h2>
      <AdminPagination defaultActiveKey={AdminPaginationKeys.AdminProjects} />
      <div className="absolute sticky left-5 top-5 m-2">
        <p
          className={totalProjectHoursSheetChanges > 0 ? "bg-red-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2" : "bg-emerald-400 p-3 rounded-full w-fit text-sm text-white font-bold h-1/2"}
        >
          {totalProjectHoursSheetChanges} Unsaved Changes
        </p>
      </div>

      <GradeSelectionDropdown gradeSelection={tableGradeSelection} setGradeSelection={setTableGradeSelection}/>
      <Table striped bordered hover responsive className="bg-white/60 p-2 rounded-2xl">
        <thead>
          <tr>
            <th>Row</th>
            <th>Special ID</th>
            <th>Student Name</th>
            <th>Non-NHS Hours</th>
            {projectEvents.map((event, index) => (
              <th key={index} className="text-center">{event.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentList.map((student, index) => (
            <StudentProjectsRow
              key={index}
              student={student}
              events={projectEvents}
              rowNum={index + 1}
              projectChanges={projectChanges}
              setProjectChanges={setProjectChanges}
            />
          ))}
        </tbody>
      </Table>
      <button className="bg-emerald-400 hover:bg-emerald-500 py-2 px-3 rounded-full font-bold text-white" onClick={handleShow}>
        Update
      </button>
      <AdminProjectChangesModal
        projectChanges={projectChanges}
        setProjectChanges={setProjectChanges}
        show={show}
        handleClose={handleClose}
        totalProjectHoursSheetChanges={totalProjectHoursSheetChanges}
      />
    </main>
  );
};

export default AdminProjectHours;
