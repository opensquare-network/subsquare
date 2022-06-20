// These elements only for advanced form
import styled from "styled-components";
import FlexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import { p_14_normal } from "../../../styles/componentCss";
import { primary_purple_500 } from "../../../styles/colors";

export const FormTitleWrapper = styled(FlexBetweenCenter)`
  margin: 16px 0 8px;
`;

export const FormTitle = styled.h4`
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  margin: 0;
  font-weight: 700;
`;

export const FormItemWrapper = styled.div`
  margin: 16px 0;
`;

export const FormLabelWrapper = styled(FlexBetweenCenter)`
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const FormExternalLabel = styled.div`
  font-size: 12px;
  line-height: 12px;
`;

export const FormLabel = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
`;

export const PollFormAnonymousFormItem = styled(FlexBetweenCenter)`
  ${p_14_normal}
`;

export const PollFormOptionFormItem = styled.div`
  /* Input.OuterWrapper */
  > div:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const PollFormOptionAddOptionButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${primary_purple_500};
  cursor: pointer;
`;
