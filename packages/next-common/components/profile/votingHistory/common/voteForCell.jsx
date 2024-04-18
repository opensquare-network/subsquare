import { Abstain, Aye, Nay } from "./voteItem";

export default function VoteForCell({ vote }) {
  let types = [];

  if (vote.isStandard || vote.isDelegating) {
    types = [vote.aye ? <Aye key={"aye"} /> : <Nay key={"nay"} />];
  } else if (vote.isSplit) {
    types = [<Aye key={"aye"} />, <Nay key={"nay"} />];
  } else if (vote.isSplitAbstain) {
    types = [
      <Aye key={"aye"} />,
      <Nay key={"nay"} />,
      <Abstain key={"abstain"} />,
    ];
  }

  return (
    !!types.length && <div className="[&>*]:max-sm:justify-end">{types}</div>
  );
}
