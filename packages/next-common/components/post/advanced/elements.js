// These elements only for advanced form
import styled from "styled-components";
import FlexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import { p_14_normal } from "../../../styles/componentCss";

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

export const FormItem = styled.div`
  margin: 16px 0;
`;

export const FormLabel = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
  margin-bottom: 8px;
`;

export const PollFormAnonymousFormItem = styled(FlexBetweenCenter)`
  ${p_14_normal}
`;
