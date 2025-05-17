

async function hander(request) {
  const { pathName, searchParams } = new URL(request.url);
  console.log({ pathName, searchParams: [...searchParams.entries()] });

  if (pathName === "/") {
    return new Response(await Deno.readFile("./template.html"), {
      headers: { "Content-type": "text/html" },
    })
  }
}
