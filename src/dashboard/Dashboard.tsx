import React, { useState, useEffect } from "react";
import TableStats from "./dashboard-nodes/TableStats";
import { Announcement, AttendedEvent, Event, Setting, Student } from "../App";
import DashboardPagination, { DashboardPaginationKeys } from "../components/DashboardPagination";
import SpinnerNode from "../components/Spinner";
import Announcements from "./dashboard-nodes/DashboardAnnouncementsView";

interface DashboardProps {
  student: Student | undefined;
  isLoading: boolean;
  events: Event[];
  settings: Setting;
}

const Dashboard: React.FC<DashboardProps> = ({
  student,
  isLoading,
  events,
  settings
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
          description: event.description,
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
        totalMandatoryAttendedEvents={totalMandatoryAttendedEvents}
        settings={settings}
        events={events}
      />
    </main>
  );
};


export default Dashboard;
