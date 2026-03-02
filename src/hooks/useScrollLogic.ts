// hooks/useScrollLogic.ts
import { useCallback } from "react";
import getCuites from "../api/cuites/getCuitesList.api";
import type { Cuite } from "../store/cuites.store";

type Store = {
	nextCursor: string | null;
	addCuites: (newCuites: Cuite[], nextCursor: string | null) => void;
	reset: () => void;
	loading: boolean;
	setLoading: (val: boolean) => void;
	isEndReached: boolean;
};

export const useScrollLogic = (
	username: string,
	store: Store,
	limit = 6,
	mode: "profile" | "scroll" = "profile",
	pseudo: string | null = null,
) => {
	const { nextCursor, addCuites, reset, loading, setLoading, isEndReached } =
		store;

	const fetchCuites = useCallback(
		async (cursor: string | null) => {
			const targetUsername = pseudo ?? username;
			if (!targetUsername) return;

			const result = await getCuites(limit, cursor, mode, targetUsername);
			if (result) {
				if (cursor) {
					addCuites(result.cuites, result.nextCursor);
				} else {
					reset();
					addCuites(result.cuites, result.nextCursor);
				}
			}
		},
		[username, pseudo, limit, mode, addCuites, reset],
	);

	const loadMoreCuites = useCallback(async () => {
		if (loading || isEndReached) return;
		setLoading(true);
		try {
			await fetchCuites(nextCursor);
		} catch (error) {
			console.error("Erreur lors du chargement des cuites :", error);
		} finally {
			setLoading(false);
		}
	}, [loading, isEndReached, setLoading, fetchCuites, nextCursor]);

	const refreshCuites = useCallback(async () => {
		setLoading(true);
		try {
			await fetchCuites(null);
		} catch (error) {
			console.error("Erreur lors du rafraîchissement :", error);
		} finally {
			setLoading(false);
		}
	}, [fetchCuites, setLoading]);

	return {
		loading,
		loadMoreCuites,
		refreshCuites,
	};
};
