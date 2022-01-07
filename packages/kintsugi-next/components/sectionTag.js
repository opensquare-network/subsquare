import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TagContainer = styled.div`
  padding: 4px 8px;
  border-radius: 10px;
  background: ${(p) => p.background};

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  white-space: nowrap;
  color: ${(p) => p.font};
`;

const COLORS = {
  Democracy: {
    background: "#FEF4F7",
    font: "#E81F66",
  },
  Treasury: {
    background: "#FFF5E5",
    font: "#FF9800",
  },
};

const getTagColor = (name) => {
  return COLORS[name] || COLORS.Democracy;
};

export default function SectionTag({ name }) {
  const color = getTagColor(name);
  return (
    <Wrapper>
      <TagContainer {...color}>{name}</TagContainer>
    </Wrapper>
  );
}
