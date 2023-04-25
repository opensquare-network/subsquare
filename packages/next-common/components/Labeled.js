import React from "react";
import PopupLabel from "./popup/label";

export default function Labeled({ children, text, tooltip, status }) {
  return (
    <div>
      <PopupLabel text={text} tooltip={tooltip} status={status} />
      {children}
    </div>
  );
}
