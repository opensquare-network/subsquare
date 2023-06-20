import styled from "styled-components";
import { shadow_100 } from "../../styles/componentCss";
import { NeutralPanel } from "../styled/containers/neutralPanel";

export const ContentCenterWrapper = styled(NeutralPanel)`
  ${shadow_100};
  width: 400px;
  margin: 0 auto;
  padding: 48px;
  color: var(--textPrimary);
  > :not(:first-child) {
    margin-top: 24px;
  }
  @media screen and (max-width: 392px) {
    width: 100%;
  }
`;

export const LinkWrapper = styled.div`
  font-size: 14px;
  color: var(--textSecondary);
  text-align: center;
  a {
    font-weight: bold;
    color: var(--purple500);
    cursor: pointer;
  }
`;

export const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export const FormInputsWrapper = styled.div``;

export const FormButtonsWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

export const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 12px;
  :not(:first-child) {
    margin-top: 16px;
  }
`;

export const InfoWrapper = styled.div`
  padding: 12px 16px;
  background: var(--neutral200);
  border-radius: 4px;
  line-height: 150%;
  color: #506176;
`;

export const Redirect = styled.div`
  text-align: center;
  color: var(--textSecondary);
  .sec {
    font-weight: bold;
    color: var(--purple500);
    margin-left: 8px;
  }
`;
