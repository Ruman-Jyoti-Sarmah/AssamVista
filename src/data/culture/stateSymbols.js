// State designations and cultural emblems of Assam, with official status noted
// only where applicable.
// Images via Wikimedia Commons (Special:FilePath — reliable, no arbitrary thumb widths).
//
// Data now lives in ./stateSymbols.json. The generated Commons URLs are stored
// as exact strings (width=1200, fully percent-encoded), so the original W()
// helper is no longer needed at runtime. This module remains as a
// compatibility wrapper so existing imports keep working unchanged — the
// named export STATE_SYMBOLS is preserved.
import data from "./stateSymbols.json" with { type: "json" };

export const STATE_SYMBOLS = data.STATE_SYMBOLS;
