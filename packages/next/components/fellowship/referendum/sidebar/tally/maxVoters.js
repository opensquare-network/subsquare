import {
  Header,
  Row,
  Value,
} from "next-common/components/referenda/tally/styled";
import TurnoutIcon from "next-common/assets/imgs/icons/turnout.svg";
import useMaxVoters from "next-common/context/post/fellowship/useMaxVoters";

export default function MaxVoters() {
  const maxVoters = useMaxVoters();

  return (
    <Row>
      <Header>
        <TurnoutIcon />
        Max Voters
      </Header>
      <Value>{maxVoters}</Value>
    </Row>
  );
}
