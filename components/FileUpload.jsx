"use client";

import { useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, Paperclip, X } from "lucide-react";

// Resend caps an email at 40MB *after* base64, which inflates by ~33%. Staying
// under 20MB of raw bytes across every upload keeps the whole message safe.
export const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/*,application/pdf";

export const formatBytes = (b) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

/** Shrink phone photos so a dozen of them still fit in one email. */
async function compressImage(file, maxDim = 1800, quality = 0.72) {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", quality));
    bitmap.close?.();
    // Never hand back something larger than what we were given.
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    // HEIC and other formats the browser can't decode pass through untouched.
    return file;
  }
}

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function FileUpload({
  label,
  hint,
  files,
  onChange,
  otherBytes = 0,
  error,
}) {
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState("");
  const inputRef = useRef(null);

  const used = files.reduce((n, f) => n + f.size, 0);

  const add = async (incoming) => {
    if (!incoming.length) return;
    setBusy(true);
    setNotice("");

    const accepted = [];
    let running = used + otherBytes;
    const rejected = [];

    for (const raw of incoming) {
      const isImage = raw.type.startsWith("image/");
      if (!isImage && raw.type !== "application/pdf") {
        rejected.push(`${raw.name} — only images and PDFs`);
        continue;
      }
      const file = await compressImage(raw);
      if (file.size > MAX_FILE_BYTES) {
        rejected.push(`${file.name} — over ${formatBytes(MAX_FILE_BYTES)}`);
        continue;
      }
      if (running + file.size > MAX_TOTAL_BYTES) {
        rejected.push(`${file.name} — would exceed the total limit`);
        continue;
      }
      running += file.size;
      accepted.push(file);
    }

    if (accepted.length) onChange([...files, ...accepted]);
    if (rejected.length) setNotice(rejected.join(" · "));
    setBusy(false);
  };

  const remove = (i) => onChange(files.filter((_, fi) => fi !== i));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60">
          {label}
        </label>
        {files.length > 0 && (
          <span className="text-[11px] text-teal/45">
            {files.length} file{files.length === 1 ? "" : "s"} ·{" "}
            {formatBytes(used)}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-teal/45 mb-2.5">{hint}</p>}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add([...e.dataTransfer.files]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed px-4 py-5 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-bronze bg-bronze/5"
            : error
              ? "border-red-300 bg-cream-light"
              : "border-teal/20 bg-cream-light hover:border-bronze/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            add([...e.target.files]);
            e.target.value = "";
          }}
        />
        {busy ? (
          <div className="flex items-center justify-center gap-2 text-teal/60 text-sm">
            <Loader2 size={16} className="animate-spin" /> Preparing…
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-teal/55 text-sm">
            <Paperclip size={16} className="text-bronze" />
            <span>
              <span className="text-bronze font-semibold">Choose files</span> or
              drop them here
            </span>
          </div>
        )}
      </div>

      {notice && <p className="text-red-500 text-xs mt-2">{notice}</p>}
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white border border-teal/10"
            >
              {f.type === "application/pdf" ? (
                <FileText size={16} className="text-bronze flex-shrink-0" />
              ) : (
                <ImageIcon size={16} className="text-bronze flex-shrink-0" />
              )}
              <span className="text-teal text-sm truncate flex-1">{f.name}</span>
              <span className="text-teal/40 text-xs flex-shrink-0">
                {formatBytes(f.size)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(i);
                }}
                className="text-teal/40 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label={`Remove ${f.name}`}
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
