import TurnoutIcon from "next-common/assets/imgs/icons/turnout.svg";
import SymbolValue from "./symbolValue";
import {
  Header,
  BorderedRow,
} from "next-common/components/referenda/tally/styled";
import Tooltip from "next-common/components/tooltip";

export default function Issuance({ issuance }) {
  return (
    <BorderedRow>
      <Header>
        <TurnoutIcon />
        <Tooltip
          className="cursor-pointer"
          contentClassName="max-w-[240px]"
          content="The total supply of tokens in circulation. Used to calculate voting power percentages like support and approval thresholds."
        >
          Issuance
        </Tooltip>
      </Header>
      <SymbolValue value={issuance} />
    </BorderedRow>
  );
}
