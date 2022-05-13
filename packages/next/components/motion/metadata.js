import KVList from "next-common/components/listInfo/kvList";
import User from "next-common/components/user";
import Links from "next-common/components/links";
import Proposal from "next-common/components/proposal";

export default function Metadata({ motion, chain }) {
  if (!motion) {
    return null;
  }

  return (
    <KVList
      title={"Metadata"}
      data={[
        [
          "Proposer",
          <>
            <User add={motion?.proposer} fontSize={14} chain={chain} />
            <Links
              chain={chain}
              address={motion?.proposer}
              style={{ marginLeft: 8 }}
            />
          </>,
        ],
        ...[Number.isInteger(motion?.index) ? ["Index", motion?.index] : null],
        ["Threshold", motion?.threshold],
        ["Hash", motion?.hash],
        [<Proposal key="proposal" motion={motion} chain={chain} />],
      ]}
    />
  );
}
