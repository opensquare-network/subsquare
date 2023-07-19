import { useOnchainData } from "next-common/context/post";
import MultiKVList from "next-common/components/listInfo/multiKVList";
import useReferendaBusinessData from "hooks/useReferendaBusinessData";

/**
 * Related business component for gov2 referendum
 */
export default function ReferendaBusiness() {
  const onchain = useOnchainData();

  const businessData = useReferendaBusinessData();

  if (!onchain.proposal) {
    return null;
  }

  return <MultiKVList title="Business" data={businessData} />;
}
