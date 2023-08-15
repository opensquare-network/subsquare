import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ToastItem from "./toastItem";
import { toastsSelector } from "../../store/reducers/toastSlice";
import Flex from "../../components/styled/flex";

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 0;
  left: 0;
  top: 0;
  z-index: 10000;
`;

const ToastList = styled(Flex)`
  flex-direction: column-reverse;
  margin: 78px 32px auto auto;
  width: fit-content;
  > :not(:last-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 375px) {
    margin: 78px 16px auto;
  }
`;

const Toast = () => {
  const toasts = useSelector(toastsSelector);

  return (
    <Wrapper>
      <ToastList>
        {(toasts || []).map(({ type, message, id, sticky, timeout }) => (
          <ToastItem
            type={type}
            message={message}
            id={id}
            key={id}
            sticky={sticky}
            timeout={timeout}
          />
        ))}
      </ToastList>
    </Wrapper>
  );
};

export default Toast;
