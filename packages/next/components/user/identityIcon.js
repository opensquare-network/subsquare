import AuthIcon from "./icons/auth.svg";
import SubIcon from "./icons/sub.svg";
import ErrorIcon from "./icons/error.svg";
import UnauthorizedIcon from "./icons/error-grey.svg";
import SubGreyIcon from "./icons/sub-grey.svg";
import SubRedIcon from "./icons/sub-red.svg";

export default function IdentityIcon({ identity }) {
  const statusIconMap = new Map([
    ["NOT_VERIFIED", UnauthorizedIcon],
    ["VERIFIED", AuthIcon],
    ["ERRONEOUS", ErrorIcon],
    ["VERIFIED_LINKED", SubIcon],
    ["NOT_VERIFIED_LINKED", SubGreyIcon],
    ["ERRONEOUS_LINKED", SubRedIcon],
  ]);

  const StatusIcon = statusIconMap.get(identity?.info?.status) ?? ErrorIcon;

  return <StatusIcon />;
}
