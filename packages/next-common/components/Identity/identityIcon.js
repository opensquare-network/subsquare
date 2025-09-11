import Flex from "../styled/flex";
import { cn } from "next-common/utils";
import {
  IdentityAuthorized,
  IdentityAuthorizedSub,
  IdentityError,
  IdentityUnauthorized,
  IdentityUnauthorizedDark,
  IdentityUnauthorizedSub,
  IdentityUnauthorizedSubDark,
  IdentityUnauthorizedError,
} from "@osn/icons/subsquare";

export default function IdentityIcon({
  identity,
  className = "",
  iconClassName = "",
}) {
  const statusIconMap = {
    NOT_VERIFIED: (
      <>
        <IdentityUnauthorized className="w-full h-full dark:hidden" />
        <IdentityUnauthorizedDark className="w-full h-full hidden dark:block" />
      </>
    ),
    VERIFIED: (
      <>
        <IdentityAuthorized className="w-full h-full" />
      </>
    ),
    ERRONEOUS: (
      <>
        <IdentityError className="w-full h-full" />
      </>
    ),
    VERIFIED_LINKED: (
      <>
        <IdentityAuthorizedSub className="w-full h-full" />
      </>
    ),
    LINKED: (
      <>
        <IdentityUnauthorizedSub className="w-full h-full dark:hidden" />
        <IdentityUnauthorizedSubDark className="w-full h-full hidden dark:block" />
      </>
    ),
    ERRONEOUS_LINKED: (
      <>
        <IdentityUnauthorizedError className="w-full h-full" />
      </>
    ),
  };

  const icon = statusIconMap[identity?.info?.status || "ERRONEOUS"];

  return (
    <Flex className={cn(identity?.info?.status, className)}>
      <div className={cn("w-3 h-3 min-w-[12px] min-h-[12px]", iconClassName)}>
        {icon}
      </div>
    </Flex>
  );
}
