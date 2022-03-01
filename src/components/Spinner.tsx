import React from "react";
import Spinner from "react-bootstrap/Spinner";

interface SpinnerNodeProps {}

const SpinnerNode: React.FC<SpinnerNodeProps> = () => {
  return (
      <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
      </Spinner>
  );
};

export default SpinnerNode;
