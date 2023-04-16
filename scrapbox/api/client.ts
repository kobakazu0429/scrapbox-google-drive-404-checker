import { pagesSchema, pageSchema } from "./schema/index.js";

const client = async (path: string) => {
  const BASE_URL = `https://scrapbox.io/api`;
  const response = await fetch(BASE_URL + path);
  return response.json();
};

export const getPages = async (limit = 1000) => {
  const response = await client(`/pages/iwsq?limit=${limit}`);
  if (response.limit < response.count) {
    throw new Error(
      `response.limit(${response.limit}) < response.count(${response.count})`
    );
  }
  return pagesSchema.parse(response);
};

export const getPage = async (title: string) => {
  const response = await client(`/pages/iwsq/${title}`);
  return pageSchema.parse(response);
};
