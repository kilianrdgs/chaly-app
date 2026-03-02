import { View } from "react-native";
import type { Cuite } from "../../store/cuites.store";
import ItemScroll from "../scroll/ItemScroll";

export default function Publications({ item }: { item: Cuite }) {
	return (
		<View style={{ width: "33.33%", height: 220 }}>
			<ItemScroll
				cuiteId={item.Id}
				title={item.Titre ?? "Sans titre"}
				description={item.Description}
				urlPicture={item.UrlPicture}
				UserPseudo={item.UserPseudo}
				UserPicture={item.UserPicture ?? null}
				CuiteDate={item.CuiteDate}
				LikeCount={item.LikeCount}
				LikedByMe={item.LikedByMe}
				CommentCount={item.CommentCount}
				mode="profile"
			/>
		</View>
	);
}
