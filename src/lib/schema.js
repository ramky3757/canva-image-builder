/**
 * Canvas Schema Versioning
 *
 * Every page JSON saved to the store or exported to a file carries a `_v`
 * envelope key.  This lets future code detect old formats and migrate them
 * before passing to Fabric.js – without breaking existing saved files.
 *
 * Bump SCHEMA_VERSION when the serialised format changes in a breaking way.
 * Add a migration branch in fromVersionedJson() for each past version.
 */

export const SCHEMA_VERSION = '1';
export const TEMPLATE_VERSION = '1';

// Fabric custom properties serialised alongside each object
export const CANVAS_CUSTOM_PROPS = ['id', 'name', 'selectable', 'evented'];

/**
 * Wrap a raw Fabric canvas JSON object with the schema version envelope.
 * Pass the result of canvas.toJSON() here before storing/exporting.
 */
export function toVersionedJson(canvasJson) {
  const raw = typeof canvasJson === 'string' ? JSON.parse(canvasJson) : canvasJson;
  return { _v: SCHEMA_VERSION, ...raw };
}

/**
 * Strip the envelope key and run any needed migrations, returning a plain
 * Fabric-compatible JSON object safe to pass to canvas.loadFromJSON().
 *
 * Handles both versioned files (have `_v`) and pre-versioning files (no `_v`).
 */
export function fromVersionedJson(json) {
  if (!json) return json;
  const raw = typeof json === 'string' ? JSON.parse(json) : json;

  const v = raw._v ?? '0'; // '0' = pre-versioning

  // ── migrations (add future cases here) ──────────────────────────────────
  // example: if (v === '1') return migrateV1toV2({ ...raw });
  // ────────────────────────────────────────────────────────────────────────

  if (v !== SCHEMA_VERSION && v !== '0') {
    console.warn(
      `[Canvas] Loading schema v${v} into editor at v${SCHEMA_VERSION}. ` +
      `Attempting best-effort load — add a migration in src/lib/schema.js.`
    );
  }

  // Strip the envelope key; Fabric doesn't know about it
  const { _v, ...fabricJson } = raw;
  return fabricJson;
}
