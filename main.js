function datainchange(inbox)
{
    var outbox = document.getElementById('dataout');
    var publications = importbib(inbox.value);

    outbox.value = '';

    for (var i = 0; i < publications.length; i++) {
        var pub = publications[i];
        var parts = [];
        for (var k in pub) {
            parts.push(k + '=' + pub[k]);
        }

        outbox.value += parts.join(' ') + '\n\n';
    }

    outbox.value = outbox.value.trim();
}
