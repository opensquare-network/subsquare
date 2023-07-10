import { setLayoutDetailSiderHeight } from "next-common/store/reducers/layoutSlice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 24px;
  top: 0;
  width: 300px;
  margin-top: 0px !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
`;

/**
 * @param {import("react").HTMLAttributes<HTMLDivElement>} props - The props object containing the properties passed to the function.
 */
export function RightBarWrapper(props) {
  const dispatch = useDispatch();
  const ref = useRef();
  useEffect(() => {
    dispatch(setLayoutDetailSiderHeight(ref.current.clientHeight));
  }, []);

  return (
    <Wrapper ref={ref} {...props}>
      {props.children}
    </Wrapper>
  );
}
