import { PositiveTag } from "next-common/components/tags/state/styled";
import EmailCardHeader from "./emailCardHeader";
import EmailAddressRow from "./emailAddressRow";

export default function VerifiedEmailCard({ email }) {
  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <EmailCardHeader tag={<PositiveTag>Verified</PositiveTag>} />

      <EmailAddressRow email={email} />
    </div>
  );
}
