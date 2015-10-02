var statusstate = 0;
var statusinterval = null;

// updatestatus updates the status output's appearance
function updatestatusdisplay()
{
    var st = document.getElementById('status');
    statusstate--;
    if (statusstate < 0) {
        st.innerHTML = '';
        window.clearInterval(statusinterval);
        statusinterval = null;
        return;
    }

    if (statusstate >= 25) {
        // Fade background from bright green to white.
        var r = 255 - (10 * (statusstate - 25));
        if (r > 255) {
            r = 255;
        } else if (r < 0) {
            r = 0;
        }

        st.style['background-color'] = (
            'rgb(' +
            r.toString() +
            ',255,' +
            r.toString() +
            ')'
        );

    } else {
        // Fade foreground from black to white.
        var r = 255 - (10 * statusstate);
        if (r < 0) {
            r = 0;
        }
        st.style['color'] = (
            'rgb(' +
            r.toString() +
            ',' +
            r.toString() +
            ',' +
            r.toString() +
            ')'
        );
    }
}


// setstatus sets the status output and makes it visible
function setstatus(message)
{
    var st = document.getElementById('status');
    st.innerHTML = message;
    st.style['color'] = 'rgb(0,0,0)';
    st.style['background-color'] = 'rgb(0,255,0)';

    statusstate = 50;
    if (statusinterval == null) {
        statusinterval = window.setInterval(updatestatusdisplay, 100);
    }
}


// updateconfig updates the configuration settings from the parameter inputs
function updateconfig()
{
    for (var k in config.filters) {
        var el = document.getElementById('filter_' + k);
        if (el == null) {
            continue;
        }

        if (el.checked) {
            config.filters[k] = true;
        } else {
            config.filters[k] = false;
        }
    }
}


function datainchange(inbox)
{
    updateconfig();

    var owner = document.getElementById('owner').value.trim();
    var oldyear = parseInt(document.getElementById('oldyear').value.trim(), 10);

    if (oldyear > 0) {
        document.getElementById('oldyear').style.backgroundColor = '';
    } else {
        document.getElementById('oldyear').style.backgroundColor = '#ffcfcf';
    }

    var pubtypes = {
            abstracts: [],
            conference: [
                'inproceedings',
            ],
            journal: [
                'article',
                'incollection',
            ],
            patents: [
                'misc',
            ],
            other: [],
    };

    if (! config.splitConferenceJournal) {
        pubtypes.papers = [];

        for (var i = 0; i < pubtypes.conference.length; i++) {
            pubtypes.papers.push(pubtypes.conference[i]);
        }
        for (var i = 0; i < pubtypes.journal.length; i++) {
            pubtypes.papers.push(pubtypes.journal[i]);
        }

        delete pubtypes.conference;
        delete pubtypes.journal;
    }

    var output = document.getElementById('output');
    var publications = importbib(inbox.value);
    var pubgroups = {};

    for (var k in pubtypes) {
        pubgroups[k] = [];
    }

    output.innerHTML = '';

    publications.sort(pubsortcompare);

    for (var i in publications) {
        var pub = publications[i];
        var filterret = filterpub(pub, owner, oldyear);
        var show = false;

        if (config.showAll) {
            show = true;
        } else {
            if ((filterret.pos.length > 0) && (filterret.neg.length == 0)) {
                show = true;
            }
        }

        var ingroup = 'other';
        for (var k in pubtypes) {
            if (pubtypes[k].indexOf(pub['@']) >= 0) {
                ingroup = k;
                break;
            }
        }

        if (pubisabstract(pub)) {
            ingroup = 'abstracts';
        }

        if (show) {
            pubgroups[ingroup].push(pub);
        }
    }

    var sections = [];

    if ((pubgroups.conference != undefined) && (pubgroups.conference.length > 0)) {
        sections.push('<h2>Conference Papers</h2>');
        sections.push(exportpost(pubgroups.conference, owner, oldyear));
    }
    if ((pubgroups.journal != undefined) && (pubgroups.journal.length > 0)) {
        sections.push('<h2>Journal Articles</h2>');
        sections.push(exportpost(pubgroups.journal, owner, oldyear));
    }
    if ((pubgroups.papers != undefined) && (pubgroups.papers.length > 0)) {
        sections.push('<h2>Papers</h2>');
        sections.push(exportpost(pubgroups.papers, owner, oldyear));
    }
    if ((pubgroups.abstracts != undefined) && (pubgroups.abstracts.length > 0)) {
        sections.push('<h2>Abstracts</h2>');
        sections.push(exportpost(pubgroups.abstracts, owner, oldyear));
    }
    if ((pubgroups.patents != undefined) && (pubgroups.patents.length > 0)) {
        sections.push('<h2>Patents</h2>');
        sections.push(exportpost(pubgroups.patents, owner, oldyear));
    }
    if ((pubgroups.other != undefined) && (pubgroups.other.length > 0)) {
        sections.push('<h2>Other</h2>');
        sections.push(exportpost(pubgroups.other, owner, oldyear));
    }

    output.innerHTML = sections.join('\n');

    if (output.innerHTML.length > 0) {
        setstatus('Generated post content.');
    } else {
        setstatus('Error generating post content!');
    }
}
