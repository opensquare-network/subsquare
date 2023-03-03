import { Wrapper } from "./styled";

export default function IndexItem({ index, indexName = "Index" }) {
  return (
    <Wrapper>
      {indexName}: #{index}
    </Wrapper>
  );
}
