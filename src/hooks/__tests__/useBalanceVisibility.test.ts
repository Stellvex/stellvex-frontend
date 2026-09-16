import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBalanceVisibility } from "../useBalanceVisibility";

describe("useBalanceVisibility", () => {
	beforeEach(() => {
		window.localStorage.clear();
		vi.clearAllMocks();
	});

	it("initializes with default visibility", () => {
		const { result } = renderHook(() => useBalanceVisibility(false));

		expect(result.current.isVisible).toBe(false);
		expect(result.current.isInitialized).toBe(true);
	});

	it("reads from localStorage on mount", () => {
		window.localStorage.setItem("stellvex_balance_visibility", "true");
		const { result } = renderHook(() => useBalanceVisibility(false));

		expect(result.current.isVisible).toBe(true);
	});

	it("toggles visibility and saves to localStorage", () => {
		const { result } = renderHook(() => useBalanceVisibility(false));

		act(() => {
			result.current.toggleVisibility();
		});

		expect(result.current.isVisible).toBe(true);
		expect(window.localStorage.getItem("stellvex_balance_visibility")).toBe(
			"true",
		);
	});

	it("handles localStorage errors gracefully", () => {
		const mockGetItem = vi
			.spyOn(Storage.prototype, "getItem")
			.mockImplementation(() => {
				throw new Error("Access Denied");
			});
		const mockConsoleWarn = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

		const { result } = renderHook(() => useBalanceVisibility(true));

		expect(result.current.isVisible).toBe(true);
		expect(mockConsoleWarn).toHaveBeenCalledWith(
			"Failed to read balance visibility from localStorage:",
			expect.any(Error),
		);

		mockGetItem.mockRestore();
		mockConsoleWarn.mockRestore();
	});
});
