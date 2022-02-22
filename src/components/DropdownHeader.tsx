import React from "react";
import { Badge } from "react-bootstrap";
import {AttendedEvent, Event, Student } from "../App";

export enum DropdownHeaderStates {
  Open = "open",
  Closed = "closed",
}

export interface DropdownHeaderProps {
  ddState: DropdownHeaderStates;
  text: string;
  list: Student[] | Event[] | AttendedEvent[];
}

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ text, ddState, list }) => {
  return (
    <div className="flex items-center space-x-5">
      <h4 className="text-lg font-bold">{text}</h4>
      <div className="flex-grow"></div>
      <p className="bg-white/60 p-0.5 px-2 rounded-full">{list.length}</p>
      {ddState === "closed" ? (
        <i className="fas fa-chevron-down"></i>
      ) : (
        <i className="fas fa-chevron-up"></i>
      )}
    </div>
  );
};

export default DropdownHeader;
