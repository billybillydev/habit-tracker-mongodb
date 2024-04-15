export const limitValues = [4, 8, 12];

export function getPaginationQueries(url: URL): {
  limit: number;
  page: number;
  search?: string;
} {
  const res: { limit: number; page: number; search?: string } = {
    limit: Number(url.searchParams.get("limit")) || 4,
    page: Number(url.searchParams.get("page")) || 1,
  };
  const search = url.searchParams.get("search");
  if (search) {
    res.search = search;
  }
  return res;
}