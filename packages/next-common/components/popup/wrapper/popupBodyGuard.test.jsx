// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import PopupDialogRoot from "./root";

describe("PopupDialogRoot", () => {
  it("does not lock document.body and unmounts safely when it is gone", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    document.body.style.pointerEvents = "";
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <PopupDialogRoot>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>content</Dialog.Title>
            </Dialog.Content>
          </Dialog.Portal>
        </PopupDialogRoot>,
      );
    });

    // A modal dialog would set pointer-events: none on the body.
    expect(document.body.style.pointerEvents).toBe("");

    const originalBody = document.body;
    Object.defineProperty(document, "body", {
      configurable: true,
      value: null,
    });

    try {
      await act(async () => {
        root.unmount();
      });
    } finally {
      delete document.body;
      expect(document.body).toBe(originalBody);
      container.remove();
    }
  });
});
