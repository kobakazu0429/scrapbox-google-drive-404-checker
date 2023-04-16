import { getPage, getPages } from "./api/client.js";

export * from "./api/schema/index.js";

export const buildPageURL = (title: string) => {
  return `https://scrapbox.io/iwsq/${encodeURIComponent(title)}`;
};

export const api = {
  getPage,
  getPages,
};

export default { ...api, buildPageURL };
