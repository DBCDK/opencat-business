use( "Print" );
use( "System" );
use( "UnitTest" );
use( "WriteFile" );

UnitTest.doTests = function() {
    return true;
};

// Include build modules
use( "Builder" );

// Include update modules
use( "AuthenticatorEntryPointTests" );
use( "BasisSplitterTests" );
use( "AuthenticatorTests" );
use( "NoteAndSubjectExtentionsHandlerTests" );
use( "RecordSorterTests" );

// Include common modules
use( "DanMarc2ConverterTest" );
use( "RawRepoClientTest" );
use( "SolrTest" );

// Include common unittest modules
use( "GenericSettingsTest" );
use( "RawRepoClientCoreTest" );
use( "SubfieldRulesTest" );
use( "ValidatorTest" );

// Include template modules
use( "TemplateLoader" );
use( "TemplateOptimizer" );
use( "TemplateUrl" );

// Include validation modules
use( "FieldRules" );
use( "MandatorySubfieldInVolumeWorkRuleTest" );
use( "RecordRules" );
use( "RecordRulesConflictingSubfieldsTest" );
use( "SubfieldMandatoryIfSubfieldNotPresentRuleTest" );
use( "SubfieldRules" );
use( "ValidateErrors" );
use( "Validator" );

use( "TemplatesTest" );

function main() {
    var curDir = new Packages.java.io.File( "." );
    print( "Current directory: ", curDir.getAbsolutePath(), "\n" );

    UnitTest.outputXml = true;
    System.writeFile( "TEST-JavaScriptTest.xml", UnitTest.report() + "\n" );
    UnitTest.outputXml = false;

    print( UnitTest.report() + "\n" );
    return UnitTest.totalFailed();
}
