# Makefile for JOBAD

# Build everything
all: deps js css libs templates doc
clean: clean-templates clean-doc clean-release
libs: js-libs css-libs

# Get the dependencies
deps: pipdeps
clean-deps:
	rm -rf node_modules
pipdeps:
	pip install markdown2 pygments beautifulsoup4 # To build the doc

# Templates
templates:
	bash build/build-templates.sh
clean-templates:
	rm -rf examples/build
	bash build/cleanup.sh

# Documentation
doc: pipdeps
	bash build/build-doc.sh
clean-doc:
	rm -rf doc/html

# Just Build the release version
release: js css
clean-release:
	rm -rf build/release

# JavaScript
js: js-dev js-min js-libs

js-dev:
	grunt jsdev
js-min:
	grunt jsmin
js-libs:
	grunt jslibs

# CSS
css: css-dev css-min css-libs

css-dev:
	grunt cssdev
css-min:
	grunt cssmin
css-libs:
	grunt csslibs
