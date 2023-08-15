import styled from "styled-components";

const Wrapper = styled.li`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  gap: 4px;
  border-radius: 4px;
  background: linear-gradient(
    270deg,
    rgba(4, 210, 197, 0.2) 0%,
    rgba(104, 72, 255, 0.2) 100%
  );
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;

  :not(:last-child) {
    margin-bottom: 8px;
  }
`;

export default function Item({ title, href }) {
  return (
    <Wrapper>
      <a href={href} target="_blank" rel="noreferrer">
        <span className="text-textPrimary">{title}</span>
        <div className="inline-flex text-textTertiary">↗</div>
      </a>
    </Wrapper>
  );
}
