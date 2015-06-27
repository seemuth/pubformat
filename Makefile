MAINOUT = convertgs2wp.html
HTMLPREFILES = header.html main.html
HTMLPOSTFILES = footer.html
HTMLFILES = $(HTMLPREFILES) $(HTMLPOSTFILES)
JSFILES = import.js export.js

MJSFILES = $(JSFILES:js=mjs)

MINIFY = yui-compressor

.PHONY: all
all: $(MAINOUT)

$(MAINOUT) : $(HTMLFILES) $(MJSFILES)
	cat $(HTMLPREFILES) $(MJSFILES) $(HTMLPOSTFILES) > $(MAINOUT)

%.mjs : %.js
	$(MINIFY) $< > $@

.PHONY: clean
clean:
	-rm -f $(MAINOUT) $(MJSFILES)

.PHONY: dev
dev: all
	cp $(MAINOUT) /tmp/
