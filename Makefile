MAINOUT := pubformat.html
HTMLPREFILES := header.html license.html main.html prescript.html
HTMLPOSTFILES := postscript.html version.html footer.html
HTMLFILES := $(HTMLPREFILES) $(HTMLPOSTFILES)
JSFILES := config.js import.js export.js filter.js main.js

MJSFILES := $(JSFILES:js=mjs)
INPUTFILES := $(HTMLFILES) $(MJSFILES)

MINIFY := yui-compressor

.PHONY: all
all: $(MAINOUT)

$(MAINOUT) : $(INPUTFILES)
	cat $(HTMLPREFILES) $(MJSFILES) $(HTMLPOSTFILES) > $(MAINOUT)

%.mjs : %.js
	$(MINIFY) $< > $@

license.html: LICENSE
	echo '<!--' > $@
	cat $< >> $@
	echo '-->' >> $@

.PHONY: clean
clean:
	-rm -f $(MAINOUT) $(MJSFILES)

.PHONY: dev
dev: all
	cp $(MAINOUT) /tmp/
