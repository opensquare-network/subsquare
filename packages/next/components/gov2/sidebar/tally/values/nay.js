import { useSelector } from "react-redux";
import { votesSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import NayIcon from "next-common/assets/imgs/icons/nay.svg";
import LoadingCount from "./loadingCount";
import SymbolValue from "./symbolValue";
import { Row } from "next-common/components/referenda/tally/styled";
import useSubReferendaTally from "next-common/hooks/referenda/useSubReferendaTally";

export default function Nay() {
  const { allNay = [] } = useSelector(votesSelector);
  const tally = useSubReferendaTally();

  return (
    <Row>
      <LoadingCount count={allNay.length}>
        <NayIcon />
        Nay
      </LoadingCount>
      <SymbolValue value={tally?.nays} />
    </Row>
  );
}
