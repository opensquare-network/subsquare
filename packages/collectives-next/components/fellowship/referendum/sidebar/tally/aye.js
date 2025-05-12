import { BorderedRow, Value } from "next-common/components/referenda/tally/styled";
import AyeIcon from "next-common/assets/imgs/icons/aye.svg";
import LoadingCount from "./loadingCount";
import { useSelector } from "react-redux";
import { fellowshipVotesSelector } from "next-common/store/reducers/fellowship/votes";

export default function Aye({ value = 0 }) {
  const { allAye } = useSelector(fellowshipVotesSelector);

  return (
    <BorderedRow>
      <LoadingCount count={ allAye.length }>
        <AyeIcon />
        Aye
      </LoadingCount>
      <Value>{ value }</Value>
    </BorderedRow>
  );
}
