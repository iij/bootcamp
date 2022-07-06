setup:
	echo "node version: `node -v`"
	npm i -g vuepress
	npm i -g @vue/compiler-sfc
run:
	vuepress dev src
build:
	vuepress build src
