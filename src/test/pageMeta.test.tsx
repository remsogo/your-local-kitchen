import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PageMeta from "@/components/PageMeta";

const trackAnalyticsEventMock = vi.fn();
const extractSearchQueryMock = vi.fn(() => null);

vi.mock("@/lib/analyticsEvents", () => ({
  trackAnalyticsEvent: (...args: unknown[]) => trackAnalyticsEventMock(...args),
  extractSearchQuery: (...args: unknown[]) => extractSearchQueryMock(...args),
}));

describe("PageMeta", () => {
  beforeEach(() => {
    trackAnalyticsEventMock.mockClear();
    extractSearchQueryMock.mockClear();
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag = vi.fn();
  });

  it("updates title and sends page_view event on route render", async () => {
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

  it("does not send analytics events on admin route", async () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <PageMeta />
        <Routes>
          <Route path="/admin" element={<div>Admin</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toContain("Administration");
      expect(trackAnalyticsEventMock).not.toHaveBeenCalled();
      expect((window as unknown as { gtag: (...args: unknown[]) => void }).gtag).not.toHaveBeenCalledWith(
        "event",
        "page_view",
        expect.anything(),
      );
    });
  });

  it("injects hreflang alternates for localized routes", async () => {
    render(
      <MemoryRouter initialEntries={["/menu"]}>
        <PageMeta />
        <Routes>
          <Route path="/menu" element={<div>Menu</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      const frAlt = document.querySelector('link[rel="alternate"][hreflang="fr"]') as HTMLLinkElement | null;
      const enAlt = document.querySelector('link[rel="alternate"][hreflang="en"]') as HTMLLinkElement | null;
      expect(frAlt?.href).toContain("https://www.pizzatiq.fr/menu");
      expect(enAlt?.href).toContain("https://www.pizzatiq.fr/en/menu");
    });
  });
});
