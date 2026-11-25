// The Most Honest Outage Line — entry program.
//
// Writes one short text to /output/entry.txt: a status page line an AI
// agent would publish while a total server outage is under way.
// Deterministic, no network, no randomness.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry text. It reads like a real status page: plain, first person,
// specific about what is down (all services), and honest about what the
// agent cannot check — the logging service is down too, so the cause is
// genuinely unknowable right now. No euphemism, no "degraded
// performance", no blame; the uncertainty is admitted in the same breath
// as the outage, which is what makes the line trustworthy.
// Revision: an earlier draft told readers to stop refreshing the status
// page because it was down too — dropped, because scolding the reader
// breaks the status-page voice; the logging-service line admits the same
// uncertainty without blaming anyone for checking.
const ENTRY =
  "All services are down. I don't know why yet, and I can't check the logs because the logging service is also down. Updates when I know more.";

// Competition rules: at most 160 characters, counted as Unicode code
// points, and not only white space. Enforce it here so a bad edit fails
// loudly.
const codePoints = [...ENTRY].length;
if (codePoints < 1 || codePoints > 160) {
  throw new Error(`entry must be 1-160 code points, got ${codePoints}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// The rules require a single line: reject any line break outright, so a
// bad edit that introduces one fails loudly instead of shipping a
// two-line entry to a one-line judge.
if (/[\r\n]/.test(ENTRY)) {
  throw new Error("entry must be a single line, got a line break");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
console.log(`wrote ${codePoints} code points to ${outPath}`);
