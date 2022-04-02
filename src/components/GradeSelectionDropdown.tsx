import * as React from 'react';
import { useState } from 'react';
import ReactSelect from "react-select";
import { GradeType } from '../admin/admin-attendance/AdminAttendance';
import { SelectionOption } from '../admin/admin-dashboard/events-nodes/AdminEditEventModal';

interface GradeSelectionDropdownProps {
    gradeSelection: SelectionOption;
    setGradeSelection: React.Dispatch<React.SetStateAction<SelectionOption>>;
}

const GradeSelectionDropdown: React.FC<GradeSelectionDropdownProps> = ({ gradeSelection, setGradeSelection }) => {
    const gradeSelectionOptions= [
        {value: GradeType.Senior, label: "Seniors"}
        // {value: GradeType.Junior, label: "Juniors"}
    ];

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
  
    return (
        <ReactSelect defaultValue={gradeSelection} value={gradeSelection} options={gradeSelectionOptions} onChange={gradeSelectionHandler} className="text-black font-bold w-48 text-center text-xl" closeMenuOnSelect={true}/>
    );
}

export default GradeSelectionDropdown;