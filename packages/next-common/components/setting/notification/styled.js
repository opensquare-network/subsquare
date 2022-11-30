import styled from "styled-components";

const Label = styled.div`
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.textPrimary};
`;

const Sections = styled.div`
  display: ${(props) => (props.hide ? "none" : "flex")};
  flex-direction: column;
  gap: 16px;
  > div > :not(:first-child) {
    margin-left: 24px;
  }
`;

const SubLabel = styled.div`
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.textPrimary};
`;

const ToggleItem = styled.div`
  display: flex;
  align-items: center;
  line-height: 150%;
  padding: 8px 0;
  > :first-child {
    flex-grow: 1;
  }
  > :last-child {
    flex: 0 0 auto;
    margin-left: 16px;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  > :not(:first-child):before {
    content: "";
    display: block;
    margin-bottom: 24px;
    height: 1px;
    background-color: ${(props) => props.theme.grey200Border};
  }
`;

export { Label, Sections, SubLabel, ToggleItem, Options };
