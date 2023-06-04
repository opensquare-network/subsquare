import { BorderedRow, Header, Value } from "next-common/components/referenda/tally/styled";
import AyeIcon from "next-common/assets/imgs/icons/aye.svg";

export default function Aye({ value = 0 }) {
  return (
    <BorderedRow>
      <Header>
        <AyeIcon />
        Aye
      </Header>
      <Value>{value}</Value>
    </BorderedRow>
  );
}
