import React from "react";
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import './shortcuts.css'

function Shortcuts({ color, text, icon }) {
  return <div className="shortcuts" style={{
    background: color,
  }}>
    <div className="header">
      <div className="icon">{icon}</div>
      <div className="action">
        <AddCircleSharpIcon fontSize="large" />
      </div>
    </div>
    <div className="text">{text}</div>
  </div>;
}

export default Shortcuts;
