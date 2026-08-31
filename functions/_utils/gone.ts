export interface GoneContext {
  next: () => Promise<Response>;
}

/**
 * Reuse the exported branded 404 page while explicitly marking a known,
 * permanently retired route as gone.
 */
export async function respondGone(context: GoneContext): Promise<Response> {
  const notFound = await context.next();
  const headers = new Headers(notFound.headers);

  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex");

  return new Response(notFound.body, {
    status: 410,
    statusText: "Gone",
    headers,
  });
}
