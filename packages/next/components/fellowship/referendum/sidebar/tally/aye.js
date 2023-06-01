import { BorderedRow, Header, Value } from "next-common/components/referenda/tally/styled";
import AyeIcon from "next-common/assets/imgs/icons/aye.svg";
import useSubReferendaTally from "next-common/hooks/referenda/useSubReferendaTally";

export default function Aye() {
  const tally = useSubReferendaTally();

  return (
    <BorderedRow>
      <Header>
        <AyeIcon />
        Aye
      </Header>
      <Value>{tally.ayes}</Value>
    </BorderedRow>
  );
}
