// classify determines the appearance class for the given publication
function classify(pub, owner, oldyear)
{
    var filterret = filterpub(pub, owner, oldyear);
    var ret = [];

    if ((filterret.pos.length > 0) && (filterret.neg.length > 0)) {
        ret.push('conflict');

    } else if (filterret.pos.length > 0) {
        ret.push('good');

    } else if (filterret.neg.length > 0) {
        ret.push('bad');

    } else {
        ret.push('unknown');
    }

    for (var i = 0; i < filterret.pos.length; i++) {
        ret.push('good_' + filterret.pos[i]);
    }
    for (var i = 0; i < filterret.neg.length; i++) {
        ret.push('bad_' + filterret.neg[i]);
    }
    for (var i = 0; i < filterret.zero.length; i++) {
        ret.push('zero_' + filterret.zero[i]);
    }

    return ret.join(' ');
}


// filterpub attempts to dermine whether or not the given publication should
// actually be included in the list of publications
// owner is the last name of the publication list's owner
function filterpub(pub, owner, oldyear)
{
    var retpos = [];
    var retzero = [];
    var retneg = [];

    var filters = {
        ownername: filter_ownername,
        noyear: filter_noyear,
        oldyear: filter_oldyear,
        thesis: filter_thesis,
        erratum: filter_erratum,
    };

    for (var filtername in filters) {
        var filterfunc = filters[filtername];
        var filterret = filterfunc(pub, owner, oldyear);

        if (filterret > 0) {
            retpos.push(filtername);

        } else if (filterret == 0) {
            retzero.push(filtername);

        } else {
            retneg.push(filtername);
        }
    }

    var ret = {
        pos: retpos,
        zero: retzero,
        neg: retneg,
    };

    return ret;
}


// filter_ownername determines if the owner is listed in the author list
function filter_ownername(pub, owner)
{
    var ret = -1;
    var authors = pub.author.split(' and ');

    owner = owner.toLowerCase();

    for (var i = 0; i < authors.length; i++) {
        var author = authors[i].toLowerCase();
        if (author.substr(0, owner.length) == owner) {
            ret = 1;
            break;
        }
    }

    return ret;
}


// filter_noyear determines if a year is present in the publication data
function filter_noyear(pub)
{
    if (pub.year == undefined) {
        return -1;
    }

    return 0;
}


// filter_thesis determines if the publication is a thesis
function filter_thesis(pub)
{
    var pubtype = pub['@'].toLowerCase();
    if (pubtype.substr(pubtype.length-6) == 'thesis') {
        return -1;
    }

    return 0;
}


// filter_erratum determines if the publication is an erratum
function filter_erratum(pub)
{
    var search = 'erratum:';

    if (pub.title.toLowerCase().substr(0, search.length) == search) {
        return -1;
    }

    return 0;
}


// filter_oldyear determines if a publication is too old
function filter_oldyear(pub, owner, oldyear)
{
    if (pub.year == undefined) {
        return 0;
    }

    if (pub.year < oldyear) {
        return -1;
    }

    return 0;
}
