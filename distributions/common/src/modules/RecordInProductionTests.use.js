//-----------------------------------------------------------------------------
use( "Print" );
use( "RecordInProduction" );
use( "RecordUtil" );
use( "SafeAssert" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecordInProduction.checkRecord", function() {
    var record;
    var date = new Date( 2015, 5, 30 );

    record = RecordUtil.createFromString( "" );
    SafeAssert.not( "Empty record", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "004 00 *k xxx" );
    SafeAssert.not( "No 032", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *k xxx" );
    SafeAssert.not( "032: No a|x", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a xxx" );
    SafeAssert.not( "032a: Wrong format", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a XXX201504" );
    SafeAssert.not( "032a: Wrong production code", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a DBI201504" );
    SafeAssert.not( "032a: Publicity date is before current date", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a DBI201604" );
    SafeAssert.that( "032a: Publicity date is after current date", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x xxx" );
    SafeAssert.not( "032x: Wrong format", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x XXX201504" );
    SafeAssert.not( "032x: Wrong production code", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x DBI201504" );
    SafeAssert.not( "032x: Publicity date is before current date", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x DBI211604" );
    SafeAssert.that( "032x: Publicity date is after current date", RecordInProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a DBI201304 *x DBI211604" );
    SafeAssert.not( "032a: Publicity date is before current date and 032x: Publicity date is after current date", RecordInProduction.checkRecord( date, record ) );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecordInProduction.__extractWeekAndYear", function() {
    SafeAssert.equal( "Empty code", RecordInProduction.__extractWeekAndYear( "" ), null );
    SafeAssert.equal( "Wrong code", RecordInProduction.__extractWeekAndYear( "XXX45215" ), null );

    SafeAssert.equal( "Correct code", RecordInProduction.__extractWeekAndYear( "DBI201502" ), { weekno: 2, year: 2015 } );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecordInProduction.__calculateFirstProductionDate", function() {
    try {
        var expected = new Date(2007, 5, 1);
        SafeAssert.equal("Week: 23, 2007", RecordInProduction.__calculateFirstProductionDate( 23, 2007 ), expected);

        expected = new Date(2006, 11, 29);
        SafeAssert.equal("Week: 1, 2007", RecordInProduction.__calculateFirstProductionDate( 1, 2007 ), expected);
    }
    catch( e ) {
        e.printStackTrace();
    }
} );
