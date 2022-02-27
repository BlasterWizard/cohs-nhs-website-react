import React, { useState, useEffect } from "react";
import Collapsible from "react-collapsible";
import {AttendedEvent, Event, Student } from "../App";
import DashboardPagination, { DashboardPaginationKeys } from "../components/DashboardPagination";
import DropdownHeader, { DropdownHeaderStates } from "../components/DropdownHeader";
import SpinnerNode from "../components/Spinner";

interface AttendanceProps {
  student: Student | undefined;
  events: Event[];
  isLoading: boolean;
}

interface AttendanceEventProps {
  event: Event;
  student: Student | undefined;
}

const Attendance: React.FC<AttendanceProps> = ({ student, isLoading, events }) => {
  const [priorEvents, setPriorEvents] = useState<Event[]>([]);
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    console.log(events);
    findAndCategorizeEvents();
  }, [events, student?.attendance]);

  const findAndCategorizeEvents = () => {
    const priorEventsList: Event[] = [];
    const todayEventsList: Event[] = [];
    const upcomingEventsList: Event[] = [];

    events.forEach((event: Event) => {
      if (event.startDate < new Date()) {
        priorEventsList.push(event);
      } else if (event.startDate > new Date()) {
        upcomingEventsList.push(event);
      } else {
        todayEventsList.push(event);
      }
    });

    setPriorEvents(priorEventsList);
    setTodayEvents(todayEventsList);
    setUpcomingEvents(upcomingEventsList);
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

      {student?.attendance.length === 0 ? (
        <h4 className="no-found small-glass">No Events Attended</h4>
      ) : (
        <>
          <Collapsible
            trigger={
              <DropdownHeader
                text={"Prior Events"}
                ddState={DropdownHeaderStates.Closed}
                list={priorEvents}
              />
            }
            triggerWhenOpen={
              <DropdownHeader
                text={"Prior Events"}
                ddState={DropdownHeaderStates.Open}
                list={priorEvents}
              />
            }
          >
            <div className="space-y-5">
              {priorEvents.map(
                (event: Event, index: number) => (
                  <AttendanceEvent event={event} student={student} key={index} />
                )
              )}
            </div>
            
          </Collapsible>
          <Collapsible
            trigger={
              <DropdownHeader
                text={"Today"}
                ddState={DropdownHeaderStates.Closed}
                list={todayEvents}
              />
            }
            triggerWhenOpen={
              <DropdownHeader
                text={"Today"}
                ddState={DropdownHeaderStates.Open}
                list={todayEvents}
              />
            }
          >
            <div className="space-y-5">
              {todayEvents.map(
                (event: Event, index: number) => (
                  <AttendanceEvent event={event} student={student} key={index} />
                )
              )}
            </div>
          </Collapsible>
          <Collapsible
            trigger={
              <DropdownHeader
                text={"Upcoming Events"}
                ddState={DropdownHeaderStates.Closed}
                list={upcomingEvents}
              />
            }
            triggerWhenOpen={
              <DropdownHeader
                text={"Upcoming Events"}
                ddState={DropdownHeaderStates.Open}
                list={upcomingEvents}
              />
            }
          >
            <div className="space-y-5">
              {upcomingEvents.map(
                (event: Event, index: number) => (
                  <AttendanceEvent event={event} student={student} key={index} />
                )
              )}
            </div>
          </Collapsible>
        </>
      )}
    </main>
  );
};

const AttendanceEvent: React.FC<AttendanceEventProps> = ({ event, student }) => {

  const [attendedEvent, setAttendedEvent] = useState<AttendedEvent>();

  useEffect(() => {
    getAttendedEvent();
  }, [event, student]);

  const getAttendedEvent = () => {
    student?.attendance.forEach((attendedEvent) => {
      if (event.code === attendedEvent.code) {
        setAttendedEvent({
          code: event.code,
          didAttend: attendedEvent.didAttend,
          localEventName: attendedEvent.localEventName,
          projectHours: attendedEvent.projectHours,
          startDate: attendedEvent.startDate
        });
      }
    });
  }

  return (
    <div className="bg-white/60 p-3 rounded-2xl flex flex-col items-center space-y-3">
      <h4 className="text-xl text-center font-bold">{event.name}</h4>
      <h4>{event.startDate ? event.startDate.toLocaleDateString("en-US") : ""}</h4>
      <div className="flex space-x-3">
        <p className={attendedEvent?.didAttend ? "bg-emerald-400 text-white font-bold w-fit rounded-full p-0.5 px-2" : "bg-red-400 text-white font-bold w-fit rounded-full p-0.5 px-2"}>
          {attendedEvent?.didAttend ? "Present" : "Absent"}
        </p>
        {attendedEvent?.projectHours ? (
              <p className="bg-blue-400 rounded-full py-0.5 px-3 w-fit text-white space-x-2">
                <strong className="honor-point-value">{attendedEvent?.projectHours}</strong>
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
