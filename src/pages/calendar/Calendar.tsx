import React, { useState, useEffect } from "react";
import {Event} from "../../App";
import SpinnerNode from "../../components/Spinner";;

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
    </main>
  );
};

export default Calendar;
