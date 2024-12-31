import Announcement from "./announcement";
import useAddressDelegation from "./useAddressDelegation";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function PublicAnnouncement() {
  const realAddress = useRealAddress();
  const { value: myDelegation } = useAddressDelegation(realAddress);

  return <Announcement myDelegation={myDelegation} />;
}
