import styled from "styled-components";

export const StatementContent = styled.div`
  margin-top: 16px;
  background: var(--neutral100);
  border: 1px solid var(--neutral300);
  box-shadow: var(--shadow100);
  border-radius: 6px;
  color: var(--textPrimary);
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
  }

  p,
  h2,
  h3,
  li {
    color: var(--textPrimary) !important;
  }
`;

export const StatementTitle = styled.h1`
  font-size: 1.5rem;
  line-height: 100%;
  font-weight: bold;
  margin-bottom: 1.5rem;
  margin-top: 0;
`;

export const LegalBreadcrumb = ({ title }) => {
  return (
    <div className="flex mt-[16px] ml-[48px] max-sm:ml-[24px] gap-[8px] text14Bold">
      <span className="text-textPrimary">Legal</span>
      <span className="text-textTertiary">/</span>
      <span className="text-textTertiary">{title}</span>
    </div>
  );
};
