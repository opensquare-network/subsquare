import styled from "styled-components";
import React from "react";
import {
  bg_theme,
  border,
  border_theme_grey200,
  cursor_pointer,
  gap_x,
  inline_flex,
  items_center,
  justify_between,
  m_l,
  outline_none,
  p_x,
  p_y,
  rounded_4,
  text_tertiary,
  text_theme,
  w_full,
} from "../../styles/tailwindcss";
import {
  p_12_medium,
  p_14_medium,
  shadow_100,
} from "../../styles/componentCss";
import ClosePanelIcon from "../icons/closePanel";
import { useSelector } from "react-redux";
import {
  cmdkTriggerVisibleSelector,
  setCmdkPaletteVisible,
  setCmdkTriggerVisible,
} from "../../store/reducers/cmdkSlice";
import { useDispatch } from "react-redux";
import { useIsMacOS } from "../../context/page";

const Trigger = styled.button`
  ${p_x(18)};
  ${p_y(10)};
  ${bg_theme("neutral")};
  ${shadow_100};
  ${rounded_4};
  ${p_14_medium};
  ${border};
  ${text_tertiary};
  ${border_theme_grey200};
  ${w_full};
  ${cursor_pointer};
  ${inline_flex};
  ${gap_x(8)};
  ${items_center};
  ${justify_between};
  ${outline_none};
`;

const HotKey = styled.span`
  background-color: var(--purple100);
  ${text_theme("primaryPurple500")};
  ${rounded_4};
  ${p_x(8)};
  ${p_y(2)};
  ${p_12_medium};
  ${m_l(8)};
`;

export default function MenuCMDKButton({ buttonStyle }) {
  const dispatch = useDispatch();
  const cmdkTriggerVisible = useSelector(cmdkTriggerVisibleSelector);
  const isMacOS = useIsMacOS();

  return (
    <div>
      {cmdkTriggerVisible && (
        <Trigger
          onClick={() => dispatch(setCmdkPaletteVisible(true))}
          style={buttonStyle}
        >
          <span>
            Navigation <HotKey>{isMacOS ? "⌘" : "Ctrl +"} K</HotKey>
          </span>
          <ClosePanelIcon
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setCmdkTriggerVisible(false));
            }}
          />
        </Trigger>
      )}
    </div>
  );
}
