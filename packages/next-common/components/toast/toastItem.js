import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { removeToast } from "../../store/reducers/toastSlice";
import useIsMounted from "../../utils/hooks/useIsMounted";
import Flex from "../../components/styled/flex";
import { shadow_200 } from "../../styles/componentCss";
import Loading from "../loading";
import ToastSuccessIcon from "../../assets/imgs/icons/toast-success.svg";
import ToastErrorIcon from "../../assets/imgs/icons/toast-error.svg";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  padding: 16px 16px;
  background: ${(props) => props.theme.neutral};
  ${shadow_200};
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.grey200Border};
  font-size: 14px;
  line-height: 140%;
  width: 320px;
  font-style: normal;
  font-weight: 400;
  color: ${(props) => props.theme.textPrimary};

  & > svg:first-child {
    margin-right: 12px;
    margin-top: 5px;
  }

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

const ToastItem = ({ type, message, id, sticky }) => {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [tranClass, setTranClass] = useState("");

  useEffect(() => {
    if (sticky) {
      return;
    }
    setTimeout(() => {
      dispatch(removeToast(id));
    }, 5000);
  }, [dispatch, id, sticky]);

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
      {type === "pending" ? (
        <Loading size={16} />
      ) : type === "success" ? (
        <ToastSuccessIcon />
      ) : type === "error" ? (
        <ToastErrorIcon />
      ) : null}
      <div>{message}</div>
      <img
        src={`/imgs/icons/toast-reject.svg`}
        onClick={() => {
          dispatch(removeToast(id));
        }}
        alt=""
      />
    </Wrapper>
  );
};

export default ToastItem;
