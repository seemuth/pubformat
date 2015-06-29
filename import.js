// valuefilter filters publication values:
// replace --- with &mdash;
// replace -- with &ndash;
function valuefilter(v)
{
    var reps = [
        [/---/g, '&mdash;'],
        [/--/g, '&ndash;']
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
        }
    }

    return ret;
}


// pubsortcompare is used to sort publications by year, then title
function pubsortcompare(a, b)
{
    if (a.year > b.year) {
        return -1;
    } else if (a.year == b.year) {

        if (a.title < b.title) {
            return -1;
        } else if (a.title == b.title) {
            // Should not happen! But return a sane value nonetheless.
            return 0;
        } else {
            return 1;
        }

    } else {
        return 1;
    }
}
