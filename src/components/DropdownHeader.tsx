import React from "react";

export enum DropdownHeaderStates {
  Open = "open",
  Closed = "closed",
}

export interface DropdownHeaderProps {
  style?: string;
  ddState: DropdownHeaderStates;
  text: string;
  list: Array<any>;
}

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ text, style, ddState, list }) => {
  return (
    <div className={"flex items-center space-x-5 " + style}>
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
