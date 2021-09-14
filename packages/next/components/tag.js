import styled from "styled-components";

const Wrapper = styled.div`
  padding: 4px 8px;
  background: ${(p) => p.color ?? "#c2c8d5"};
  border-radius: 2px;
  color: #ffffff;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
`;

const START = "#2196F3";
const ACTIVE = "#0F6FFF";
const POSITIVE = "#4CAF50";
const NEGATIVE = "#F44336";
const END = "#C2C8D5";

const getTagColor = (name) => {
  if (name && name.startsWith("Tipping")) return ACTIVE;
  switch (name) {
    case "Proposed":
    case "Extended":
    case "Opened":
    case "Started":
      return START;
    case "Tipping":
      return ACTIVE;
    case "Passed":
    case "Claimed":
    case "Executed":
    case "Tabled":
      return POSITIVE;
    case "Rejected":
    case "Retracted":
    case "Slashed":
    case "Disapproved":
    case "NotPassed":
    case "Cancelled":
      return NEGATIVE;
  }
  return END;
};

export default function Tag({ name }) {
  const color = getTagColor(name);
  return <Wrapper color={color}>{name}</Wrapper>;
}
