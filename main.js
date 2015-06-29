function datainchange(inbox)
{
    var outbox = document.getElementById('dataout');
    var publications = importbib(inbox.value);

    publications.sort(pubsortcompare);

    outbox.value = exportpost(publications);
}
