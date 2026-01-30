import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useDetailType } from "next-common/context/page";
import { OptionItem } from "next-common/components/internalDropdown/styled";
import dayjs from "dayjs";
import {
  SystemCancel,
  SystemClose,
  SystemInvalid,
  SystemTimeout,
} from "@osn/icons/subsquare";
import { useState } from "react";
import { noop } from "lodash-es";
import TerminateApplicationPopup from "next-common/components/terminateApplicationPopup";
import {
  finalStateActionTextMap,
  fellowshipApplicationStates,
} from "next-common/utils/consts/fellowship/application";
import Tooltip from "next-common/components/tooltip";
import { usePost } from "next-common/context/post";
import useIsAdmin from "./useIsAdmin";
import { useIsPostAuthor } from "next-common/context/post/useIsPostAuthor";

export default function useTerminateAction({ onShowPopup = noop }) {
  const isAdmin = useIsAdmin();
  const post = usePost();
  const isAuthor = useIsPostAuthor();
  const postType = useDetailType();
  const [showPopup, setShowPopup] = useState(false);
  const [actionType, setActionType] = useState(null);
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

  const timeoutDisabled =
    dayjs().valueOf() - dayjs(post?.createdAt).valueOf() < thirtyDaysInMs;

  const isFellowshipApplicationPost =
    postType === detailPageCategory.FELLOWSHIP_APPLICATION;

  const showTerminateAction =
    isFellowshipApplicationPost &&
    [fellowshipApplicationStates.New].includes(post?.status);

  let actionsComponent = null;
  let popupComponent = null;

  if (!post || !showTerminateAction) {
    return null;
  }

  const supportedActions = [
    {
      type: fellowshipApplicationStates.Rejected,
      disabled: isAdmin,
      tip: isAdmin ? "" : "Only available to the admins",
      icon: <SystemCancel />,
    },
    {
      type: fellowshipApplicationStates.Invalid,
      disabled: isAdmin,
      tip: isAdmin ? "" : "Only available to the admins",
      icon: <SystemInvalid />,
    },
    {
      type: fellowshipApplicationStates.TimedOut,
      disabled: isAdmin && timeoutDisabled,
      tip: isAdmin
        ? timeoutDisabled
          ? ""
          : "Can only be set timedout 30 days after creation"
        : "Only available to the admins",
      icon: <SystemTimeout />,
    },
    {
      type: fellowshipApplicationStates.Closed,
      disabled: isAdmin || isAuthor,
      tip:
        isAdmin || isAuthor
          ? ""
          : "Only available to the admins and the author",
      icon: <SystemClose />,
    },
  ];

  actionsComponent = (
    <>
      {supportedActions.map(({ type, disabled, tip, icon }) => {
        return (
          <TerminateMenuItem
            key={type}
            onClick={() => {
              onShowPopup();
              setShowPopup(true);
              setActionType(type);
            }}
            disabled={!disabled}
            tip={tip}
            type={type}
            icon={icon}
          />
        );
      })}
    </>
  );

  popupComponent = showPopup && (
    <TerminateApplicationPopup
      finalState={actionType}
      onClose={() => setShowPopup(false)}
    />
  );

  return {
    actionsComponent,
    popupComponent,
  };
}

function TerminateMenuItem({ onClick, disabled, type, tip, icon }) {
  return (
    <Tooltip content={tip} className="w-full">
      <OptionItem
        className={
          disabled
            ? "text-textDisabled [&_path]:fill-textDisabled cursor-not-allowed hover:bg-transparent"
            : "hover:bg-neutral200"
        }
        onClick={!disabled ? onClick : noop}
      >
        <div className="mr-2">{icon}</div>
        <span>{finalStateActionTextMap[type]}</span>
      </OptionItem>
    </Tooltip>
  );
}
