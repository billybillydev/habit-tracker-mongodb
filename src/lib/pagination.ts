export const limitValues = [4, 8, 12];

export function getPaginationQueries(url: URL): {
  limit: number;
  offset: number;
  search?: string;
} {
  const res: { limit: number; offset: number; search?: string } = {
    limit: Number(url.searchParams.get("limit")) || 4,
    offset: Number(url.searchParams.get("offset")) || 0,
  };
  const search = url.searchParams.get("search");
  if (search) {
    res.search = search;
  }
  return res;
}