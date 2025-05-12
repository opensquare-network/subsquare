import {
  BorderedRow,
  Value,
} from "next-common/components/referenda/tally/styled";
import NayIcon from "next-common/assets/imgs/icons/nay.svg";
import { useSelector } from "react-redux";
import { fellowshipVotesSelector } from "next-common/store/reducers/fellowship/votes";
import LoadingCount from "./loadingCount";

export default function Nay({ value = 0 }) {
  const { allNay } = useSelector(fellowshipVotesSelector);

  return (
    <BorderedRow>
      <LoadingCount count={allNay.length}>
        <NayIcon />
        Nay
      </LoadingCount>
      <Value>{value}</Value>
    </BorderedRow>
  );
}
