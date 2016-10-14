use("ReadFile");
use("StringUtil");
use("UnitTest");

UnitTest.addFixture("TemplatesTest.testTemplates", function () {
    var installNames = JSON.parse(System.readFile("TemplatesTest.json"));
    for (var k = 0; k < installNames.length; k++) {
        var installName = installNames[k];
        GenericSettings.setSettings({
            'javascript.basedir': new Packages.java.io.File(".").getAbsolutePath() + "/../",
            'javascript.install.name': installName
        });
        TemplateContainer.setSettings(GenericSettings);

        var tempNames = TemplateContainer.getTemplateNames();
        for (var i = 0; i < tempNames.length; i++) {
            var templateName = StringUtil.sprintf("%s/%s", installName, tempNames[i].schemaName);
            print(StringUtil.sprintf("Testing template %s\n", templateName));

            try {
                TemplateContainer.get(tempNames[i].schemaName);
                Assert.equalValue(templateName, true, true);
            } catch (ex) {
                Assert.equalValue(templateName, ex, "");
            }
        }
    }
    TemplateContainer.setSettings(undefined);
});
