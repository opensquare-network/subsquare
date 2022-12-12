import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import NayIcon from "../../../../../public/imgs/icons/nay.svg";
import { useTally } from "next-common/context/post/gov2/referendum";

export default function Nay() {
  const tally = useTally();

  return (
    <BorderedRow>
      <Header>
        <NayIcon />
        Nay
      </Header>
      <Value>{tally.nays}</Value>
    </BorderedRow>
  );
}
