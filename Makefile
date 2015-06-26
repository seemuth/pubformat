MAINOUT = convertgs2wp.html
HTMLPREFILES = header.html
HTMLPOSTFILES = main.html footer.html
HTMLFILES = $(HTMLPREFILES) $(HTMLPOSTFILES)
JSFILES = extract.js export.js

MJSFILES = $(JSFILES:js=mjs)

MINIFY = yui-compressor

.PHONY: all
all: $(MAINOUT)

$(MAINOUT) : $(HTMLFILES) $(MJSFILES)
	cat $(HTMLPREFILES) > $(MAINOUT)
	cat $(MJSFILES) >> $(MAINOUT)
	cat $(HTMLPOSTFILES) >> $(MAINOUT)

%.mjs : %.js
	$(MINIFY) $< > $@

.PHONY: clean
clean:
	-rm -f $(MAINOUT) $(MJSFILES)
