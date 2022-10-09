import styled from "styled-components";
import RichTextStyleWrapper from "../content/richTextStyleWrapper";

const EditorWrapper = styled(RichTextStyleWrapper)`
  > div:first-child {
    border-color: ${(props) => props.theme.grey300Border};
    &:hover {
      border-color: ${(props) => props.theme.grey400Border};
    }
  }
  textarea {
    background: ${(props) => props.theme.neutral};
    color: ${(props) => props.theme.textPrimary};
  }

  svg[width="26"] {
    path {
      fill: ${(props) => props.theme.textPrimary};
    }
    rect {
      stroke: ${(props) => props.theme.textPrimary};
    }
  }

  div.off {
    background: ${(props) => props.theme.grey400Border};
  }

  div.on {
    background: ${(props) => props.theme.primaryPurple500};
  }

  div ul.mention-list,
  div.ql-mention-list-container {
    background: ${(props) => props.theme.neutral};
    li[aria-selected="true"],
    li.ql-mention-list-item.selected,
    li:hover {
      background: ${(props) => props.theme.grey100Bg};
      background-color: ${(props) => props.theme.grey100Bg};
      color: ${(props) => props.theme.textPrimary};
    }
    li,
    li.ql-mention-list-item {
      color: ${(props) => props.theme.textPrimary};
    }
  }
  span.ql-picker-options {
    border: 1px solid ${(props) => props.theme.grey200Border};
  }

  .ql-picker-label {
    color: ${(props) => props.theme.textSecondary};
  }
  .ql-picker-label:hover,
  .ql-picker-item.ql-selected {
    color: ${(props) => props.theme.textPrimary} !important;
    svg {
      polygon {
        stroke: ${(props) => props.theme.textPrimary} !important;
      }
    }
  }

  .editor-toolbar-buttons button {
    background-color: ${(props) => props.theme.grey100Bg} !important;
  }

  .editor-toolbar-buttons button.active {
    box-shadow: ${(props) => props.theme.neutral} 0px 1px 0px 0px;
  }

  div button {
    //todo: add a className in editor repo later
    color: ${(props) => props.theme.textTertiary};
    &:hover {
      color: ${(props) => props.theme.textSecondary};
    }
  }

  div button.active {
    background-color: ${(props) => props.theme.neutral} !important;
    border-color: ${(props) => props.theme.neutral} !important;
    color: ${(props) => props.theme.textPrimary} !important;
    box-shadow: 1px 0 0 0 ${(props) => props.theme.grey300Border};

    + button {
      box-shadow: 1px 0 0 0 ${(props) => props.theme.grey300Border};
    }

    :last-child {
      box-shadow: ${(props) => props.theme.grey300Border} -1px 0px 0px 0px,
      ${(props) => props.theme.grey300Border} 1px 0px 0px 0px;
    }
  }

  div.modal {
    background-color: ${(props) => props.theme.neutral} !important;
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
    border-color: ${(props) => props.theme.grey300Border} !important;
  }

  .editor-toolbar > div {
    border-color: ${(props) => props.theme.grey300Border} !important;
  }

  .editor-toolbar-buttons > div {
    background-color: ${(props) => props.theme.grey300Border} !important;
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

  > div > div {
    border-color: ${(props) => props.theme.grey200Border};
  }

  > div > div > div + div {
    border-color: ${(props) => props.theme.grey300Border} !important;
  }

  span.ql-formats button:last-child {
    box-shadow: none;
  }
`;
export default EditorWrapper;
