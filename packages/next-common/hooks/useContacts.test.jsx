// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

const mockFetch = vi.fn();
const mockDispatch = vi.fn();

vi.mock("next-common/services/nextApi", () => ({
  default: { fetch: (...args) => mockFetch(...args) },
}));
vi.mock("react-redux", () => ({ useDispatch: () => mockDispatch }));
vi.mock("next-common/store/reducers/toastSlice", () => ({
  newErrorToast: (message) => ({ type: "error", message }),
}));

const useContacts = (await import("./useContacts")).default;

global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

function Probe({ isLoggedIn, onState }) {
  onState(useContacts(isLoggedIn));
  return null;
}

async function renderLogState(isLoggedIn) {
  const renders = [];
  await act(async () => {
    root.render(
      <Probe
        isLoggedIn={isLoggedIn}
        onState={(state) => renders.push(state)}
      />,
    );
  });
  return Object.assign(() => renders[renders.length - 1], { renders });
}

beforeEach(() => {
  mockFetch.mockReset();
  mockDispatch.mockReset();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe("useContacts", () => {
  it("starts loading on the first render when the user is logged in", async () => {
    mockFetch.mockReturnValueOnce(new Promise(() => {}));
    const state = await renderLogState(true);

    // No empty list flash before the request is sent
    expect(state.renders[0].isLoading).toBe(true);
    expect(state.renders[0].contacts).toEqual([]);
  });

  it("does not request contacts for anonymous users", async () => {
    const state = await renderLogState(false);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(state().isLoading).toBe(false);
    expect(state().contacts).toEqual([]);
  });

  it("ignores the response of a previous account after logout", async () => {
    let resolveRequest;
    mockFetch.mockReturnValueOnce(
      new Promise((resolve) => (resolveRequest = resolve)),
    );

    const firstState = await renderLogState(true);
    expect(firstState().isLoading).toBe(true);

    const state = await renderLogState(false);
    expect(state().contacts).toEqual([]);

    await act(async () => {
      resolveRequest({ result: [{ name: "old account contact" }] });
    });

    expect(state().contacts).toEqual([]);
    expect(state().isLoading).toBe(false);
  });

  it("loads contacts of the logged in account", async () => {
    mockFetch.mockResolvedValueOnce({ result: [{ name: "Alice" }] });
    const state = await renderLogState(true);

    expect(state().contacts).toEqual([{ name: "Alice" }]);
    expect(state().isLoading).toBe(false);
  });

  it("keeps loaded contacts and toasts when a refresh fails", async () => {
    mockFetch.mockResolvedValueOnce({ result: [{ name: "Alice" }] });
    const state = await renderLogState(true);
    expect(state().contacts).toEqual([{ name: "Alice" }]);

    mockFetch.mockResolvedValueOnce({
      error: { status: 500, message: "Internal Server Error" },
    });
    await act(async () => {
      await state().refresh();
    });

    expect(state().contacts).toEqual([{ name: "Alice" }]);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "error",
      message: "Internal Server Error",
    });
    expect(state().isLoading).toBe(false);
  });

  it("asks to sign in when the session expired", async () => {
    mockFetch.mockResolvedValueOnce({
      error: { status: 401, message: "Unauthorized" },
    });
    await renderLogState(true);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "error",
      message: "Please sign in to load contacts",
    });
  });
});
