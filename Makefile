all: zip

zip:
	@zip -r archive.zip README.md background.js manifest.json options.html options.js warehouse-*.png
clean:
	@rm foo.zip

