import { useSelector } from "react-redux";
import AyeIcon from "next-common/assets/imgs/icons/aye.svg";
import LoadingCount from "./loadingCount";
import SymbolValue from "./symbolValue";
import { BorderedRow } from "next-common/components/referenda/tally/styled";
import { allAyeSelector } from "next-common/store/reducers/referenda/votes/selectors";

export default function Aye({ value = 0 }) {
  const allAye = useSelector(allAyeSelector);

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
