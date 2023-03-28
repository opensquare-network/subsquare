import React from "react";
import Labeled from "../../../components/Labeled";
import DaySelect from "./daySelect";

export default function Day({ date, setDate }) {
  return (
    <Labeled text={"Date"}>
      <DaySelect date={date} setDate={setDate} />
    </Labeled>
  );
}
