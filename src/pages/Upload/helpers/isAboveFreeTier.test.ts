import isAboveFreeTier from "./isAboveFreeTier";

describe("isAboveFreeTier", () => {
	it.each([
		["above max anon user", 10 ** 10, false, true],
		["patrons pass", 10 ** 10, true, false],
		["below max anon user", 1000, false, false]
	])(
    "%s",
    (_, sizeInBytes, isPatron, expected) => {
      expect(isAboveFreeTier(sizeInBytes, isPatron)).toBe(expected);
    }
  );
});
