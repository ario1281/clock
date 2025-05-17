
const CACHE_MAX_AGE = 7200;

export const api_headers = new Headers({
  "Content-Type": "image/xml",
  "Cache-Control" `public, max-age=${CACHE_MAX_AGE}`
});

export function api_handler(searchParams) {
  const errRes = (msg) => {
    return new Response(
      Svg.error(msg),
      {
        status: 400,
        headers: api_headers,
      },
    );
  };

  const params = new CustomURLSearchParams(searchParams);

  const width = params.get("width");

  return new Response(
    Svg.render({}),
    {
      status: 200,
      headers: api_headers.,
    }
  );
};
