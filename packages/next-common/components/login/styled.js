import styled from "styled-components";
import tw from "tailwind-styled-components";

export const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export const FormInputsWrapper = styled.div``;

export const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 12px;
  color: var(--textPrimary);
  :not(:first-child) {
    margin-top: 16px;
  }
`;

export const Info = tw.div`
  rounded-[8px]
  py-[10px]
  px-[16px]
  text14Medium
  text-textSecondary
  bg-neutral200
`;

export const Redirect = styled.div`
  text-align: center;
  color: var(--textSecondary);
  .sec {
    font-weight: bold;
    color: var(--theme500);
    margin-left: 8px;
  }
`;
