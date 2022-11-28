import { useSelector } from "react-redux";
import { votesSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import NayIcon from "../../../../../public/imgs/icons/nay.svg";
import { Row } from "./styled";
import { useTally } from "next-common/context/post/gov2/referendum";
import LoadingCount from "./loadingCount";
import SymbolValue from "./symbolValue";

export default function Nay() {
  const { allNay = [] } = useSelector(votesSelector);
  const tally = useTally();

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
