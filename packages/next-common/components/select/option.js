import React, { forwardRef } from "react";
import { OptionWrapper } from "./styled";

function Option(
  { active = false, children, onClick = () => {}, height, ...rest },
  ref,
) {
  return (
    <OptionWrapper
      role="option"
      active={active}
      onClick={onClick}
      height={height}
      {...rest}
      ref={ref}
    >
      {children}
    </OptionWrapper>
  );
}

export default forwardRef(Option);
