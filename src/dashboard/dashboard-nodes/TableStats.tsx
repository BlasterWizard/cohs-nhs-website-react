import React, { useEffect, useState } from 'react';
import Table from "react-bootstrap/Table";
import { AttendedEvent, Event, Student } from '../../App';

interface TableStatsProps {
    student: Student | undefined;
    totalMandatoryEvents: Event[];
    totalMandatoryAttendedEvents: number;
    totalProjectHours: number;
}

const TableStats: React.FC<TableStatsProps> = ({student, totalProjectHours, totalMandatoryAttendedEvents, totalMandatoryEvents}) => {
  const [totalEventsAttended, setTotalEventsAttended] = useState<number>(0);

  useEffect(() => {
    tabulateNumberOfTotalEventsAttended();
  }, [student?.attendance]);

  const tabulateNumberOfTotalEventsAttended = () => {
    var numberofAttendedEvents: number = 0;
    student?.attendance.forEach((attendedEvent: AttendedEvent) => {
      if (attendedEvent.didAttend === true) {
        numberofAttendedEvents += 1;
      }
    });
    setTotalEventsAttended(numberofAttendedEvents);
  }

    return (
      <div className="bg-white/60 rounded-lg p-4">
        <table className="table-fixed">
          <tbody>
            <tr className="bg-slate-400/30">
              <td className="font-bold">Total Project Hours:</td>
              <td>{totalProjectHours}</td>
            </tr>
            <tr>
              <td className="font-bold">Total Events Attended:</td>
              <td>{totalEventsAttended}</td>
            </tr>
            <tr className="bg-slate-400/30">
              <td className="font-bold">Mandatory NHS Events Attended:</td>
              <td>{totalMandatoryAttendedEvents}</td>
            </tr>
            <tr>
              <td className="font-bold">Non NHS Events Attended:</td>
              <td>{student?.nonNHSHoursSubmitted}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    );
  };

  export default TableStats;