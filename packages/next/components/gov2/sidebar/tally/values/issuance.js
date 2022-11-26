import useIssuance from "next-common/utils/gov2/useIssuance";
import { Header, Row } from "./styled";
import TurnoutIcon from "../../../../../public/imgs/icons/turnout.svg";
import SymbolValue from "./symbolValue";
import { useTimelineData } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";

export default function Issuance() {
  const timeline = useTimelineData();
  const finishItem = (timeline || []).find((item) =>
    [
      gov2State.Approved,
      gov2State.Rejected,
      gov2State.Timeout,
      gov2State.Cancelled,
      gov2State.Killed,
    ].includes(item.name)
  );
  const { issuance } = useIssuance(finishItem?.indexer?.blockHeight);

  return (
    <Row>
      <Header>
        <TurnoutIcon />
        Issuance
      </Header>
      <SymbolValue value={issuance} />
    </Row>
  );
}
