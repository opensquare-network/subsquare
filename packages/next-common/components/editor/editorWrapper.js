import styled from "styled-components";
import RichTextStyleWrapper from "../content/richTextStyleWrapper";

const EditorWrapper = styled(RichTextStyleWrapper)`
  > div:first-child {
    max-width: 100%;
    border-radius: 16px;
    overflow: hidden;

    .editor-toolbar {
      display: flex;
      justify-content: space-between;
      border-color: var(--neutral300) !important;

      > div:first-child {
        position: static;
      }
    }

    /* switch markdown toggle */
    > div:nth-child(2) {
      padding: 12px 24px;
    }
  }

  /* plus padding */
  div.osn-previewer {
    padding: 6px 8px;
  }

  > div:first-child {
    border-color: var(--neutral400);
    &:hover {
      border-color: var(--neutral500);
    }
  }
  textarea {
    background: var(--neutral100);
    color: var(--textPrimary);
    padding: 16px 24px;
  }

  svg[width="26"] {
    path {
      fill: var(--textPrimary);
    }
    rect {
      stroke: var(--textPrimary);
    }
  }

  div.off {
    background: var(--neutral500);
  }

  div.on {
    background: var(--purple500);
  }

  div ul.mention-list,
  div.ql-mention-list-container {
    background: var(--neutral100);
    li[aria-selected="true"],
    li.ql-mention-list-item.selected,
    li:hover {
      background: var(--neutral200);
      background-color: var(--neutral200);
      color: var(--textPrimary);
    }
    li,
    li.ql-mention-list-item {
      color: var(--textPrimary);
    }
  }
  span.ql-picker-options {
    border: 1px solid var(--neutral300);
  }

  .ql-picker-label {
    color: var(--textSecondary);
  }
  .ql-picker-label:hover,
  .ql-picker-item.ql-selected {
    color: var(--textPrimary) !important;
    svg {
      polygon {
        stroke: var(--textPrimary) !important;
      }
    }
  }

  .editor-toolbar-buttons button {
    background-color: var(--neutral200) !important;
  }

  .editor-toolbar-buttons button.active {
    box-shadow: var(--neutral100) 0px 1px 0px 0px;
  }

  .editor-toolbar {
    /* left side: write and preview button */
    > div:first-child {
      button {
        padding: 12px 24px;
      }
    }
  }
  div button {
    //todo: add a className in editor repo later
    color: var(--textTertiary);
    &:hover {
      color: var(--textSecondary);
    }
  }

  div button.active {
    background-color: var(--neutral100) !important;
    border-color: var(--neutral100) !important;
    color: var(--textPrimary) !important;
    box-shadow: 1px 0 0 0 var(--neutral300);

    + button {
      box-shadow: 1px 0 0 0 var(--neutral300);
    }

    :last-child {
      box-shadow: var(--neutral300) -1px 0px 0px 0px,
        var(--neutral300) 1px 0px 0px 0px;
    }
  }

  div.modal {
    background-color: var(--neutral100) !important;
    border-color: var(--neutral300) !important;
  }

  .modal textarea {
    background-color: var(--neutral100) !important;
    border-color: var(--neutral300) !important;
    color: var(--textPrimary) !important;
  }

  .editor-toolbar,
  .ql-toolbar.ql-snow,
  span.ql-formats {
    background-color: var(--neutral200) !important;
    border-color: var(--neutral400) !important;
  }

  .editor-toolbar > div {
    border-color: var(--neutral400) !important;
  }

  .editor-toolbar-buttons > div {
    background-color: var(--neutral400) !important;
  }

  button svg {
    path {
      fill: var(--textSecondary);
    }
  }

  button:hover svg path {
    fill: var(--textPrimary) !important;
  }

  .modal p,
  span.ql-picker-options {
    background-color: var(--neutral100);
  }

  .html-body,
  .markdown-body,
  span.ql-picker-label.ql-active,
  .ql-picker-options .ql-picker-item {
    color: var(--textPrimary) !important;

    &:hover {
      color: var(--textPrimary) !important;
    }
  }

  caret-color: var(--textPrimary) !important;

  > div > div {
    border-color: var(--neutral300);
  }

  > div > div > div + div {
    border-color: var(--neutral400) !important;
  }

  span.ql-formats button:last-child {
    box-shadow: none;
  }
`;
export default EditorWrapper;
