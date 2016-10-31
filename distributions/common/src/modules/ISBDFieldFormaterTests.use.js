use("Marc");
use("MarcClasses");
use("ISBDFieldFormater");
use("RecordUtil");
use("UnitTest");

UnitTest.addFixture("ISBDFieldFormater.formatField", function () {
    var field;
    var spec100;

    spec100 = {
        sepSpec: [
            {pattern: /ah/, midSep: ", "}
        ],
        valueSpec: {}
    };

    field = RecordUtil.createFromString("100 00 *a Troelsen").field(0);
    Assert.equalValue("100a", ISBDFieldFormater.formatField(field, spec100), "Troelsen");

    field = RecordUtil.createFromString("100 00 *h Jens").field(0);
    Assert.equalValue("100h", ISBDFieldFormater.formatField(field, spec100), "Jens");

    field = RecordUtil.createFromString("100 00 *a Troelsen *h Jens").field(0);
    Assert.equalValue("100ah", ISBDFieldFormater.formatField(field, spec100), "Troelsen, Jens");

    var spec110 = {
        sepSpec: [
            {pattern: /[sac][sac]$/, midSep: ". "},
            {pattern: /[ijk][ijk]$/, midSep: " : ", lastSep: ")"},
            {pattern: /[^ijk][ijk]$/, midSep: " (", lastSep: ")"},
            {pattern: /[ijk][^ijk]$/, midSep: ") "},
            {pattern: /^[ijk].*/, firstSep: "("},
            {pattern: /.e/, midSep: " "}
        ],
        valueSpec: {
            e: function (v) {
                return "(" + v + ")"
            }
        }
    };

    field = RecordUtil.createFromString("110 00 *i 4 *k 1986 *j Middelfart").field(0);
    Assert.equalValue("110ijk", ISBDFieldFormater.formatField(field, spec110), "(4 : 1986 : Middelfart)");

    field = RecordUtil.createFromString("110 00 *e h").field(0);
    Assert.equalValue("110e", ISBDFieldFormater.formatField(field, spec110), "(h)");

    field = RecordUtil.createFromString("110 00 *a a *e h").field(0);
    Assert.equalValue("110ae", ISBDFieldFormater.formatField(field, spec110), "a (h)");

    field = RecordUtil.createFromString("110 00 *s s *a a *c c *e h").field(0);
    Assert.equalValue("110sace", ISBDFieldFormater.formatField(field, spec110), "s. a. c (h)");

    field = RecordUtil.createFromString("110 00 *s s *a a *c c *e h *i 4 *k 1986 *j Middelfart").field(0);
    Assert.equalValue("110saceikj", ISBDFieldFormater.formatField(field, spec110), "s. a. c (h) (4 : 1986 : Middelfart)");
});
