import { dateFormat } from "./dateFormat";

describe("dateFormat", () => {
	afterAll(() => {
		jest.useRealTimers();
	});

	it("formate correctement une date au format fr-FR", () => {
		const date = new Date("2023-12-24T00:00:00"); // dimanche 24 décembre 2023
		const result = dateFormat(date);

		// Ce qu'on attend : "dim. 24 déc. 2023"
		expect(result).toBe("dim. 24 déc. 2023");
	});
});
