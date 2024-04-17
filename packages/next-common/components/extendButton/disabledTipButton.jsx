import React from "react";
import Tooltip from "next-common/components/tooltip";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import DangerButton from "next-common/lib/button/danger";
import SuccessButton from "next-common/lib/button/success";
import WarningButton from "next-common/lib/button/warning";
export default function DisabledTipButton({
  tipMsg,
  typeStyle,
  ...propsButton
}) {
  let container = typeButton(typeStyle);
  function typeButton(type) {
    switch (type) {
      case "primary":
        return <PrimaryButton {...propsButton} />;
      case "secondary":
        return <SecondaryButton {...propsButton} />;
      case "danger":
        return <DangerButton {...propsButton} />;
      case "success":
        return <SuccessButton {...propsButton} />;
      case "warning":
        return <WarningButton {...propsButton} />;
      default:
        return <SecondaryButton {...propsButton} />;
    }
  }

  if (propsButton.disabled && tipMsg) {
    container = <Tooltip content={tipMsg}>{container}</Tooltip>;
  }
  return container;
}
