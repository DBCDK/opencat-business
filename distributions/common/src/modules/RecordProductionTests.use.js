//-----------------------------------------------------------------------------
use( "Print" );
use( "RecordProduction" );
use( "RecordUtil" );
use( "SafeAssert" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecordProduction.checkRecord", function() {
    var record;
    var date = new Date( 2015, 5, 30 );

    record = RecordUtil.createFromString( "" );
    SafeAssert.not( "Empty record", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "004 00 *k xxx" );
    SafeAssert.not( "No 032", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *k xxx" );
    SafeAssert.that( "032: No a|x", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a xxx" );
    SafeAssert.that( "032a: Wrong format", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a XXX201504" );
    SafeAssert.that( "032a: Wrong production code", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a DBI201504" );
    SafeAssert.not( "032a: Publicity date is before current date", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a DBI201604" );
    SafeAssert.that( "032a: Publicity date is after current date", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x xxx" );
    SafeAssert.that( "032x: Wrong format", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x XXX201504" );
    SafeAssert.that( "032x: Wrong production code", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x DBI201504" );
    SafeAssert.not( "032x: Publicity date is before current date", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x DBI211604" );
    SafeAssert.that( "032x: Publicity date is after current date", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a DBI201304 *x DBI211604" );
    SafeAssert.not( "032a: Publicity date is before current date and 032x: Publicity date is after current date", RecordProduction.checkRecord( date, record ) );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecordProduction.__extractWeekAndYear", function() {
    SafeAssert.equal( "Empty code", RecordProduction.__extractWeekAndYear( "" ), null );
    SafeAssert.equal( "Wrong code", RecordProduction.__extractWeekAndYear( "XXX45215" ), null );

    SafeAssert.equal( "Correct code", RecordProduction.__extractWeekAndYear( "DBI201502" ), { weekno: 2, year: 2015 } );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecordProduction.__calculateFirstProductionDate", function() {
    try {
        var expected = new Date(2007, 5, 1);
        SafeAssert.equal("Week: 23, 2007", RecordProduction.__calculateFirstProductionDate( 23, 2007 ), expected);

        expected = new Date(2006, 11, 29);
        SafeAssert.equal("Week: 1, 2007", RecordProduction.__calculateFirstProductionDate( 1, 2007 ), expected);
    }
    catch( e ) {
        e.printStackTrace();
    }
} );
