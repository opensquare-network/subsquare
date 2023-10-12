import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { removeToast } from "../../store/reducers/toastSlice";
import useIsMounted from "../../utils/hooks/useIsMounted";
import Flex from "../../components/styled/flex";
import Loading from "../loading";
import ToastSuccessIcon from "../../assets/imgs/icons/toast-success.svg";
import ToastErrorIcon from "../../assets/imgs/icons/toast-error.svg";
import ToastWarningIcon from "../../assets/imgs/icons/toast-warning.svg";
import ToastRejectIcon from "../../assets/imgs/icons/toast-reject.svg";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  padding: 16px 16px;
  background: var(--neutral100);
  box-shadow: var(--shadow200);
  border-radius: 6px;
  border: 1px solid var(--neutral300);
  font-size: 14px;
  line-height: 140%;
  width: 320px;
  font-style: normal;
  font-weight: 400;
  color: var(--textPrimary);

  > img:first-child {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    flex: 0 0 auto;
  }
  > img:last-child {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    cursor: pointer;
    flex: 0 0 auto;
  }
  > div {
    flex-grow: 1;
    width: 224px;
    word-wrap: break-word;
  }
  transform: translateX(200%);
  transition: all 0.25s ease-out;
  &.tran {
    transform: translateX(min(calc((1248px - 100vw) / 2), 0px)) !important;
    @media screen and (max-width: 768px) {
      transform: translateX(32px) !important;
    }
  }
  @media screen and (max-width: 375px) {
    width: 100%;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
  width: 20px;
  height: 20px;
`;

const ToastItem = ({ type, message, id, sticky, timeout }) => {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [tranClass, setTranClass] = useState("");

  useEffect(() => {
    if (sticky) {
      return;
    }
    setTimeout(() => {
      dispatch(removeToast(id));
    }, timeout || 5000);
  }, [dispatch, id, sticky, timeout]);

  useEffect(() => {
    setTimeout(() => {
      if (isMounted.current) {
        setTranClass("tran");
      }
    }, 100);
  });

  if (!message) return null;

  return (
    <Wrapper className={tranClass}>
      <IconWrapper>
        {type === "pending" ? (
          <Loading size={16} />
        ) : type === "success" ? (
          <ToastSuccessIcon />
        ) : type === "warning" ? (
          <ToastWarningIcon />
        ) : type === "error" ? (
          <ToastErrorIcon />
        ) : null}
      </IconWrapper>
      <div>{message}</div>
      <ToastRejectIcon
        onClick={() => {
          dispatch(removeToast(id));
        }}
      />
    </Wrapper>
  );
};

export default ToastItem;
