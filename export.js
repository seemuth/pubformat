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

    var comment = '<!--' + pubdata['@'] + '-->';
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

    return comment + parts.join('. ');
}


// exportpost formats a publication list for posting to a content-management
// system (CMS)
function exportpost(publist)
{
    var ret = [];
    ret.push('<ul class="publications">');

    for (var i = 0; i < publist.length; i++) {
        ret.push('<li>' + pubtopost(publist[i]) + '</li>');
    }

    ret.push('</ul>');

    return ret.join('\n');
}
