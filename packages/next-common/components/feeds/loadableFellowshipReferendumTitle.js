import { useAsync } from "react-use";
import Loading from "next-common/components/loading";
import { fetchFellowshipReferendumData } from "next-common/services/fellowshipReferendaData";

export default function LoadableFellowshipReferendumTitle({ referendumIndex }) {
  const { value, loading } = useAsync(async () => {
    return fetchFellowshipReferendumData(referendumIndex);
  });

  if (loading) {
    return <Loading size={16} />;
  }
  if (!value) {
    return null;
  }

  const title = value.title;
  return `#${referendumIndex} · ${title}`;
}
