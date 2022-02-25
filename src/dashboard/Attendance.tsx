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
              <div className="space-y-5">
                {priorAttendedEvents.map(
                  (attendedEvent: AttendedEvent, index: number) => (
                    <AttendanceEvent event={attendedEvent} key={index} />
                  )
                )}
              </div>
              
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
              <div className="space-y-5">
                {todayAttendedEvents.map(
                  (attendedEvent: AttendedEvent, index: number) => (
                    <AttendanceEvent event={attendedEvent} key={index} />
                  )
                )}
              </div>
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
              <div className="space-y-5">
                {upcomingAttendedEvents.map(
                  (attendedEvent: AttendedEvent, index: number) => (
                    <AttendanceEvent event={attendedEvent} key={index} />
                  )
                )}
              </div>
            </Collapsible>
          </>
        )}
      </div>
    </main>
  );
};

const AttendanceEvent: React.FC<AttendanceEventProps> = ({ event }) => {
  return (
    <div className="bg-white/60 p-3 rounded-2xl flex flex-col items-center space-y-3">
      <h4 className="text-xl text-center font-bold">{event.localEventName}</h4>
      <h4>{event.startDate ? event.startDate.toDate().toLocaleDateString("en-US") : ""}</h4>
      <div className="flex space-x-3">
        <p className={event.didAttend ? "bg-emerald-400 text-white font-bold w-fit rounded-full p-0.5 px-2" : "bg-red-400 text-white font-bold w-fit rounded-full p-0.5 px-2"}>
          {event.didAttend ? "Present" : "Absent"}
        </p>
        {event.projectHours ? (
              <p className="bg-blue-400 rounded-full py-0.5 px-3 w-fit text-white space-x-2">
                <strong className="honor-point-value">{event.projectHours}</strong>
                <i className="far fa-clock"></i>
              </p>
          
        ) : (
          ""
        )}
      </div>
     
    </div>
  );
};

export default Attendance;
