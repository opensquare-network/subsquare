import { useSelector } from "react-redux";
import NayIcon from "next-common/assets/imgs/icons/nay.svg";
import LoadingCount from "./loadingCount";
import SymbolValue from "./symbolValue";
import { Row } from "next-common/components/referenda/tally/styled";
import { allNaySelector } from "next-common/store/reducers/referenda/votes/selectors";

export default function Nay({ value = 0 }) {
  const allNay = useSelector(allNaySelector);

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
