deps:
	@echo \* Installing dependencies...
	apt update
	apt install -y ruby-full build-essential zlib1g-dev
	cd src && \
	gem install jekyll bundler && \
	bundle install
	@echo \* ...done

site:
	@echo \* Preparing awk-tutorial website files...
	cd src && \
	bundle exec jekyll build && \
	sed -i -E -e 's~/assets/~assets/~' -e '/.*atom\+xml.*/d' _site/index.html && \
	rm -f _site/feed.xml
	@echo \* ...done

scorm:
	@echo \* Creating SCORM ZIP file...
	rm -rf dist
	mkdir dist
	cp -r imsmanifest.xml materials dist
	sed -i "s/Last edit: .../Last edit: $(shell date '+%Y-%m-%d %H:%M')/" dist/imsmanifest.xml
	cp -r src/_site/* dist/materials
	cd dist && \
	zip "awk-tutorial-scorm-$(shell date '+%Y_%m_%d-%H_%M').zip" -r .
	@echo ------------------------------------------
	@echo \* SCORM ZIP file created:
	@ls ./dist/*.zip

clean:
	@echo \* Removing awk-tutorial website files and SCORM build directory...
	rm -rf dist
	@echo \*...done
