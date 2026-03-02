.PHONY: init clean ios android dev dev-android prod 

init:
	yarn install
	@echo "🔧 Initialisation de l'environnement Fastlane..."
	@command -v rbenv >/dev/null 2>&1 || { echo >&2 "❌ rbenv n'est pas installé. Installe-le : https://github.com/rbenv/rbenv"; exit 1; }
	@rbenv install -s 3.2.2
	@rbenv local 3.2.2
	@echo "📦 Installation des gems Ruby..."
	@bundle install
	@echo "✅ Fastlane prêt. Tu peux lancer 'make ios' ou 'make android'."

clean:
	rm -rf node_modules
	rm -rf .expo
	rm -rf .expo-shared
	rm -rf .turbo
	rm -rf .next
	rm -rf .cache
	rm -f yarn.lock
	yarn install

ios:
	npx expo prebuild --clean --platform ios
	npx expo run:ios

android:
	npx expo prebuild --clean --platform android
	npx expo run:android

dev: 
	npx eas build --profile development --platform ios
	npx expo start --dev-client

dev-android:
	npx eas build --profile development --platform android
	npx expo start --dev-client

prod:
	bundle exec fastlane ios beta
	bundle exec fastlane android beta