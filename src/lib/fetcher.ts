interface FetcherResponse {
  [key: string]: any;
}

const fetcher = <T = FetcherResponse>(
  ...args: Parameters<typeof fetch>
): Promise<T> => fetch(...args).then((res) => res.json());
