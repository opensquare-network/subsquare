/* eslint-disable react/jsx-key */
import isNil from "lodash.isnil";
import Link from "next/link";
import KVList from "next-common/components/listInfo/kvList";

export default function Business({ referendumIndex }) {
  const referendumData = [];

  if (!isNil(referendumIndex)) {
    referendumData.push([
      "Link to",
      <Link
        href={`/democracy/referendum/${referendumIndex}`}
      >{`Democracy Referenda #${referendumIndex}`}</Link>,
    ]);
  }

  return referendumData.length > 0 ? (
    <KVList title="Business" data={referendumData} showFold />
  ) : null;
}
