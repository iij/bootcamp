setup:
	echo "node version: `node -v`"
run:
	npx vuepress dev src
build:
	npx vuepress build src
