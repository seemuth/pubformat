// splitauthors splits a list of author names into semicolon-delimited list
function splitauthors(authorstring)
{
    var authors = authorstring.split(' and ');
    return authors.join('; ');
}


// pubtopost formats a single publication
function pubtopost(pubdata)
{
    var parts = [];
    var collection = undefined;

    if ((collection == undefined) && (pubdata.booktitle != undefined)) {
        collection = pubdata.booktitle;

    } else if ((collection == undefined) && (pubdata.journal != undefined)) {
        collection = pubdata.journal;
    }

    var alldata = [];
    for (var k in pubdata) {
        alldata.push(k + ' = ' + pubdata[k]);
    }

    var comment = '<!--\n' + alldata.join('\n') + '\n-->';

    switch (config.citationFormat) {
        case 1:
            parts.push('<strong>' + pubdata.title + '</strong>');
            parts.push(splitauthors(pubdata.author));

            if (collection != undefined) {
                parts.push('<em>' + collection + '</em>');
            }

            if (pubdata.pages != undefined) {
                parts.push(pubdata.pages);
            }

            if (pubdata.year != undefined) {
                parts.push('(' + pubdata.year + ')');
            }

            if (pubdata.note != undefined) {
                parts.push('<span class="pub-note">' + pubdata.note + '</span>');
            }

            break;

        default:
            parts.push(splitauthors(pubdata.author));
            parts.push('<strong>' + pubdata.title + '</strong>');

            if (collection != undefined) {
                parts.push('<em>' + collection + '</em>');
            }

            if (pubdata.year != undefined) {
                parts.push('(' + pubdata.year + ')');
            }

            if (pubdata.note != undefined) {
                parts.push('<span class="pub-note">' + pubdata.note + '</span>');
            }
    }

    return comment + parts.join('. ');
}


// exportpost formats a publication list for posting to a content-management
// system (CMS)
function exportpost(publist)
{
    var owner = document.getElementById('owner').value.trim();
    var oldyear = parseInt(document.getElementById('oldyear').value.trim(), 10);

    if (oldyear > 0) {
        document.getElementById('oldyear').style.backgroundColor = '';
    } else {
        document.getElementById('oldyear').style.backgroundColor = '#ffcfcf';
    }

    var ret = [];

    ret.push('<ol class="publications">');

    for (var i = 0; i < publist.length; i++) {
        var pubclass = classify(publist[i], owner, oldyear);
        ret.push(
            '<li class="' +
            pubclass +
            '">' +
            pubtopost(publist[i]) +
            '</li>'
        );
    }

    ret.push('</ol>');

    return ret.join('\n');
}
