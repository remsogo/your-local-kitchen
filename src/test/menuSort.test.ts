import { describe, expect, it } from "vitest";
import { sortMenuItemsByImage } from "@/lib/menuSort";

describe("sortMenuItemsByImage", () => {
  it("moves items without image to the end of a category", () => {
    const items = [
      { name: "A", imageUrl: "" },
      { name: "B", imageUrl: "https://example.com/b.jpg" },
      { name: "C", imageUrl: undefined },
      { name: "D", imageUrl: "https://example.com/d.jpg" },
    ];

    const sorted = sortMenuItemsByImage(items);
    expect(sorted.map((item) => item.name)).toEqual(["B", "D", "A", "C"]);
  });

  it("keeps relative order stable inside each image group", () => {
    const items = [
      { id: 1, imageUrl: "img-1.jpg" },
      { id: 2, imageUrl: "img-2.jpg" },
      { id: 3, imageUrl: undefined },
      { id: 4, imageUrl: undefined },
    ];

    const sorted = sortMenuItemsByImage(items);
    expect(sorted.map((item) => item.id)).toEqual([1, 2, 3, 4]);
  });
});
