use("Solr");
use("ConfigSettings");

UnitTest.addFixture("Solr.numFound", function () {
    return;

    var url = "http://localhost:12100/solr/raw-repo-index";

    Assert.equal("001a", Solr.numFound(url, "marc.001a:*"), 45);
    Assert.equal("002a hits", Solr.numFound(url, "marc.002a:06605141"), 1);
    Assert.equal("002a no hits", Solr.numFound(url, "marc.002a:76605141"), 0);
    Assert.equal("022a hits", Solr.numFound(url, "marc.022a:0900-9310"), 1);
    Assert.equal("022a no hits", Solr.numFound(url, "marc.022a:0900-93xx"), 0);
    Assert.equal("021a analyse", Solr.analyse(url, "3-7957-5002-4", "match.021a"), "3795750024");
    Assert.equal("245a analyse", Solr.analyse(url, "Europäische Klavierschule", "match.245a"), "oeuropæischeklavierschule");

    Assert.exception("Solr url not found", 'Solr.numFound( "http://localhost:12100/not/found", "marc.001a:*" )');
});
