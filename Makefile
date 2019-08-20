setup:
	echo "node version: `node -v`"
	npm i -g vuepress
run:
	vuepress dev docs
build:
	vuepress build docs
