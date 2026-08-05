import fs from "node:fs";
import path from "node:path";
import { checkLibraryAuth } from "@/lib/libraryAuth";

// Files live outside public/ on purpose. Anything under public/ is served
// statically before a route handler runs, which would bypass auth entirely.
const ROOT = path.join(process.cwd(), "library");
const INDEX = "Workflow_Map.html";

export const dynamic = "force-dynamic";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const NO_STORE = {
  // Cloudflare sits in front of this site and will happily cache a .pdf by
  // extension. private + no-store keeps the CDN from serving it to anyone.
  "Cache-Control": "no-store, private, max-age=0, must-revalidate",
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  "X-Content-Type-Options": "nosniff",
};

function notFound() {
  return new Response("Not found.", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8", ...NO_STORE },
  });
}

/** Resolve the request path inside ROOT, refusing anything that escapes it. */
function resolveWithin(segments) {
  const rel = segments.length ? segments.map(decodeURIComponent).join(path.sep) : INDEX;
  const target = path.resolve(ROOT, rel);
  const root = path.resolve(ROOT);
  // Traversal guard: ../ in the URL must not reach outside the library.
  if (target !== root && !target.startsWith(root + path.sep)) return null;
  return target;
}

export async function GET(request, { params }) {
  const denied = checkLibraryAuth(request);
  if (denied) return denied;

  const segments = (await params)?.path ?? [];
  let target = resolveWithin(segments);
  if (!target) return notFound();

  let stat;
  try {
    stat = fs.statSync(target);
  } catch {
    return notFound();
  }

  // Bare /library, or a directory, serves the map.
  if (stat.isDirectory()) {
    target = path.join(target, INDEX);
    try {
      stat = fs.statSync(target);
    } catch {
      return notFound();
    }
  }

  const ext = path.extname(target).toLowerCase();
  const type = TYPES[ext] || "application/octet-stream";

  // .docx has no browser viewer, so name it for the download.
  const disposition =
    ext === ".docx" || ext === ".pptx"
      ? `attachment; filename="${encodeURIComponent(path.basename(target))}"`
      : `inline; filename="${encodeURIComponent(path.basename(target))}"`;

  return new Response(fs.readFileSync(target), {
    status: 200,
    headers: {
      "Content-Type": type,
      "Content-Length": String(stat.size),
      "Content-Disposition": disposition,
      ...NO_STORE,
    },
  });
}

// Any other verb still has to authenticate, and still isn't allowed.
export async function POST(request) {
  const denied = checkLibraryAuth(request);
  if (denied) return denied;
  return new Response("Method not allowed.", { status: 405, headers: NO_STORE });
}
