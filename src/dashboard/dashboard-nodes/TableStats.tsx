import React, { useEffect, useState } from 'react';
import { AttendedEvent, Event, Setting, Student } from '../../App';

interface TableStatsProps {
    student: Student | undefined;
    totalMandatoryAttendedEvents: number;
    totalProjectHours: number;
    settings: Setting;
}

const TableStats: React.FC<TableStatsProps> = ({student, totalProjectHours, totalMandatoryAttendedEvents, settings}) => {
  const [totalEventsAttended, setTotalEventsAttended] = useState<number>(0);
  const [requiredHours, setRequiredHours] = useState<number>(0);

  useEffect(() => {
    tabulateNumberOfTotalEventsAttended();
    displayCorrectRequiredHours();
  }, [student, settings]);

  const tabulateNumberOfTotalEventsAttended = () => {
    var numberofAttendedEvents: number = 0;
    student?.attendance.forEach((attendedEvent: AttendedEvent) => {
      if (attendedEvent.didAttend === true) {
        numberofAttendedEvents += 1;
      }
    });
    setTotalEventsAttended(numberofAttendedEvents);
  }

  const displayCorrectRequiredHours = () => {
    switch (student?.grade) {
      case 12: 
        setRequiredHours(settings.seniorsRequiredHours ?? 0);
        break;
      case 11:
        setRequiredHours(settings.juniorsRequiredHours ?? 0);
    }
  }

    return (
      <div className="bg-white/60 rounded-lg p-4">
          <div className="bg-slate-400/30 space-x-2 flex p-1">
            <p className="font-bold">Total Project Hours:</p>
            <div className="flex-grow"></div>
            <p>{totalProjectHours} / {requiredHours}</p>
          </div>
          <div className="space-x-2 flex p-1">
            <p className="font-bold">Total Events Attended:</p>
            <div className="flex-grow"></div>
            <p>{totalEventsAttended}</p>
          </div>
          <div className="bg-slate-400/30 space-x-2 flex p-1">
            <p className="font-bold">Mandatory NHS Events Attended:</p>
            <div className="flex-grow"></div>
            <p>{totalMandatoryAttendedEvents}</p>
          </div>
          {/* <tr>
            <td className="font-bold">Non NHS Events Attended:</td>
            <td></td>
          </tr> */}
      </div>
      
    );
  };

  export default TableStats;