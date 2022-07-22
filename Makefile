setup:
	echo "node version: `node -v`"
run:
	npx vuepress dev src
build:
	npm audit fix
	npx vuepress build src
