import React, { useState, useEffect } from "react";
import Badge from "react-bootstrap/esm/Badge";
import Collapsible from "react-collapsible";
import { AttendedEvent, Student } from "../App";
import DashboardPagination, { DashboardPaginationKeys } from "../components/DashboardPagination";
import DropdownHeader, { DropdownHeaderStates } from "../components/DropdownHeader";
import SpinnerNode from "../components/Spinner";

interface AttendanceProps {
  student: Student | undefined;
  isLoading: boolean;
}

interface AttendanceEventProps {
  event: AttendedEvent;
  key: number;
}

const Attendance: React.FC<AttendanceProps> = ({ student, isLoading }) => {
  const [priorAttendedEvents, setPriorAttendedEvents] = useState<AttendedEvent[]>([]);
  const [todayAttendedEvents, setTodayAttendedEvents] = useState<AttendedEvent[]>([]);
  const [upcomingAttendedEvents, setUpcomingAttendedEvents] = useState<AttendedEvent[]>([]);

  useEffect(() => {
    findAndCategorizeEvents();
  }, [student?.attendance]);

  const findAndCategorizeEvents = () => {
    const priorEventsList: AttendedEvent[] = [];
    const todayEventsList: AttendedEvent[] = [];
    const upcomingEventsList: AttendedEvent[] = [];

    student?.attendance.forEach((event: AttendedEvent) => {
      if (event.startDate < new Date()) {
        priorEventsList.push(event);
      } else if (event.startDate > new Date()) {
        upcomingEventsList.push(event);
      } else {
        todayEventsList.push(event);
      }
    });
    setPriorAttendedEvents(priorEventsList);
    setTodayAttendedEvents(todayEventsList);
    setUpcomingAttendedEvents(upcomingEventsList);
  };

  if (isLoading) {
    return <SpinnerNode />;
  }
  return (
    <main>
      <h1 className="text-4xl font-bold">Attendance</h1>
      <DashboardPagination
        defaultActiveKey={DashboardPaginationKeys.Attendance}
      />
      <div className="attendanceEvents-list">
        {student?.attendance.length === 0 ? (
          <h4 className="no-found small-glass">No Events Attended</h4>
        ) : (
          <>
            <Collapsible
              trigger={
                <DropdownHeader
                  text={"Prior Events"}
                  ddState={DropdownHeaderStates.Closed}
                  list={priorAttendedEvents}
                />
              }
              triggerWhenOpen={
                <DropdownHeader
                  text={"Prior Events"}
                  ddState={DropdownHeaderStates.Open}
                  list={priorAttendedEvents}
                />
              }
            >
              {priorAttendedEvents.map(
                (attendedEvent: AttendedEvent, index: number) => (
                  <AttendanceEvent event={attendedEvent} key={index} />
                )
              )}
            </Collapsible>
            <Collapsible
              trigger={
                <DropdownHeader
                  text={"Today"}
                  ddState={DropdownHeaderStates.Closed}
                  list={todayAttendedEvents}
                />
              }
              triggerWhenOpen={
                <DropdownHeader
                  text={"Today"}
                  ddState={DropdownHeaderStates.Open}
                  list={todayAttendedEvents}
                />
              }
            >
              {todayAttendedEvents.map(
                (attendedEvent: AttendedEvent, index: number) => (
                  <AttendanceEvent event={attendedEvent} key={index} />
                )
              )}
            </Collapsible>
            <Collapsible
              trigger={
                <DropdownHeader
                  text={"Upcoming Events"}
                  ddState={DropdownHeaderStates.Closed}
                  list={upcomingAttendedEvents}
                />
              }
              triggerWhenOpen={
                <DropdownHeader
                  text={"Upcoming Events"}
                  ddState={DropdownHeaderStates.Open}
                  list={upcomingAttendedEvents}
                />
              }
            >
              {upcomingAttendedEvents.map(
                (attendedEvent: AttendedEvent, index: number) => (
                  <AttendanceEvent event={attendedEvent} key={index} />
                )
              )}
            </Collapsible>
          </>
        )}
      </div>
    </main>
  );
};

const AttendanceEvent: React.FC<AttendanceEventProps> = ({ event }) => {
  return (
    <div className="glass">
      <h4 className="text-xl font-bold">{event.localEventName}</h4>
      <Badge
        pill
        className={event.didAttend ? "primary-badge" : "danger-badge"}
      >
        {event.didAttend ? "Present" : "Absent"}
      </Badge>
      <div className="honor-point">
        {event.projectHours ? (
          <Badge pill className="success-badge">
            <strong className="honor-point-value">{event.projectHours}</strong>
            <i className="far fa-clock"></i>
          </Badge>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Attendance;
