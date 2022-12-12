import {
  Header,
  Row,
  Value,
} from "next-common/components/referenda/tally/styled";
import ElectorateIcon from "../../../../../public/imgs/icons/electorate.svg";
import { useTally } from "next-common/context/post/gov2/referendum";

export default function BareAye() {
  const tally = useTally();

  return (
    <Row>
      <Header>
        <ElectorateIcon />
        Bare Aye
      </Header>
      <Value>{tally.bareAyes}</Value>
    </Row>
  );
}
