import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { removeToast } from "store/reducers/toastSlice";

const Wrapper = styled.div`
  padding: 12px 16px;
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const ToastItem = ({ type, message, id }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(removeToast(id));
    }, 2000);
  });

  if (!message) return null;
  return (
    <Wrapper>
      <img src={`/imgs/icons/toast-${type}.svg`} alt="icon" />
      <div>{message}</div>
    </Wrapper>
  );
};

export default ToastItem;
