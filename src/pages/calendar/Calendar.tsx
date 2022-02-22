import React, { useState, useEffect } from "react";
import {Event, Student } from "../../App";
import SpinnerNode from "../../components/Spinner";
import EventInfoModal from "./EventInfoModal";
import { Badge } from "react-bootstrap";
import DropdownHeader, {
  DropdownHeaderStates,
} from "../../components/DropdownHeader";
import Collapsible from "react-collapsible";

interface EventDescription {
  content: string;
  hosts: Student[];
}

interface CalendarProps {
  events: Event[];
  isLoading: boolean;
}

export interface EventProps {
  event: Event;
  key: number;
}

const Calendar: React.FC<CalendarProps> = ({ isLoading, events }) => {
  const [priorEvents, setPriorEvents] = useState<Event[]>([]);
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    findAndCategorizeEvents();
  }, [events]);
 
  const findAndCategorizeEvents = () => {
    const priorEventsList: Event[] = [];
    const todayEventsList: Event[] = [];
    const upcomingEventsList: Event[] = [];
    events.forEach((event) => {
      if (event.endDate < new Date()) {
        priorEventsList.push(event);
      } else if (event.endDate > new Date()) {
        upcomingEventsList.push(event);
      } else {
        todayEventsList.push(event);
      }
    });
    setPriorEvents(priorEventsList);
    setTodayEvents(todayEventsList);
    setUpcomingEvents(upcomingEvents);
  };
  if (isLoading) {
    return <SpinnerNode />;
  }
  return (
    <main>
      <h2 className="text-4xl font-bold">Calendar</h2>
      <div className="cal-wrap mb-5 logged-in" unselectable="on">
        <iframe
          title="cohs-nhs-title"
          src="https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/4e9626b3-cabd-435a-bc37-018c2c0e88d3/cid-A636739649E8509E/index.html"
        ></iframe>
      </div>
      <h2 className="text-3xl font-bold m-5">Events</h2>
      <div className="space-y-10 flex flex-col items-center">
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
          className="w-3/4"
        >
          <div className="space-y-10">
            {priorEvents.map((event: Event, index: number) => (
              <EventNode event={event} key={index} />
            ))}
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
          className="w-3/4"
          triggerWhenOpen={
            <DropdownHeader
              text={"Today"}
              ddState={DropdownHeaderStates.Open}
              list={todayEvents}
            />
          }
        >
          {todayEvents.map((event: Event, index: number) => (
            <EventNode event={event} key={index} />
          ))}
        </Collapsible>
        <Collapsible
          trigger={
            <DropdownHeader
              text={"Upcoming Events"}
              ddState={DropdownHeaderStates.Closed}
              list={upcomingEvents}
            />
          }
          className="w-3/4"
          triggerWhenOpen={
            <DropdownHeader
              text={"Upcoming Events"}
              ddState={DropdownHeaderStates.Open}
              list={upcomingEvents}
            />
          }
        >
          {upcomingEvents.map((event: Event, index: number) => (
            <EventNode event={event} key={index} />
          ))}
        </Collapsible>
      </div>
    </main>
  );
};

const EventNode: React.FC<EventProps> = ({ event }) => {
  const [showEventInfoModal, setShowEventInfoModal] = useState(false);
  
  const toggleShowEventInfoModal = () => {
    showEventInfoModal ? setShowEventInfoModal(false) : setShowEventInfoModal(true);
  }

  return (
    <div className="bg-white/60 p-2 rounded-lg">
      <div className="info-header">
        <button className="info-btn" onClick={toggleShowEventInfoModal}>
          <i className="fas fa-info-circle"></i>
        </button>
      </div>
      <h4 className="text-xl">
        <strong>{event.name}</strong>
      </h4>
      <p
        className={
          event.optionality.toLowerCase() === "m"
            ? "bg-red-500 text-white py-0.5 px-2 rounded-full w-fit font-bold text-sm"
            : "bg-blue-500 text-white py-0.5 px-2 rounded-full w-fit font-bold text-sm"
        }
      >
        {event.optionality.toLowerCase() === "m" ? "Mandatory" : "Optional"}
      </p>
      <h6>{event.description}</h6>
      <div className="flex space-x-16">
        <h6><strong>Start Date & Time:</strong></h6>
        <h6><strong>End Date & Time:</strong></h6>
      </div>
      
      <div className="flex space-x-10">
        <div className="event-date-time">
          <h6>
            {event.startDate ? event.startDate.toLocaleDateString("en-US") : ""}
          </h6>
        </div>
        <div className="event-date-time">
          <h6>
            {event.startDate
              ? event.startDate.toLocaleTimeString([], { timeStyle: "short" })
              : ""}
          </h6>
        </div>

        
        <div className="event-date-time">
          <h6>
            {event.endDate ? event.endDate.toLocaleDateString("en-US") : ""}
          </h6>
        </div>
        <div className="event-date-time">
          <h6>
            {event.endDate
              ? event.endDate.toLocaleTimeString([], { timeStyle: "short" })
              : ""}
          </h6>
        </div>
      </div>
      <EventInfoModal show={showEventInfoModal} handleClose={toggleShowEventInfoModal} event={event} />
    </div>
  );
};

export default Calendar;
