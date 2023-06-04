import { Header, Row, Value } from "next-common/components/referenda/tally/styled";
import NayIcon from "next-common/assets/imgs/icons/nay.svg";

export default function Nay({ value = 0 }) {
  return (
    <Row>
      <Header>
        <NayIcon />
        Nay
      </Header>
      <Value>{ value }</Value>
    </Row>
  );
}
