import {
  WarningTag,
  PositiveTag,
} from "next-common/components/tags/state/styled";
import Tooltip from "next-common/components/tooltip";
import PrimaryButton from "next-common/lib/button/primary";
import CardHeaderLayout from "./cardHeaderLayout";

export default function PeopleJudgementSocialConnect({
  Icon,
  title,
  username,
  connected,
  loading,
  onConnect,
}) {
  let message = `Click to verify your ${title} account`;
  let tag = <WarningTag>Pending</WarningTag>;
  if (connected) {
    message = `${title} account already verified`;
    tag = <PositiveTag>Verified</PositiveTag>;
  }

  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <CardHeaderLayout tag={tag} Icon={Icon} title={title} />

      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2">
        <div className="flex items-center ">
          <span className="text-textTertiary text14Bold w-32">Username:</span>
          <span className="truncate text-textPrimary">{username}</span>
        </div>

        <Tooltip content={message}>
          <PrimaryButton
            loading={loading}
            disabled={connected}
            onClick={onConnect}
            size="small"
          >
            Verify
          </PrimaryButton>
        </Tooltip>
      </div>
    </div>
  );
}
