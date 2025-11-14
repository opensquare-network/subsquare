import React, { forwardRef } from "react";
import { OptionWrapper } from "./styled";

function Option(
  {
    active = false,
    disabled = false,
    children,
    onClick = () => {},
    height,
    ...rest
  },
  ref,
) {
  return (
    <OptionWrapper
      role="option"
      active={active}
      disabled={disabled}
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
