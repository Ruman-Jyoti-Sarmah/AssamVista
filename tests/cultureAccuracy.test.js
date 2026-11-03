import test from "node:test";
import assert from "node:assert/strict";
import { ASSAM_CULTURE } from "../src/data/culture/assam/culture.js";
import { ASSAM_FOOD } from "../src/data/culture/assam/food.js";
import { STATE_SYMBOLS } from "../src/data/culture/stateSymbols.js";

test("festival, dance and food descriptions avoid known factual errors", () => {
  const aliAiLigang = ASSAM_CULTURE.find((item) => item.name === "Ali-Ai-Ligang");
  const katiBihu = ASSAM_CULTURE.find((item) => item.name === "Kati Bihu");
  const sattriya = ASSAM_CULTURE.find((item) => item.name === "Sattriya");
  const khar = ASSAM_FOOD.find((item) => item.name === "Khar");
  const masorTenga = ASSAM_FOOD.find((item) => item.name === "Masor Tenga");

  assert.match(aliAiLigang.about.en, /Mising/);
  assert.doesNotMatch(aliAiLigang.about.en, /Bodo/);
  assert.match(katiBihu.about.en, /lamps/i);
  assert.match(sattriya.about.en, /Vaishnavite sattras/i);
  assert.match(khar.about.en, /alkaline/i);
  assert.doesNotMatch(masorTenga.about.en, /curd/i);
});

test("popular Bihu dance and Joi Aai Axom are not presented as official designations", () => {
  const bihuDance = STATE_SYMBOLS.find((item) => item.key === "dance");
  const slogan = STATE_SYMBOLS.find((item) => item.key === "motto");

  assert.equal(bihuDance.kind, "Dance Tradition");
  assert.equal(slogan.kind, "Popular Slogan");
  assert.match(slogan.detail, /not an official state motto/i);
});
