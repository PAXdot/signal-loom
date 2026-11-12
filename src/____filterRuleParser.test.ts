import assert from "node:assert";
import { describe, it } from "node:test";
import { FilterRule, FilterRuleParser } from "./filterRuleParser";

describe("FilterRuleParser", () => {
  describe("parse", () => {
    it("parses valid JSON and enforces schema", () => {
      const validRule: FilterRule = {
        type: "include",
        value: "test",
      };

      const invalidRule = { invalidProp: "test" };

      assert.doesNotThrow(() => {
        FilterRuleParser.parse(JSON.stringify(validRule));
      });

      assert.throws(() => {
        FilterRuleParser.parse(JSON.stringify(invalidRule));
      }, Error, "Invalid filter rule JSON: unexpected property 'invalidProp'");
    });

    it("throws error for invalid JSON syntax", () => {
      assert.throws(() => {
        FilterRuleParser.parse("invalid json");
      }, SyntaxError, "Unexpected token i in JSON at position 0");
    });
  });
});
