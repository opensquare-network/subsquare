import styled from "styled-components";

const Bar = styled.div`
  margin: 8px 0;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #f6f7fa 0%,
    rgba(246, 247, 250, 0.5) 49.5%,
    #f6f7fa 100%
  );
`;

export default function ExtrinsicLoading() {
  return (
    <div className="flex flex-col">
      <Bar className="w-[80px]"></Bar>
      <Bar className="w-full"></Bar>
      <Bar className="w-full"></Bar>
    </div>
  );
}
