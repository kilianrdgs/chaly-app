import { ScrollView, Text } from "react-native";

export default function Cgu() {
	return (
		<ScrollView className="px-5">
			<Text className="font-montserrat text-white text-[24px] text-center mb-2">
				CONDITIONS D’UTILISATION
			</Text>
			<Text className="mb-8 text-sm text-center text-white">
				Mise à jour : 07 avril 2025
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				1. 🎉 À quoi sert Chaly ?{"\n"}
				Chaly te permet de prendre une photo de ta soirée, de la géolocaliser et
				de la partager sur une carte avec l'aide d'une IA fun. C’est un réseau
				social de cuite en temps réel.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				2. 📸 Ce que tu peux faire :{"\n"}• Partager une photo pendant ta soirée
				{"\n"}• Laisser l’IA te générer un titre et une description{"\n"}•
				Explorer les Chalyeurs autour de toi{"\n"}• Personnaliser ton pseudo et
				ton avatar
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				3. 🚫 Ce que tu ne peux pas faire :{"\n"}• Poster du contenu illégal,
				haineux ou NSFW{"\n"}• Voler l'identité ou les photos de quelqu’un
				d’autre{"\n"}• Utiliser l’app à des fins commerciales sans notre accord
				{"\n"}• Hacker, tricher ou nuire à l’expérience des autres
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				4. 👮 Modération :{"\n"}
				Les contenus sont modérés. Si tu dépasses les limites, ton contenu ou
				ton compte peuvent être supprimés sans préavis.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				5. 🧠 Propriété intellectuelle :{"\n"}
				Tu restes propriétaire de tes photos, mais en les publiant sur Chaly, tu
				acceptes qu'elles soient visibles sur la carte et utilisées de façon
				anonyme pour améliorer l’app.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				6. 🚀 Évolutions :{"\n"}
				L’app peut évoluer, changer de design ou de fonctionnalités sans
				notification obligatoire. Les conditions peuvent aussi être mises à
				jour.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				7. 🤝 Respect & bienveillance :{"\n"}
				Chaly est un lieu chill entre fêtards. On compte sur toi pour rester
				drôle, cool, créatif — et pas toxique.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				8. 📩 Contact :{"\n"}
				Une question, un souci ? Tu peux nous écrire à : contact@cuitemap.com
			</Text>
		</ScrollView>
	);
}
