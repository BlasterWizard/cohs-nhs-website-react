import React, { useEffect, useState } from "react";
import {Event, Student } from "../../App";
import AddEventModalView from "./AddEventModalView";
import AdminEventsView from "./AdminEventsView";


interface AdminEventsDashboardProps {
  events: Event[];
  students: Student[];
  getStudentNameFromID: (id:string) => string;
}

const AdminEventsDashboard: React.FC<AdminEventsDashboardProps> = ({
  events,
  students,
  getStudentNameFromID
}) => {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [showEventsView, setShowEventsView] = useState(false);
  const [showAddEventModalView, setShowAddEventModalView] = useState(false);

  const toggleShowEventsView = () => {
    showEventsView ? setShowEventsView(false) : setShowEventsView(true);
  }

  const toggleShowAddEventModalView = () => {
    showAddEventModalView ? setShowAddEventModalView(false) : setShowAddEventModalView(true);
  }

  useEffect(() => {
    var items: Event[] = [];
    events.forEach((event) => {
      items.push({
        code: event.code,
        startDate: event.startDate,
        endDate: event.endDate,
        name: event.name,
        optionality: event.optionality,
        description: event.description,
        hasProjectHours: event.hasProjectHours,
        docId: event.docId,
        eventHosts: event.eventHosts ? event.eventHosts : [],
      });
    });
    setEventList(items);
  }, [events]);


  return (


    <div className="bg-white/60 p-5 rounded-2xl flex flex-col items-center">
      <h3 className="font-bold text-2xl">Event Dashboard</h3>
      <div className="space-y-3 flex flex-col mt-3">
        <button className="bg-indigo-400 py-1 px-3 rounded-full font-bold text-white" onClick={toggleShowEventsView}>
          View All Events <span className="bg-white/60 py-0.5 px-2 text-black rounded-full">{events.length}</span>
        </button>
        <button className="bg-green-400 py-1 px-2 rounded-full font-bold text-white" onClick={toggleShowAddEventModalView}>
          Add New Event
        </button>
      </div>
      <AdminEventsView show={showEventsView} handleClose={toggleShowEventsView} students={students} events={events} getStudentNameFromID={getStudentNameFromID}/>
      <AddEventModalView show={showAddEventModalView} handleClose={toggleShowAddEventModalView} eventList={events} students={students}/> 
    </div>

  );
};



export default AdminEventsDashboard;
