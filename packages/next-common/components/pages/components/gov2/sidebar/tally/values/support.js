import ElectorateIcon from "next-common/assets/imgs/icons/electorate.svg";
import SymbolValue from "./symbolValue";
import {
  BorderedRow,
  Header,
} from "next-common/components/referenda/tally/styled";
import Percentage from "next-common/components/referenda/tally/support/percentage";
import TitleSuffix from "next-common/components/titleSuffix";
import Tooltip from "next-common/components/tooltip";

export default function Support({ supportPerbill = 0, value = 0 }) {
  return (
    <BorderedRow>
      <Header>
        <ElectorateIcon />
        <Tooltip
          className="cursor-pointer"
          contentClassName="max-w-[240px]"
          content="The percentage of total token backing the proposal - regardless of turnout. It shows how much overall support exists for this proposal among all possible tokens."
        >
          Support
        </Tooltip>
        <TitleSuffix suffix={<Percentage perbill={supportPerbill} />} />
      </Header>
      <SymbolValue value={value} />
    </BorderedRow>
  );
}
