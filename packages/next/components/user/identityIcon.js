import AuthIcon from "./icons/auth.svg";
import SubIcon from "./icons/sub.svg";
import ErrorIcon from "./icons/error.svg";
import UnauthorizedIcon from "./icons/error-grey.svg";
import SubGreyIcon from "./icons/sub-grey.svg";

export default function IdentityIcon({ identity }) {
  const statusIconMap = new Map([
    ["authorized", AuthIcon],
    ["LINKED", SubIcon],
    ["error", ErrorIcon],
    ["unauthorized", UnauthorizedIcon],
    ["unauthorized-sub", SubGreyIcon],
  ]);

  const StatusIcon = statusIconMap.get(identity?.info?.status) ?? ErrorIcon;

  return <StatusIcon />;
}
