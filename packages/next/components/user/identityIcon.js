import AuthIcon from "./icons/auth.svg";
import SubIcon from "./icons/sub.svg";
import ErrorIcon from "./icons/error.svg";
import UnauthorizedIcon from "./icons/error-grey.svg";
import SubGreyIcon from "./icons/sub-grey.svg";

export default function IdentityIcon({ identity }) {
  const statusIconMap = new Map([
    ["authorized", AuthIcon],
    ["authorized-sub", SubIcon],
    ["error", ErrorIcon],
    ["unauthorized", UnauthorizedIcon],
    ["unauthorized-sub", SubGreyIcon],
  ]);

  const judgements = identity?.info?.judgements ?? [];

  const isAuthorized = judgements.some(
    ([, judgement]) =>
      typeof judgement === "object" &&
      Object.keys(judgement).some((key) => key === "reasonable")
  );

  const isBad = judgements.some(
    ([, judgement]) =>
      typeof judgement === "object" &&
      (Object.keys(judgement).some((key) => key === "erroneous") ||
        Object.keys(judgement).some((key) => key === "lowQuality"))
  );

  let status = "unauthorized";

  if (isAuthorized && !identity?.info?.displayParent) {
    status = "authorized";
    if (identity?.info?.displayParent) {
      status += "-sub";
    }
  }

  if (isBad) {
    status = "error";
    if (identity?.info?.displayParent) {
      status += "-sub";
    }
  }

  const StatusIcon = statusIconMap.get(status) ?? ErrorIcon;

  return <StatusIcon />;
}
