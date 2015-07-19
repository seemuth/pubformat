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
    var collection = null;

    if ((collection == null) && (pubdata.booktitle != undefined)) {
        collection = pubdata.booktitle;

    } else if ((collection == null) && (pubdata.journal != undefined)) {
        collection = pubdata.journal;
    }

    parts.push(splitauthors(pubdata.author));
    parts.push('<strong>' + pubdata.title + '</strong>');
    parts.push('<em>' + collection + '</em>');
    parts.push('(' + pubdata.year + ')');

    return parts.join('. ');
}


// exportpost formats a publication list for posting to a content-management
// system (CMS)
function exportpost(publist)
{
    var ret = [];
    ret.push('<ul>');

    for (var i = 0; i < publist.length; i++) {
        ret.push('<li>' + pubtopost(publist[i]) + '</li>');
    }

    ret.push('</ul>');

    return ret.join('\n');
}
