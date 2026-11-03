import test from "node:test";
import assert from "node:assert/strict";
import { getSection, TRAVEL } from "../src/lib/section.js";

test("district search hashes remain in the travel section", () => {
  assert.equal(getSection("#/districts?q=Majuli"), TRAVEL);
});
