import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { isAddressInGroup } from "next-common/utils";
import {
  ApprovedTooltip,
  NotApprovedTooltip,
} from "next-common/components/multisigs/signField/tooltips";
import { ProfilePageGuard } from "next-common/components/multisigs/signField/router";

export default function SignStatusOnProfile({ multisig }) {
  const profileAddress = useProfileAddress();
  const { approvals = [] } = multisig || {};
  const isApproved = isAddressInGroup(profileAddress, approvals);

  return (
    <ProfilePageGuard>
      {isApproved ? (
        <ApprovedTooltip isAccountMultisigPage={false} />
      ) : (
        <NotApprovedTooltip isAccountMultisigPage={false} />
      )}
    </ProfilePageGuard>
  );
}
