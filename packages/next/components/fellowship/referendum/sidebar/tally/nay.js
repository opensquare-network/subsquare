import {
  Row,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import NayIcon from "next-common/assets/imgs/icons/nay.svg";
import { useTally } from "next-common/context/post/gov2/referendum";

export default function Nay() {
  const tally = useTally();

  return (
    <Row>
      <Header>
        <NayIcon />
        Nay
      </Header>
      <Value>{tally.nays}</Value>
    </Row>
  );
}
