import React, { useState, useEffect } from "react";
import TableStats from "./dashboard-nodes/TableStats";
import { Badge } from "react-bootstrap";
import db from "../firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { Announcement, AttendedEvent, Event, Student } from "../App";
import DashboardPagination, { DashboardPaginationKeys } from "../components/DashboardPagination";
import SpinnerNode from "../components/Spinner";

interface DashboardProps {
  student: Student | undefined;
  isLoading: boolean;
  events: Event[];
}

interface AnnouncementsProps {
  student: Student | undefined;
}

interface AnnouncementNodeProps {
  announcement: Announcement;
  student: Student | undefined;
}

const Dashboard: React.FC<DashboardProps> = ({
  student,
  isLoading,
  events
}) => {
  const [totalProjectHours, setTotalProjectHours] = useState<number>(0);
  const [totalMandatoryEvents, setTotalMandatoryEvents] = useState<Event[]>([]);
  const [totalMandatoryAttendedEvents, setTotalMandatoryAttendedEvents] =
    useState<number>(0);

  useEffect(() => {

    //TODO: Find why it is sending multiple announcement
    setTotalProjectHours(0);
    setTotalMandatoryAttendedEvents(0);

    
    findAndSetMandatoryAttendedEvents();
    findAndSetTotalMandatoryEvents();
    
  }, [student, events]);

  if (isLoading) {
    return <SpinnerNode />;
  }

  const findAndSetTotalMandatoryEvents = () => {
    const items: Event[] = [];
    events.forEach((event) => {
      if (event.optionality.toLowerCase() === "m") {
        items.push({
          code: event.code,
          name: event.name,
          optionality: event.optionality,
          hasProjectHours: event.hasProjectHours,
          docId: event.docId,
          eventHosts: event.eventHosts ? event.eventHosts : [],
          startDate: event.startDate,
          endDate: event.endDate
        });
      }
    });
    setTotalMandatoryEvents(items);
  }

  const findAndSetMandatoryAttendedEvents = () => {
    student?.attendance.forEach((attendedEvent: AttendedEvent) => {
      setTotalProjectHours(
        (totalProjectHours) =>
          (totalProjectHours += attendedEvent.projectHours ? attendedEvent.projectHours : 0)
      );
      totalMandatoryEvents.forEach((mandatoryEvent) => {
        if (
          mandatoryEvent.code === attendedEvent.code &&
          attendedEvent.didAttend === true
        ) {
          setTotalMandatoryAttendedEvents(
            (totalMandatoryAttendedEvents) =>
              (totalMandatoryAttendedEvents += 1)
          );
        }
      });
    });
  }


  return (
    <main>
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <DashboardPagination
        defaultActiveKey={DashboardPaginationKeys.Dashboard}
      />
      {student?.announcements && student?.announcements.length > 0 ? <Announcements student={student}/> : <></>}
      <TableStats
        student={student}
        totalProjectHours={totalProjectHours}
        totalMandatoryEvents={totalMandatoryEvents}
        totalMandatoryAttendedEvents={totalMandatoryAttendedEvents}
      />
    </main>
  );
};

const Announcements: React.FC<AnnouncementsProps> = ({student }) => {
  useEffect(() => {
  });
  return (
    <div className="projects-list glass">
      <h2 className="text-2xl font-bold">Announcements</h2>
      {student?.announcements.map((announcement: Announcement, index: number) => (
        <AnnouncementNode announcement={announcement} student={student} key={index} />
      ))}
    </div>
  );
};

const AnnouncementNode: React.FC<AnnouncementNodeProps> = ({
  announcement,
  student
}) => {
  async function deleteAnnouncementNode() {
    console.log("delete Announcement");
    //Delete from student?.announcements
    if (student) {
      await updateDoc(doc(db, "users", student?.docId), {
        announcements: arrayRemove({
          title: announcement.title,
          content: announcement.content,
          author: announcement.author
        })
      }).then(() => {
        // setAnnouncements(announcements.filter((el) => el.randId !== announcement.randId));
      });
    } else {
      console.log("can't find student");
    }
  };

  return (
    <div className="dashboard-glass announcement">
      <div className="announcement-top-heading">
        <Badge pill className="primary-badge">
          {announcement.author}
        </Badge>
        <button className="close-toast" onClick={deleteAnnouncementNode}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="announcement-body">
        <h4 className="title">{announcement.title}</h4>
        <h6>{announcement.content}</h6>
      </div>
    </div>
  );
};

export default Dashboard;
