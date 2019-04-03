import assert from "assert";
import "mocha";
import { formatMate } from "../src/lib/commands/list";

describe("Array", function() {
	describe("#indexOf()", function() {
		it("should return -1 when the value is not present", function() {
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});
});

describe("list command", function() {
	it("the formatMete func should split AaaBaa to aaaBbb", function() {
		const target = "AaaBbb";
		const res = formatMate(target);
		assert.equal(res, "aaaBbb");
	});
});
