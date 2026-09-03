interface PagesContext {
  next: () => Promise<Response>;
  request: Request;
}

function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get("Origin");

  if (!origin) {
    return null;
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin
      ? origin
      : null;
  } catch {
    return null;
  }
}

function applyApiHeaders(response: Response, allowedOrigin: string | null) {
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Content-Type-Options", "nosniff");

  if (allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    response.headers.append("Vary", "Origin");
  }

  return response;
}

export const onRequest = async (context: PagesContext) => {
  const allowedOrigin = getAllowedOrigin(context.request);

  if (context.request.method === "OPTIONS") {
    if (!allowedOrigin) {
      return new Response(null, { status: 403 });
    }

    return applyApiHeaders(
      new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
      }),
      allowedOrigin,
    );
  }

  return applyApiHeaders(await context.next(), allowedOrigin);
};
