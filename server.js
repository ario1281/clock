

async function hander(request) {
  const { pathName, searchParams } = new URL(request.url);
  console.log({ pathName, searchParams: [...searchParams.entries()] });

  if (pathName === "/") {
    return new Response(await Deno.readFile("./template.html"), {
      headers: { "Content-type": "text/html" },
    })
  }

  return new Response("404 Not Found", {
    status: 404,
    statusText: "Not Found",
  });
}

Deno.serve(async (request) => {
  return await handler(request);
});
