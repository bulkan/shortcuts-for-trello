NOW := $(shell date +"%c" | tr ' :' '__')

release:
	zip -x *.git* Makefile "*.DS_Store" screenshots/* README.md -r release_$(NOW).zip .

clean:
	rm *.zip

.PHONY: clean
