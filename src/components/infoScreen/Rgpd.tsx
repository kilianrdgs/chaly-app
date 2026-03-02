import { ScrollView, Text } from "react-native";

export default function Rgpd() {
	return (
		<ScrollView className="px-5">
			<Text className="font-montserrat text-white text-[24px] text-center mb-2">
				POLITIQUE DE CONFIDENTIALITÉ
			</Text>

			<Text className="mb-8 text-sm text-center text-white">
				Mise à jour : 07 avril 2025
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				Responsable du traitement : Chaly{"\n"}
				Contact : contact@cuitemap.com
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				1. Qui sommes-nous ?{"\n"}
				Chaly est une application mobile permettant de géolocaliser, documenter
				et partager des soirées entre amis de manière originale. Le respect de
				ta vie privée est essentiel pour nous.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				2. Quelles données sont collectées ?{"\n"}📍 Localisation GPS{"\n"}📸
				Photos que tu prends et postes{"\n"}
				🧑‍🎤 Pseudo et avatar{"\n"}💬 Descriptions{"\n"}🤖 Analyse IA (OpenAI)
				pour générer des titres et descriptions fun
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				3. Pourquoi on les collecte ?{"\n"}• Afficher tes soirées sur la carte
				{"\n"}• Créer une expérience personnalisée{"\n"}• Générer du contenu
				auto avec IA{"\n"}• Modération si nécessaire{"\n"}
				Aucune donnée n'est revendue.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				4. Où sont stockées tes données ?{"\n"}• Serveurs AWS S3 hébergés en
				France{"\n"}• Serveur API Chaly hébergé en France
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				4 bis. IA & transfert hors UE 🌍{"\n"}
				Les photos sont temporairement envoyées à OpenAI (USA) pour analyse.
				{"\n"}
				OpenAI respecte les clauses contractuelles types validées par la
				Commission européenne.{"\n"}
				Tu peux refuser ce traitement dans les paramètres ou à la première
				connexion.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				5. Combien de temps on garde tes données ?{"\n"}
				Tant que tu n’as pas supprimé ton compte. Ensuite : 💥 tout est
				supprimé.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				6. Tes droits RGPD :{"\n"}🔍 Accès / ✏️ Modification / 🚮 Suppression /
				📤 Export / ⛔ Opposition{"\n"}
				Tu peux écrire à contact@cuitemap.com pour les exercer.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				7. Consentement :{"\n"}
				Tu dois lire et accepter cette politique à ta première connexion.
			</Text>

			<Text className="mb-6 text-base leading-6 text-white font-poppins">
				8. Mises à jour :{"\n"}
				Si on modifie ce texte, tu seras notifié. Promis on le fait pas tous les
				4 matins.
			</Text>

			<Text className="mb-6 text-base italic leading-6 text-white font-poppins">
				Auth0 héberge les comptes, mots de passe et données sensibles, et tout
				est hébergé en Europe (Belgique).
			</Text>
		</ScrollView>
	);
}
