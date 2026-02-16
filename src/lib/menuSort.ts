import { MenuItem } from "@/data/menuData";

const hasImage = (item: Pick<MenuItem, "imageUrl">) => Boolean(item.imageUrl && item.imageUrl.trim().length > 0);

export const sortMenuItemsByImage = <T extends Pick<MenuItem, "imageUrl">>(items: T[]): T[] => {
  // Keep relative order stable inside each group (with image / without image).
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const imageDelta = Number(hasImage(b.item)) - Number(hasImage(a.item));
      return imageDelta !== 0 ? imageDelta : a.index - b.index;
    })
    .map(({ item }) => item);
};
