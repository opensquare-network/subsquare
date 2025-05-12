import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import TurnoutIcon from "next-common/assets/imgs/icons/turnout.svg";
import useMaxVoters from "next-common/hooks/fellowship/useMaxVoters";

export default function MaxVoters() {
  const maxVoters = useMaxVoters();

  return (
    <BorderedRow>
      <Header>
        <TurnoutIcon />
        Max Voters
      </Header>
      <Value>{maxVoters}</Value>
    </BorderedRow>
  );
}
