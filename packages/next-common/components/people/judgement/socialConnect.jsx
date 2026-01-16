import {
  ClosedTag,
  PositiveTag,
} from "next-common/components/tags/state/styled";
import Tooltip from "next-common/components/tooltip";
import PrimaryButton from "next-common/lib/button/primary";

export default function PeopleJudgementSocialConnect({
  icon,
  title,
  username,
  connected,
  loading,
  onConnect,
}) {
  let message = `Click to verify your ${title} account`;
  if (connected) {
    message = `${title} account already verified`;
  }

  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="flex text16Bold">
            {icon}
            <span className="text-textTertiary mx-1 ml-0">·</span>
            <h1>{title}</h1>
          </div>
          <div>
            {connected ? (
              <PositiveTag>Verified</PositiveTag>
            ) : (
              <ClosedTag>Pending</ClosedTag>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2">
        <div className="flex items-center ">
          <span className=" text14Bold w-32">Username:</span>
          <span className="truncate text-textTertiary">{username}</span>
        </div>

        <Tooltip content={message}>
          <PrimaryButton
            loading={loading}
            disabled={connected}
            onClick={onConnect}
            size="small"
          >
            Verify {title}
          </PrimaryButton>
        </Tooltip>
      </div>
    </div>
  );
}
