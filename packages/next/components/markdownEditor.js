import React, { useState } from "react";
import styled, { css } from "styled-components";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";
import Header from "../public/imgs/md-icons/header.svg";
import Bold from "../public/imgs/md-icons/bold.svg";
import Italic from "../public/imgs/md-icons/italic.svg";
import Quote from "../public/imgs/md-icons/quote.svg";
import OrderedList from "../public/imgs/md-icons/ordered-list.svg";
import UnorderedList from "../public/imgs/md-icons/unordered-list.svg";
import Link from "../public/imgs/md-icons/link.svg";
import Image from "../public/imgs/md-icons/image.svg";
import Code from "../public/imgs/md-icons/code.svg";

const icons = new Map([
  ["header", <Header />],
  ["bold", <Bold />],
  ["italic", <Italic />],
  ["quote", <Quote />],
  ["ordered-list", <OrderedList />],
  ["unordered-list", <UnorderedList />],
  ["link", <Link />],
  ["image", <Image />],
  ["code", <Code />],
]);

export const StyledTextArea = styled.div`
  ${(props) =>
    props &&
    !props.visible &&
    css`
      visibility: hidden;
      height: 0 !important;
    `}

  border: 1px solid #dddddd;
  border-radius: 0.25rem;

  &:hover,
  &.focused {
    border: 1px solid #b5b5b5;
  }

  & > section {
    margin-bottom: 8px;
  }

  textarea {
    color: #000 !important;
    padding: 0.75rem 1rem !important;
    line-height: 1.375 !important;
    outline: none;
    font-size: 0.875rem;
  }

  .mde-tabs {
    display: none !important;
  }
  

  .react-mde {
    border: none;
    border-radius: 0.25rem;

    .grip {
      border-top: none;
      color: #e6e6e6;

      .icon {
        margin-bottom: 1rem;
      }
    }
    
    .mde-textarea-wrapper {
      border-top-style: solid;
      border-top-width: 1px;
      border-top-color: #e6e6e6;
    }

    .mde-header {
      display: flex;
      justify-content: space-between;
      background: white !important;
      border-bottom: none;
      @media screen and (max-width: 600px) {
        overflow-y: hidden;
        white-space: nowrap;
        margin-right: 90px;
        ::-webkit-scrollbar {
          display: none;
        }
      }

      .mde-tabs {
        margin: 0 0.5rem;

        button {
          font-weight: 500;
          padding: 0.8rem 1.6rem;
          color: #53595c;
          background: #f7f9fa;
          border-radius: 0.3em;
          border-bottom-color: #ebf0f5;
          margin-bottom: -1px;
          margin-top: 1rem;

          &.selected,
          &:focus {
            background: white;
            color: #2e2f30;
            border-style: solid;
            border-width: 1px;
            border-color: #ebf0f5;
            outline: none;
            border-bottom-color: white;
            margin-bottom: -1px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            margin-top: 1rem;
          }

          &:hover {
            color: #2e2f30;
          }
        }
      }

      .mde-header-group {
        display: block;
        padding-right: 80px;

        .mde-header-item {
          display: inline-flex;
          align-items: center;

          button {
            color: #777b80;

            &:hover,
            &:active,
            &:focus {
              color: #2e2f30;
            }
          }

          .react-mde-dropdown {
            border-style: solid;
            border-width: 1px;
            border-color: #ebf0f5;
            border-radius: 0.5rem;

            .mde-header-item {
              button {
                p {
                  color: #777b80;
                }

                p:hover {
                  color: #2e2f30;
                }
              }
            }
          }
        }
      }
    }

    .mde-header + div {
      overflow: visible;
    }
  }

  .mde-text {
    border: 1px solid transparent !important;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  ul.mde-suggestions {
    z-index: 999999;
    background-color: #ffffff;
    border: none;

    li {
      padding: 4px 16px 4px 16px;
      border: none;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 22px;
    }

    li[aria-selected="true"] {
      background-color: #f8f8f8;
      color: #34373c;
    }

    li:hover {
      background-color: #f8f8f8;
      color: #34373c;
    }
  }
`;

const MarkdownEditor = ({
  content,
  setContent,
  users = [],
  height = 100,
  visible = true,
}) => {
  const loadSuggestions = async (text) => {
    return new Promise((accept) => {
      const suggestions = (users || [])
        .map((user) => ({
          preview: user,
          value: `[@${user}](/member/${user})`,
        }))
        .filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
      accept(suggestions);
    });
  };

  const [focused, setFocused] = useState(false);

  return (
    <StyledTextArea
      className={focused ? "container focused" : "container"}
      visible={visible}
    >
      <ReactMde
        initialEditorHeight={height}
        value={content}
        onChange={(targetValue) => setContent(targetValue)}
        loadSuggestions={loadSuggestions}
        toolbarCommands={[
          [
            "header",
            "bold",
            "italic",
            "quote",
            "ordered-list",
            "unordered-list",
            "link",
            "image",
            "code",
          ],
        ]}
        getIcon={(commandName) => {
          return icons.get(commandName);
        }}
        childProps={{
          textArea: {
            onFocus: () => {
              setFocused(true);
            },
            onBlur: () => {
              setFocused(false);
            },
          },
        }}
      />
    </StyledTextArea>
  );
};

export default MarkdownEditor;
