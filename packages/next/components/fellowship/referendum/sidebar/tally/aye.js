import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import AyeIcon from "next-common/assets/imgs/icons/aye.svg";
import { useTally } from "next-common/context/post/gov2/referendum";

export default function Aye() {
  const tally = useTally();

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
