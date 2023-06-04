import { useSelector } from "react-redux";
import { votesSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import NayIcon from "next-common/assets/imgs/icons/nay.svg";
import LoadingCount from "./loadingCount";
import SymbolValue from "./symbolValue";
import { Row } from "next-common/components/referenda/tally/styled";

export default function Nay({ value = 0 }) {
  const { allNay = [] } = useSelector(votesSelector);

  return (
    <Row>
      <LoadingCount count={allNay.length}>
        <NayIcon />
        Nay
      </LoadingCount>
      <SymbolValue value={value} />
    </Row>
  );
}
