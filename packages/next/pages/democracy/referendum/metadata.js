import User from "next-common/components/user";
import Links from "next-common/components/links";
import MotionProposal from "../../../components/motion/motionProposal";
import KVList from "next-common/components/kvList";

export default function ReferendumMetadata({
  proposer,
  delay,
  end,
  threshold,
  preImage,
  chain,
}) {
  const metadata = [
    [
      "Proposer",
      <>
        <User add={proposer} fontSize={14} />
        <Links chain={chain} address={proposer} style={{ marginLeft: 8 }} />
      </>,
    ],
    ["Delay", delay],
    ["End", end],
    ["Threshold", threshold],
  ];

  if (preImage) {
    metadata.push([
      <MotionProposal
        key="pre-image"
        motion={{ proposal: preImage.call }}
        chain={chain}
      />,
    ]);
  }

  return <KVList title={"Metadata"} data={metadata} />;
}
