import {
  ClosedTag,
  PositiveTag,
} from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";

export default function PeopleJudgementSocialConnect({
  icon,
  title,
  username,
  connected,
  loading,
  onConnect,
}) {
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
              <PositiveTag>Connected</PositiveTag>
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

        <PrimaryButton
          loading={loading}
          disabled={connected}
          onClick={onConnect}
          size="small"
        >
          Connect {title}
        </PrimaryButton>
      </div>
    </div>
  );
}
