setup:
	echo "node version: `node -v`"
	npm i -g vuepress
run:
	vuepress dev src
build:
	vuepress build src
