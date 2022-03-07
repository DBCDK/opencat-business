use("Marc");
use("MarcClasses");
use("RecategorizationNoteFieldFactory");
use("RecordUtil");
use("ResourceBundle");
use("ResourceBundleFactory");
use("UnitTest");
use("UpdateConstants");

UnitTest.addFixture("RecategorizationNoteFieldFactory.newNoteField", function () {

    function callFunction(currentRecord, updatingRecord) {
        return RecategorizationNoteFieldFactory.newNoteField(currentRecord, updatingRecord);
    }

    function createNote(parts) {
        var result;

        result = new Field(RecategorizationNoteFieldFactory.__FIELD_NAME, "00");

        if (parts.recategorization !== undefined) {
            result.append("i", parts.recategorization.trim());
        }
        if (parts.creator !== undefined) {
            result.append("d", parts.creator.trim());
        }
        if (parts.title !== undefined) {
            result.append("t", parts.title.trim());
        }
        if (parts.category !== undefined) {
            result.append("b", parts.category.trim());
        }

        return result;

    }

    function formatMaterialMessage(bundle, code) {
        return ResourceBundle.getStringFormat(bundle, "note.material", ResourceBundle.getString(bundle, code));
    }

    //-----------------------------------------------------------------------------
    //                  Variables
    //-----------------------------------------------------------------------------

    var bundle = ResourceBundleFactory.getBundle(RecategorizationNoteFieldFactory.__BUNDLE_NAME);

    var record;
    var parts;
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test basic cases
    //-----------------------------------------------------------------------------

    Assert.equalValue("Empty records", callFunction(new Record, new Record), undefined);

    //-----------------------------------------------------------------------------
    //                  Test 038 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "038 00 *a dr"
    );

    parts = {recategorization: formatMaterialMessage(bundle, "code.038a.dr")};
    Assert.equalValue("038a found", callFunction(record, record).toString(), createNote(parts).toString());


    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "038 00 *a dr"
    );

    var field = new Field("512", "00");
    field.append("i", "Materialet er opstillet under dramatik");
    Assert.equalValue("test of calling function with identic records", callFunction(record, record).toString(), field.toString());


    //-----------------------------------------------------------------------------
    //                  Test 039 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "039 00 *a fol"
    );

    parts = {recategorization: formatMaterialMessage(bundle, "code.039a.fol")};
    Assert.equalValue("039a found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "039 00 *b dk"
    );

    parts = {recategorization: formatMaterialMessage(bundle, "code.039b.dk")};
    Assert.equalValue("039b found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "039 00 *a fol *b dk"
    );

    parts = {recategorization: formatMaterialMessage(bundle, "code.039a.fol")};

    var country = ResourceBundle.getString(bundle, "code.039b.dk");
    parts.recategorization += ". " + RecategorizationNoteFieldFactory.__PrettyCase(country);

    Assert.equalValue("039a/b found", callFunction(record, record).toString(), createNote(parts).toString());

    //-----------------------------------------------------------------------------
    //                  Test 100 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "100 00 *a Troelsen *h Jens"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        creator: "Troelsen, Jens"
    };
    Assert.equalValue("100ah found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "100 00 *a Margrethe *E 2 *e II *f dronning af Danmark"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        creator: "Margrethe II (dronning af Danmark)"
    };
    Assert.equalValue("100aef found", callFunction(record, record).toString(), createNote(parts).toString());

    //-----------------------------------------------------------------------------
    //                  Test 110 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "110 00 *a NOAH *e musikgruppe"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        creator: "NOAH (musikgruppe)"
    };
    Assert.equalValue("110ae found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "110 00 *a Koebenhavns Universitet *c Romansk Institut"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        creator: "Koebenhavns Universitet. Romansk Institut"
    };
    Assert.equalValue("110ac found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "110 00 *a Nordic Prosody *i 4 *k 1986 *j Middelfart"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        creator: "Nordic Prosody (4 : 1986 : Middelfart)"
    };
    Assert.equalValue("110ac found", callFunction(record, record).toString(), createNote(parts).toString());

    //-----------------------------------------------------------------------------
    //                  Test 239 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "239 00 *a Troelsen *h Jens"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        creator: "Troelsen, Jens"
    };
    Assert.equalValue("239ah found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "239 00 *a Margrethe *E 2 *e II *f dronning af Danmark"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        creator: "Margrethe II (dronning af Danmark)"
    };
    Assert.equalValue("239aef found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "239 00 *t Kvartet for 2 violiner, viola og violoncel nr. 3 *u Grido *ø Arditti-Kvartetten, London"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        title: "Kvartet for 2 violiner, viola og violoncel nr. 3 (Arditti-Kvartetten, London)"
    };
    Assert.equalValue("239tø found", callFunction(record, record).toString(), createNote(parts).toString());

    //-----------------------------------------------------------------------------
    //                  Test 245 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "245 00 *a Skatteret *n Speciel del"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        title: "Skatteret. Speciel del"
    };
    Assert.equalValue("Single: 245an found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "245 00 *a Skat *o Erhverv"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        title: "Skat. Erhverv"
    };
    Assert.equalValue("Single: 245ao found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "245 00 *a Lego dimensions *e produced by TT Games *ø Xbox One"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        title: "Lego dimensions (Xbox One)"
    };
    Assert.equalValue("Single: 245aeø found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "245 00 *a Verden handler - etisk og fair? *y Lærervejledning"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        title: "Verden handler - etisk og fair? -- Lærervejledning"
    };
    Assert.equalValue("Single: 245ay found", callFunction(record, record).toString(), createNote(parts).toString());

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 3 234 567 8 *b 191919\n" +
            "004 00 *r n *a h\n" +
            "245 00 *a Danmarks kirker"
        )
    );
    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919\n" +
            "004 00 *r n *a s\n" +
            "014 00 *a 3 234 567 8\n" +
            "245 00 *n [Bind] 18 *a Ringkøbing Amt *f mit deutschen Resümees"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "014 00 *a 2 234 567 8\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        title: "Danmarks kirker. [Bind] 18 : Ringkøbing Amt. 5. bind, hft. 30 : Brændekilde, Bellinge, Stenløse, Fangel"
    };
    Assert.equalValue("652mb found", callFunction(record, record).toString(), createNote(parts).toString());

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 3 234 567 8 *b 191919\n" +
            "004 00 *r n *a h\n" +
            "245 00 *a Technical report *æ Datalogisk Institut, DIKU"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "014 00 *a 2 234 567 8\n" +
        "245 00 *G nr. 2012 3 *g No. 2012/03 *a Design of reversible logic circuits using standard cells *c standard cells and functional programming"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        title: "Technical report (Datalogisk Institut, DIKU) [Bind] 18 : Ringkøbing Amt. No. 2012/03 : Design of reversible logic circuits using standard cells "
    };
    Assert.equalValue("Bug 20440 - Update: Mindre korrektion af tegnsæt i 512-note", callFunction(record, record).toString(), createNote(parts).toString());

    //-----------------------------------------------------------------------------
    //                  Test 009/652 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "652 00 *m 47.44 *b Barcelona"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        category: ResourceBundle.getStringFormat(bundle, "note.category.dk5", "47.44 Barcelona") + " " +
        ResourceBundle.getString(bundle, "note.category.reason.general")
    };
    Assert.equalValue("652mb found", callFunction(record, record).toString(), createNote(parts).toString());

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "652 00 *n 86 *z 06\n" +
        "652 00 *o sk\n"
    );

    parts = {
        recategorization: formatMaterialMessage(bundle, ""),
        category: ResourceBundle.getStringFormat(bundle, "note.category.dk5", "86-06; sk") + " " +
        ResourceBundle.getString(bundle, "note.category.reason.general")
    };
    Assert.equalValue("Two 652(nzo) found", callFunction(record, record).toString(), createNote(parts).toString());

    //-----------------------------------------------------------------------------
    //                  Test complete cases
    //-----------------------------------------------------------------------------

    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord(
        RecordUtil.createFromString([
            "001 00 *a 51591038 *b 191919 *c 20150220131914 *d 20150213 *f a",
            "004 00 *r n *a h",
            "008 00 *u f *a 2014 *b dk *d m *d y *l eng *x 05 *v 0",
            "009 00 *a a *g xx",
            "021 00 *c Hf.",
            "100 00 *a Hamid *h Salmiah Abdul *4 aut",
            "900 00 *a Abdul Hamid *h Salmiah *z 100",
            "245 00 *a Road signs - geosemiotics and human mobility *c dissertation",
            "260 00 *& 1 *a Ꜳlborg *b Ꜳlborg Universitetsforlag *c 2014",
            "300 00 *a 2 bind *b ill. (nogle i farver)",
            "440 00 *a PhD series *æ Faculty of Engineering and Science, Ꜳlborg University *z 2246-1248",
            "532 00 *& 1 *a Med litteraturhenvisninger og links",
            "652 00 *m 65.821",
            "710 00 *a Ꜳlborg Universitet *c Det ¤Teknisk-Naturvidenskabelige Fakultet",
            "840 00 *a Ph.d.-serien for Det Teknisk-Naturvidenskabelige Fakultet, Ꜳlborg Universitet",
            "910 00 *a Det ¤Teknisk-Naturvidenskabelige Fakultet, Ꜳlborg Universitet *z 710",
            "910 00 *a Ꜳlborg University *c Faculty of Engineering and Science *z 710",
            "910 00 *a Faculty of Engineering and Science, Ꜳlborg University *z 710",
            "996 00 *a DBC"
        ].join("\n"))
    );

    var currentRecord = RecordUtil.createFromString([
            "001 00 *a 22413090 *b 191919 *c 19990510220316 *d 19990407 *f a",
            "004 00 *r n *a b",
            "008 00 *t m *u u *a 1999 *b dk *j f *l dan *v 0",
            "014 00 *a 51591038",
            "021 00 *a 87-7714-324-8 *c hf. *d kr. 78,00",
            "032 00 *a DBF199917 *x SFD199917 *x BKR201606",
            "041 00 *a dan *c eng",
            "245 00 *a Omkatalogiseret fra enkeltstående",
            "250 00 *a 3. danske udgave *b 3. udgave",
            "260 00 *c 1999 *k Nørhaven, Viborg",
            "300 00 *a 189 sider",
            "990 00 *a SFD *c A *o 199917",
            "996 00 *a DBC"
        ].join("\n")
    );
    RawRepoClientCore.addRecord(currentRecord);

    record = RecordUtil.createFromString([
            "001 00 *a 22413090 *b 191919 *c 19990510220316 *d 19990407 *f a",
            "004 00 *r n *a e",
            "008 00 *t m *u u *a 1999 *b dk *j f *l dan *v 0",
            "009 00 *a a *g xx",
            "021 00 *a 87-7714-324-8 *c hf. *d kr. 78,00",
            "032 00 *a DBF199917 *x SFD199917",
            "041 00 *a dan *c eng",
            "100 00 *a Pilcher *h Rosamunde",
            "241 00 *a Sleeping tiger",
            "245 00 *a Kærlighed i blåt *e Rosamunde Pilcher *f oversat fra engelsk af Ursula Baum Hansen",
            "250 00 *a 3. danske udgave *b 3. udgave",
            "260 00 *& 1 *a Kbh. *b Cicero *c 1999 *k Nørhaven, Viborg",
            "300 00 *a 189 sider",
            "504 00 *& 1 *a Kort før sit bryllup med den rædsomt kedelige advokat Rodney Ackland rejser Selina til Ibiza, hvor hun tror at kunne finde sin far, som hun aldrig har kendt",
            "520 00 *& 1 *a Originaludgave: 1967",
            "520 00 *a Tidligere: 1. bogklubudgave i.e. 2. udgave. Kbh. : Bogklubben 12 Bøger, 1998. - 1. udgave. 1998",
            "652 00 *m 35.1",
            "666 00*s kærlighed",
            "666 00*s England",
            "666 00*s Ibiza",
            "666 00*s 1960-1969",
            "666 00*s Spanien",
            "990 00 *a SFD *c A *o 199917",
            "996 00 *a DBC"
        ].join("\n")
    );

    parts = {
        recategorization: "Materialet er opstillet under",
        creator: "Hamid, Salmiah Abdul",
        title: "Road signs - geosemiotics and human mobility. Omkatalogiseret fra enkeltstående",
        category: "# (DK5 65.821), materialekoder [a (xx)]. Postens opstilling ændret på grund af omkatalogisering fra flerbindsværk"
    };
    Assert.equalValue("volume-to-single", callFunction(currentRecord, record).toString(), createNote(parts).toString());

    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord(
        RecordUtil.createFromString([
            "001 00 *a 51591038 *b 191919 *c 20150220131914 *d 20150213 *f a",
            "004 00 *r n *a e",
            "008 00 *t p *u f *a 2014 *b dk *d m *d y *l eng *x 05 *v 0",
            "009 00 *a a *g xx",
            "021 00 *c Hf.",
            "100 00 *a Hamid *h Salmiah Abdul *4 aut",
            "900 00 *a Abdul Hamid *h Salmiah *z 100",
            "245 00 *a Road signs - geosemiotics and human mobility *c dissertation",
            "260 00 *& 1 *a Ꜳlborg *b Ꜳlborg Universitetsforlag *c 2014",
            "300 00 *a 2 bind *b ill. (nogle i farver)",
            "440 00 *a PhD series *æ Faculty of Engineering and Science, Ꜳlborg University *z 2246-1248",
            "532 00 *& 1 *a Med litteraturhenvisninger og links",
            "652 00 *m 65.821",
            "710 00 *a Ꜳlborg Universitet *c Det ¤Teknisk-Naturvidenskabelige Fakultet",
            "840 00 *a Ph.d.-serien for Det Teknisk-Naturvidenskabelige Fakultet, Ꜳlborg Universitet",
            "910 00 *a Det ¤Teknisk-Naturvidenskabelige Fakultet, Ꜳlborg Universitet *z 710",
            "910 00 *a Ꜳlborg University *c Faculty of Engineering and Science *z 710",
            "910 00 *a Faculty of Engineering and Science, Ꜳlborg University *z 710",
            "996 00 *a DBC"
        ].join("\n"))
    );

    currentRecord = RecordUtil.createFromString([
            "001 00 *a 22413090 *b 191919 *c 19990510220316 *d 19990407 *f a",
            "004 00 *r n *a e",
            "008 00 *t p *u u *a 1999 *b dk *j f *l dan *v 0",
            "014 00 *a 51591038",
            "021 00 *a 87-7714-324-8 *c hf. *d kr. 78,00",
            "032 00 *a DBF199917 *x SFD199917 *x BKR201606",
            "041 00 *a dan *c eng",
            "245 00 *a Omkatalogiseret fra enkeltstående",
            "250 00 *a 3. danske udgave *b 3. udgave",
            "260 00 *c 1999 *k Nørhaven, Viborg",
            "300 00 *a 189 sider",
            "990 00 *a SFD *c A *o 199917",
            "996 00 *a DBC"
        ].join("\n")
    );
    RawRepoClientCore.addRecord(currentRecord);

    record = RecordUtil.createFromString([
            "001 00 *a 22413090 *b 191919 *c 19990510220316 *d 19990407 *f a",
            "004 00 *r n *a b",
            "008 00 *t s *u u *a 1999 *b dk *j f *l dan *v 0",
            "009 00 *a a *g xx",
            "021 00 *a 87-7714-324-8 *c hf. *d kr. 78,00",
            "032 00 *a DBF199917 *x SFD199917",
            "041 00 *a dan *c eng",
            "100 00 *a Pilcher *h Rosamunde",
            "241 00 *a Sleeping tiger",
            "245 00 *a Kærlighed i blåt *e Rosamunde Pilcher *f oversat fra engelsk af Ursula Baum Hansen",
            "250 00 *a 3. danske udgave *b 3. udgave",
            "260 00 *& 1 *a Kbh. *b Cicero *c 1999 *k Nørhaven, Viborg",
            "300 00 *a 189 sider",
            "504 00 *& 1 *a Kort før sit bryllup med den rædsomt kedelige advokat Rodney Ackland rejser Selina til Ibiza, hvor hun tror at kunne finde sin far, som hun aldrig har kendt",
            "520 00 *& 1 *a Originaludgave: 1967",
            "520 00 *a Tidligere: 1. bogklubudgave i.e. 2. udgave. Kbh. : Bogklubben 12 Bøger, 1998. - 1. udgave. 1998",
            "652 00 *m 35.1",
            "666 00*s kærlighed",
            "666 00*s England",
            "666 00*s Ibiza",
            "666 00*s 1960-1969",
            "666 00*s Spanien",
            "990 00 *a SFD *c A *o 199917",
            "996 00 *a DBC"
        ].join("\n")
    );

    parts = {
        recategorization: "Materialet er opstillet under",
        creator: "Hamid, Salmiah Abdul",
        title: "Road signs - geosemiotics and human mobility. Omkatalogiseret fra enkeltstående",
        category: "# (DK5 65.821), materialekoder [a (xx)]. Postens opstilling ændret på grund af omkatalogisering fra periodica til flerbindsværk "
    };

    Assert.equalValue("volume-to-single", callFunction(currentRecord, record).toString(), createNote(parts).toString());

    RawRepoClientCore.clear();
});
