import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { removeToast } from "store/reducers/toastSlice";
import { useIsMounted } from "utils/hooks";
import Flex from "components/flex";
import { shadow_200 } from "styles/componentCss";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  padding: 16px 16px;
  background: #ffffff;
  ${shadow_200};
  border-radius: 6px;
  border: 1px solid #ebeef4;
  font-size: 14px;
  line-height: 140%;
  width: 246px;
  > img:first-child {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    flex: 0 0 auto;
  }
  > img:last-child {
    width: 20px;
    height: 20px;
    margin-left: 8px;
    cursor: pointer;
    flex: 0 0 auto;
  }
  > div {
    flex-grow: 1;
    word-break: break-all;
    word-wrap: break-word;
  }
  transform: translateX(200%);
  transition: all 0.25s ease-out;
  &.tran {
    transform: translateX(0) !important;
  }
  @media screen and (max-width: 375px) {
    width: 100%;
  }
`;

const ToastItem = ({ type, message, id }) => {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [tranClass, setTranClass] = useState("");

  useEffect(() => {
    setTimeout(() => {
      dispatch(removeToast(id));
    }, 2000);
  });

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
      <img src={`/imgs/icons/toast-${type}.svg`} alt="" />
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
