import { css } from "styled-components";

export const editorOverride = css`
  textarea {
    background: ${(props) => props.theme.neutral};
    color: ${(props) => props.theme.textPrimary};
  }
  .ql-picker-label:hover,
  .ql-picker-item.ql-selected {
    color: ${(props) => props.theme.textPrimary} !important;
  }
  .editor-toolbar-buttons button.active {
    box-shadow: ${(props) => props.theme.neutral} 0px 1px 0px 0px;
  }
  div button:last-child {
    box-shadow: 1px 0 0 0 ${(props) => props.theme.grey400Border};
  }
  div button.active {
    background-color: ${(props) => props.theme.neutral} !important;
    border-color: ${(props) => props.theme.neutral} !important;
    color: ${(props) => props.theme.textPrimary} !important;
    box-shadow: 1px 0 0 0 ${(props) => props.theme.grey400Border};
    :last-child {
      box-shadow: ${(props) => props.theme.grey400Border} -1px 0px 0px 0px,
        ${(props) => props.theme.grey400Border} 1px 0px 0px 0px;
    }
  }
  div.modal {
    background-color: ${(props) => props.theme.textPrimary} !important;
    border-color: ${(props) => props.theme.grey200Border} !important;
  }
  .modal textarea {
    background-color: #${(props) => props.theme.neutral} !important;
    border-color: ${(props) => props.theme.grey200Border} !important;
    color: ${(props) => props.theme.textPrimary} !important;
  }
  .editor-toolbar,
  .ql-toolbar.ql-snow,
  span.ql-formats {
    background-color: ${(props) => props.theme.grey100Bg} !important;
    border-color: ${(props) => props.theme.grey400Border} !important;
  }
  .editor-toolbar-buttons > div {
    background-color: ${(props) => props.theme.grey400Border} !important;
  }
  button svg {
    path {
      fill: ${(props) => props.theme.textSecondary};
    }
  }
  button:hover svg path {
    fill: ${(props) => props.theme.textPrimary} !important;
  }
  .modal p,
  span.ql-picker-options {
    background-color: ${(props) => props.theme.neutral};
  }
  .html-body,
  .markdown-body,
  span.ql-picker-label.ql-active,
  .ql-picker-options .ql-picker-item {
    color: ${(props) => props.theme.textPrimary} !important;
    &:hover {
      color: ${(props) => props.theme.textPrimary} !important;
    }
  }
  caret-color: ${(props) => props.theme.textPrimary} !important;
  ${(props) =>
    props?.theme.isDark &&
    css`
      div.markdown-body pre,
      div.markdown-body code,
      div.html-body pre,
      div.html-body code {
        background: ${(props) => props.theme.grey100Bg} !important;
        code {
          color: ${(props) => props.theme.textPrimary} !important;
          text-shadow: none !important;
        }
      }
    `};
  > div > div {
    border-color: ${(props) => props.theme.grey300Border};
    :hover {
      border-color: ${(props) => props.theme.grey400Border};
    }
  }
  > div > div > div + div {
    border-color: ${(props) => props.theme.grey300Border} !important;
  }
  span.ql-formats button:last-child {
    box-shadow: none;
  }
`;
