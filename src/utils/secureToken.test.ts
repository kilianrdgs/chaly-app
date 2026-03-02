import * as SecureStore from "expo-secure-store";
import { getToken, removeToken, storeToken } from "./secureToken";

jest.mock("expo-secure-store");

describe("Token utils", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	it("storeToken appelle SecureStore.setItemAsync avec le bon token", async () => {
		const token = "cuitemap-token";
		await storeToken(token);

		expect(SecureStore.setItemAsync).toHaveBeenCalledWith("authToken", token);
	});

	it("getToken appelle SecureStore.getItemAsync et retourne le token", async () => {
		(SecureStore.getItemAsync as jest.Mock).mockResolvedValue("mon-token");
		const result = await getToken();

		expect(SecureStore.getItemAsync).toHaveBeenCalledWith("authToken");
		expect(result).toBe("mon-token");
	});

	it("removeToken appelle SecureStore.deleteItemAsync", async () => {
		await removeToken();

		expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("authToken");
	});
});
