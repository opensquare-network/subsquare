import { useUser } from "next-common/context/user";

export const MUTED_TOOLTIP_TEXT =
  "Your account has been muted and cannot perform this action. Please contact the administrator for more information.";

export default function useIsMuted() {
  return !!useUser()?.isMuted;
}
