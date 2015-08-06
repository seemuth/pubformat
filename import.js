// valuefilter filters publication values:
// strip { and } wrapper
// replace --- with &mdash;
// replace -- with &ndash;
function valuefilter(v)
{
    v = v.replace(/^{(.*)},?$/, '$1');

    var reps = [
        ['/\\%/g', '%'],
        [/\\&/g, '&amp;'],
        [/---/g, '&mdash;'],
        [/--/g, '&ndash;'],
        [/"/g, '&quot;'],
        [/“/g, '&ldquo;'],
        [/“/g, '&ldquo;'],
        [/‘/g, '&rsquo;'],
        [/’/g, '&rsquo;'],

        [/{?\\(["'`~^])\\*(({[^}]+})|[^{])}?/g,
            function(fullmatch, mark, sub) {
                var debug = false;
                var debug_prefix = '';
                var debug_suffix = '';

                if (debug) {
                    debug_prefix = '<span class="pub-special">_';
                    debug_suffix = '_</span>';
                }

                var nicesub = sub.replace(/^{(.*)},?$/, '$1');

                var marks = ['"', "'", '`', '~', '^'];
                var marknames = ['uml', 'acute', 'grave', 'tilde', 'circ'];
                var i = marks.indexOf(mark);
                if (i < 0) {
                    // Invalid mark!
                    return sub;
                }
                var markname = marknames[i];

                return [
                    debug_prefix,
                    '&',
                    nicesub,
                    markname,
                    ';',
                    debug_suffix,
                ].join('');
            }
        ],
    ];

    for (var i = 0; i < reps.length; i++) {
        var search = reps[i][0];
        var replace = reps[i][1];
        v = v.replace(search, replace);
    }

    return v;
}


// importbib extracts publication data from bib and returns an array of
// publication objects
function importbib(bib)
{
    var ret = [];
    var currentpub = {};
    var lines = bib.split('\n');

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        var eqpos = line.indexOf('=');

        if ((eqpos < 0) && (line.indexOf('}') >= 0)) {
            ret.push(currentpub);
            currentpub = {};

        } else if (eqpos > 0) {
            var k = line.substr(0, eqpos);
            var v = valuefilter(line.substr(eqpos+1));
            currentpub[k] = v;

        } else if (line.substr(0, 1) == '@') {
            var k = '@';
            var v = line.replace(/^@([^{]+){.*$/, '$1');
            currentpub[k] = v;
        }
    }

    return ret;
}


// pubsortcompare is used to sort publications by year, then title
function pubsortcompare(a, b)
{
    if (a.year == b.year) {

        if (a.title < b.title) {
            return -1;
        } else if (a.title == b.title) {
            // Should not happen! But return a sane value nonetheless.
            return 0;
        } else {
            return 1;
        }

    } else if (a.year == undefined) {
        return 1;

    } else if (b.year == undefined) {
        return -1;

    } else if (a.year > b.year) {
        return -1;

    } else {
        return 1;
    }
}
