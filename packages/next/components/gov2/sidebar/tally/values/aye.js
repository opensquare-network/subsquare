import { useSelector } from "react-redux";
import { votesSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import AyeIcon from "next-common/assets/imgs/icons/aye.svg";
import LoadingCount from "./loadingCount";
import SymbolValue from "./symbolValue";
import { BorderedRow } from "next-common/components/referenda/tally/styled";

export default function Aye({ value = 0 }) {
  const { allAye = [] } = useSelector(votesSelector);

  return (
    <BorderedRow>
      <LoadingCount count={allAye.length}>
        <AyeIcon />
        Aye
      </LoadingCount>
      <SymbolValue value={value} />
    </BorderedRow>
  );
}
