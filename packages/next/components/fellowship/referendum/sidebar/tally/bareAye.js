import { BorderedRow, Header, Value } from "next-common/components/referenda/tally/styled";
import ElectorateIcon from "next-common/assets/imgs/icons/electorate.svg";
import useSubReferendaTally from "next-common/hooks/referenda/useSubReferendaTally";

export default function BareAye() {
  const tally = useSubReferendaTally();

  return (
    <BorderedRow>
      <Header>
        <ElectorateIcon />
        Bare Aye
      </Header>
      <Value>{tally.bareAyes}</Value>
    </BorderedRow>
  );
}
