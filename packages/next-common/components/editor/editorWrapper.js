import styled from "styled-components";

const EditorWrapper = styled.div`
  /* plus padding */
  div.osn-previewer {
    padding: 6px 8px;
  }

  textarea {
    background: var(--neutral100);
    color: var(--textPrimary);
  }

  div ul.mention-list {
    z-index: 10;
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

  button svg {
    path {
      fill: var(--textSecondary);
    }
  }

  button:hover svg path {
    fill: var(--textPrimary) !important;
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

  /* quill paste url modal */
  & .modal-shade {
    z-index: 20;
  }
`;
export default EditorWrapper;
