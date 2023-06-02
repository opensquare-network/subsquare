import { Header, Row, Value } from "next-common/components/referenda/tally/styled";
import NayIcon from "next-common/assets/imgs/icons/nay.svg";
import useSubReferendaTally from "next-common/hooks/referenda/useSubReferendaTally";

export default function Nay() {
  const tally = useSubReferendaTally();

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
