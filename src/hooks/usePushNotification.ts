import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";
import getCuitesList from "../api/cuites/getCuitesList.api";
import createTokenNotification from "../api/users/createTokenNotification";
import DeleteTokenNotification from "../api/users/deleteTokenNotification";
import { useCuitesScrollStore } from "../store/cuites.store";
import { useNotificationStore } from "../store/postId.store";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export function usePushNotifications(onTokenReceived: (token: string) => void) {
	const setCuites = useCuitesScrollStore((state) => state.setCuites);

	useEffect(() => {
		const registerForPushNotificationsAsync = async () => {
			if (!Device.isDevice) return;

			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;

			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				DeleteTokenNotification();
				finalStatus = status;
			}

			if (finalStatus !== "granted") return;

			const { data: token } = await Notifications.getExpoPushTokenAsync();
			if (token) {
				onTokenReceived(token);
				createTokenNotification(token);
			}
		};

		registerForPushNotificationsAsync();

		const subscription = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				const data = response.notification.request.content.data;

				if (data?.postId) {
					useNotificationStore.getState().setPostId(data.postId);
					getCuites(data.postId);
					router.push("/scroll");
				}
			},
		);

		const getCuites = async (postId: number) => {
			const result = await getCuitesList(6, null, "scroll", "", postId);
			if (result) {
				setCuites(result.cuites, result.nextCursor);
			}
		};

		return () => subscription.remove();
	}, [onTokenReceived, setCuites]);
}
