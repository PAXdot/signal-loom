import assert from "node:assert";
import { describe, it } from "node:test";
import { FilterRule, FilterRuleParser } from "./filterRuleParser";

describe("FilterRuleParser", () => {
  describe("parse", () => {
    it("parses valid JSON", () => {
      const rule: FilterRule = {
        type: "include",
        value: "test",
      };

      const parsedRule = FilterRuleParser.parse(JSON.stringify(rule));

      assert.deepStrictEqual(parsedRule, rule);
    });

    it("throws error for invalid JSON", () => {
      assert.throws(() => {
        FilterRuleParser.parse("invalid json");
      }, Error, "Invalid filter rule JSON");
    });
  });
});
