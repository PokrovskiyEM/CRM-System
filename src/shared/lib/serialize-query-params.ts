type QueryParamValue = string | number | boolean | null | undefined | Array<string | number | boolean>;

/**
 * Массивы сериализуются через запятую (pointIds=1,2,3), а не повторением ключей.
 * Так URL короче: при ~100 pointIds повтор ключей легко раздувает query до лимита
 * браузера/прокси (~2–8 KB). Для очень больших фильтров на prod лучше POST с телом.
 */
export function serializeQueryParams(params: Record<string, QueryParamValue>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }

      searchParams.append(key, value.map(String).join(','));
      continue;
    }

    searchParams.append(key, String(value));
  }

  return searchParams.toString();
}
