// pubtopost formats a single publication
function pubtopost(pubdata)
{
    var parts = [];
    parts.push(pubdata.author);
    parts.push('<strong>' + pubdata.title + '</strong>');
    parts.push('<em>' + pubdata.booktitle + '</em>');
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
