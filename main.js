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


function datainchange(inbox)
{
    var outbox = document.getElementById('dataout');
    var publications = importbib(inbox.value);

    outbox.value = '';

    publications.sort(pubsortcompare);

    outbox.value = exportpost(publications);

    if (outbox.value.length > 0) {
        setstatus('Generated post content.');
    } else {
        setstatus('Error generating post content!');
    }
}
