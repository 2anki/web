import isAboveTier from "./isAboveFreeTier"

describe("isAboveFreeTier", () => {
	test("above max anon user", () => {
		expect(isAboveTier(10 **10)).toBe(true)
	})
	test("patrons pass", () => {
		const isPatron = true;
		expect(isAboveTier(10 ** 10, isPatron)).toBe(false);
	})
})