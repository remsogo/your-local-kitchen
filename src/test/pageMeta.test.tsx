import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PageMeta from "@/components/PageMeta";

const trackAnalyticsEventMock = vi.fn();
const extractSearchQueryMock = vi.fn(() => null);

vi.mock("@/lib/analyticsEvents", () => ({
  trackAnalyticsEvent: (...args: unknown[]) => trackAnalyticsEventMock(...args),
  extractSearchQuery: (...args: unknown[]) => extractSearchQueryMock(...args),
}));

describe("PageMeta", () => {
  it("updates title and sends page_view event on route render", async () => {
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag = vi.fn();
    render(
      <MemoryRouter initialEntries={["/menu"]}>
        <PageMeta />
        <Routes>
          <Route path="/menu" element={<div>Menu</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toContain("Menu Pizz'Atiq");
      expect(trackAnalyticsEventMock).toHaveBeenCalled();
      expect((window as unknown as { gtag: (...args: unknown[]) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "page_view",
        expect.objectContaining({ page_path: "/menu" }),
      );
    });
  });
});

