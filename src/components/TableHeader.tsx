import * as React from 'react';
import { useRef, useState } from 'react';
import { Button, Form, Overlay, Tooltip } from 'react-bootstrap';
import ReactSelect from 'react-select';
import { GradeType } from '../admin/admin-attendance/AdminAttendance';
import { SelectionOption } from '../admin/admin-dashboard/events-nodes/AdminEditEventModal';
import { Event } from '../App';

interface TableHeaderProps {
    events: Event[];
    startShowEventIndex: number;
    endShowEventIndex: number;
    displayEventsAmount: number;
    setStartShowEventIndex: React.Dispatch<React.SetStateAction<number>>;
    setEndShowEventIndex: React.Dispatch<React.SetStateAction<number>>;
    setDisplayEventsAmount: React.Dispatch<React.SetStateAction<number>>;
}

const TableHeader: React.FC<TableHeaderProps> = ({events, startShowEventIndex, endShowEventIndex, displayEventsAmount, setDisplayEventsAmount, setStartShowEventIndex, setEndShowEventIndex}) => {

    const gradeSelectionOptions= [
      {value: GradeType.Senior, label: "Seniors"}
      // {value: GradeType.Junior, label: "Juniors"}
    ];
    const [gradeSelection, setGradeSelection] = useState<SelectionOption>({
      value: GradeType.Senior, 
      label: "Seniors"
    });
    const [showAdminAttendanceSettings, setShowAdminAttendanceSettings] = useState(false);
    const [showDisplayEventsAmountError, setShowDisplayEventsAmountError] = useState(false);
    const settingsTarget = useRef(null);

    const gradeSelectionHandler = (e: any) => {
        switch(e.value) {
        case GradeType.Senior:
            setGradeSelection(gradeSelectionOptions[0]);
            break;
        case GradeType.Junior:
            setGradeSelection(gradeSelectionOptions[1]);
            break;
        }
    }

    const reverseEventIndicies = () => {
        if ((startShowEventIndex - displayEventsAmount - 1) >= 0) {
        setStartShowEventIndex(startShowEventIndex - displayEventsAmount - 1);
        } else {
        setStartShowEventIndex(0);
        }

        if (startShowEventIndex != 0) {
        setEndShowEventIndex(startShowEventIndex);
        }
    }

    const advanceEventIndicies = () => {
        //endShowEventIndex is exclusive 
        if (endShowEventIndex != events.length) {
        setStartShowEventIndex(endShowEventIndex);
        }

        if ((endShowEventIndex + displayEventsAmount) >= events.length) {
        setEndShowEventIndex(events.length);
        } else {
        setEndShowEventIndex(endShowEventIndex + displayEventsAmount);
        } 
    }

    const preDisplayEventAmountsHandler = (e: any) => {
        setDisplayEventsAmount(e.target.value);
        if (e.target.value <= events.length && e.target.value > 0) {
        setEndShowEventIndex(startShowEventIndex + parseInt(e.target.value));
        setShowDisplayEventsAmountError(false);
        } else {
        setShowDisplayEventsAmountError(true);
        }
    }

    return (
        <div className="flex items-center w-full my-3">
        <button disabled={startShowEventIndex === 0} onClick={reverseEventIndicies}>
          <i className={startShowEventIndex === 0 ? "fas fa-chevron-left ml-5 bg-indigo-300 py-2.5 px-3 rounded-full text-white" : "fas fa-chevron-left ml-5 bg-indigo-400 hover:bg-indigo-500 py-2.5 px-3 rounded-full text-white"}></i>
        </button>
        <div className="flex-grow"></div>
        <div className="flex space-x-3 items-center">
          <ReactSelect defaultValue={gradeSelection} value={gradeSelection} options={gradeSelectionOptions} onChange={gradeSelectionHandler} className="text-black font-bold w-48 text-center text-xl" closeMenuOnSelect={true}/>
          <Button ref={settingsTarget} onClick={() => setShowAdminAttendanceSettings(!showAdminAttendanceSettings)} className="hover:bg-transparent hover:text-black text-black border-0 text-xl">
            {
              showAdminAttendanceSettings ?
              <p className="bg-red-400 px-2 py-0.5 rounded-full text-white">Close</p>
              :<i className="fas fa-cog"></i>
            }

          </Button>
          <Overlay target={settingsTarget.current} show={showAdminAttendanceSettings} placement="bottom">
            <Tooltip>
              <div className="flex flex-col items-center">
                <p className="font-bold">Events Display Amount:</p>
                <Form.Control
                value={displayEventsAmount}
                onChange={preDisplayEventAmountsHandler}
                type="text"
                placeholder=""
                className="w-1/2 text-center"
                />
                {showDisplayEventsAmountError ? <p className="text-red-400">Amount must be greater than 0 and less than or equal to {events.length}</p> : <div></div>}
              </div>
            </Tooltip>
          </Overlay>
        </div>
        <div className="flex-grow"></div>
        <button onClick={advanceEventIndicies} disabled={endShowEventIndex === events.length}>
          <i className={endShowEventIndex === events.length ? "fas fa-chevron-right mr-5 bg-indigo-300 py-2.5 px-3 rounded-full text-white" : "fas fa-chevron-right mr-5 bg-indigo-400 hover:bg-indigo-500 py-2.5 px-3 rounded-full text-white"}></i>
        </button>
      </div>
    );
}

export default TableHeader;