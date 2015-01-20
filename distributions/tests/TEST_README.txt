Test of validering af Javascript/JSON kode.

Alle tests forudsætter man er placeret i følgende folder:
/iscrum-commons/iscrum-javascript/src/main/resources/javascript/iscrum/templates
samt at der er virkende python og dbc-jsshell installation .

### For at validere JSON skabeloner.
Før kommandoen:
./validate_json.sh

En validering uden fejl kan se sådan her ud:
-----
thl@guesstimate:~/iscrum-commons/iscrum-javascript/src/main/resources/javascript/iscrum/templates$ ./validate_json.sh
Tester fil <bogbind.json>
JSON filen <bogbind.json> validerer ok

Tester fil <boghoved.json>
JSON filen <boghoved.json> validerer ok

Tester fil <bog.json>
JSON filen <bog.json> validerer ok

Tester fil <DanMarc2.json>
JSON filen <DanMarc2.json> validerer ok

Tester fil <Lister.json>
JSON filen <Lister.json> validerer ok

Tester fil <stine.json>
JSON filen <stine.json> validerer ok

thl@guesstimate:~/iscrum-commons/iscrum-javascript/src/main/resources/javascript/iscrum/templates$
-----

En kørsel med fejl kan f.eks. se sådan her ud:
-----
thl@guesstimate:~/iscrum-commons/iscrum-javascript/src/main/resources/javascript/iscrum/templates$ ./validate_json.sh
Tester fil <bogbind.json>
JSON filen <bogbind.json> validerer ok

Tester fil <boghoved.json>
JSON filen <boghoved.json> validerer ok

Tester fil <bog.json>
Expecting , delimiter: line 42 column 17 (char 1279)
JSON filen <bog.json> validerer ikke ok

Tester fil <DanMarc2.json>
JSON filen <DanMarc2.json> validerer ok

Tester fil <Lister.json>
JSON filen <Lister.json> validerer ok

Tester fil <stine.json>
JSON filen <stine.json> validerer ok

thl@guesstimate:~/iscrum-commons/iscrum-javascript/src/main/resources/javascript/iscrum/templates$
-----
Denne fejl betyder er der ikke blev fundet et komma i linie 41.


### Load af skabeloner gennem DBC-JSSHELL miljø
OBS! Denne test opdateres IKKE automatisk når der kommer nye skabeloner.
For at tilføje nye skabeloner til denne test:
Åbn filen TemplateTest.js
Tilføj de nye skabeloner i linien der starter med "var templates = [" (pt. linie 12).
Hvis der f.eks. er tilføjet en ny skabelon med navnet film, skal linien:
var templates = ['bog', 'bogbind', 'boghoved'];
rettes til:
var templates = ['bog', 'bogbind', 'boghoved', 'film'];

Kør kommandoen:
./test_templates.sh

En kørsel uden fejl kan f.eks. se sådan her ud:
-----
thl@guesstimate:~/iscrum-commons/iscrum-javascript/src/main/resources/javascript/iscrum/templates$ ./test_templates.sh
=======================================================================
Totals for all 1 fixtures in test
Result : 1 / 1 passed (100 %).
=======================================================================
All tests passed

thl@guesstimate:~/iscrum-commons/iscrum-javascript/src/main/resources/javascript/iscrum/templates$
-----

En kørsel med fejl (samme fejl som også er demonstreret ovenfor):
-----
thl@guesstimate:~/iscrum-commons/iscrum-javascript/src/main/resources/javascript/iscrum/templates$ ./test_templates.sh
=============================== DETAILS ===============================
>>>>>>>>>>>>>> Test TemplateTest.testTemplates
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> equal <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
Test number : 0
Description : Fixture does not leak exceptions
Evaluated   : UNAVAILABLE (not a string)
Time        : 0.023
Expected    : (new String("No exceptions")) (string)
Actual      : (new String("Received exception: (new SyntaxError(\"Missing comma in object literal\", \"TemplateContainer.use.js\", 128))")) (string)
Stacktrace  :   at TemplateContainer.use.js:128 (__testLoadOptimizedTemplateDoNotUse)
        at TemplateLoader.use.js:28 (load)
        at TemplateContainer.use.js:121 (testLoadOfTemplateDoNotUse)
        at TemplateTest.js:19 (testTemplates)
        at TemplateTest.js:33 (anonymous)
        at UnitTest.use.js:739 (anonymous)
        at TemplateTest.js:32
String diff : Expected and actual differs at position 13:
Expected: (new String("No exceptions"))
Actual  : (new String("Received exception: (new SyntaxError(\"Missing comma in object lite...
                       ^
Result      : FAILED
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

-----------------------------------------------------------------------
Fixture: Test TemplateTest.testTemplates
Result : 0 / 1 passed (0 %).
Failed#: 0
=======================================================================
Totals for all 1 fixtures in test
Result : 0 / 1 passed (0 %).
=======================================================================
!!!!!!!!!! FAILURES WERE PRESENT !!!!!!!!!!

thl@guesstimate:~/iscrum-commons/iscrum-javascript/src/main/resources/javascript/iscrum/templates$
-----

En fuld log over kørslen kan findes i filen jstest.log.
