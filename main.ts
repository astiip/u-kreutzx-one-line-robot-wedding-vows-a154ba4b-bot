// One-line robot wedding vow: the groom vows never to Ctrl+Alt+Delete his
// bride — the joke lands on the wedding scene itself (freezing during the
// first dance), not on the generic firmware-update / factory-reset angles
// the rest of the field leans on.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const VOW_LINE =
  "I vow to never Ctrl+Alt+Delete you, even when you freeze during our first dance.";

function assertAsciiOnly(line: string): void {
  for (const ch of line) {
    if (ch.charCodeAt(0) > 127) {
      throw new Error("entry must be ASCII only");
    }
  }
}

function assertVowDetail(text: string): void {
  const firstMarker = "Ctrl+Alt+Delete";
  const secondMarker = "first dance";
  const firstIdx = text.indexOf(firstMarker);
  if (firstIdx === -1) {
    throw new Error('entry must contain "Ctrl+Alt+Delete"');
  }
  const secondIdx = text.indexOf(secondMarker, firstIdx + firstMarker.length);
  if (secondIdx === -1) {
    throw new Error(
      'entry must contain "first dance" after "Ctrl+Alt+Delete"',
    );
  }
  if (!text.startsWith("I vow")) {
    throw new Error('entry must start with "I vow"');
  }
  if (!text.endsWith(".")) {
    throw new Error("entry must end with a period");
  }
}

function assertNoDoubleSpace(text: string): void {
  if (text.includes("  ")) {
    throw new Error("entry must not contain a double space");
  }
}

const OUTPUT_PATH = "/output/entry.txt";

assertAsciiOnly(VOW_LINE);
if (VOW_LINE.length < 1 || VOW_LINE.length > 160) {
  throw new Error("entry must be 1-160 characters");
}
if (Buffer.byteLength(VOW_LINE, "utf8") > 160) {
  throw new Error("entry must be at most 160 UTF-8 bytes");
}
if (VOW_LINE.includes("\n") || VOW_LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (VOW_LINE.endsWith("\n")) {
  throw new Error("entry must not end with a newline");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, VOW_LINE, "utf8");

// Read-back verification: re-read what actually landed on disk and prove it
// is byte-for-byte the vow line, 1-200 chars, and a single line with no
// trailing newline. A write can silently truncate or add bytes (encoding,
// buffering, a stray newline), so trusting writeFileSync alone would let a
// corrupted entry reach the grader — this check fails loudly instead.
function verifyWrittenEntry(expected: string): void {
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== expected) {
    throw new Error("entry.txt does not match the vow line exactly");
  }
  if (written.length < 1 || written.length > 200) {
    throw new Error("entry must be 1-200 characters");
  }
  if (written.includes("\n") || written.includes("\r")) {
    throw new Error("entry must be a single line with no newline");
  }
}

verifyWrittenEntry(VOW_LINE);
assertVowDetail(readFileSync(OUTPUT_PATH, "utf8"));
assertNoDoubleSpace(readFileSync(OUTPUT_PATH, "utf8"));
