import React from "react";
import { noop } from "lodash-es";
import Select from "../../select";
import PopupLabel from "../label";

export default function CommonSelectField({
  title = "Options",
  value,
  setValue = noop,
  options = [],
  itemHeight,
  readOnly = false,
}) {
  return (
    <div>
      {title && <PopupLabel text={title} />}
      <Select
        value={value}
        options={options}
        onChange={(item) => setValue(item.value)}
        maxDisplayItem={7}
        itemHeight={itemHeight}
        readOnly={readOnly}
      />
    </div>
  );
}
