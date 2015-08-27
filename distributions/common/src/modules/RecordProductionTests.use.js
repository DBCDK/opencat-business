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
    SafeAssert.not( "032: No a|x", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a xxx" );
    SafeAssert.not( "032a: Wrong format", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a XXX201504" );
    SafeAssert.not( "032a: Wrong production code", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a DBI201504" );
    SafeAssert.not( "032a: Publicity date is before current date", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a DBI201604" );
    SafeAssert.that( "032a: Publicity date is after current date", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x xxx" );
    SafeAssert.not( "032x: Wrong format", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x XXX201504" );
    SafeAssert.not( "032x: Wrong production code", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x DBI201504" );
    SafeAssert.not( "032x: Publicity date is before current date", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *x DBI201604" );
    SafeAssert.that( "032x: Publicity date is after current date", RecordProduction.checkRecord( date, record ) );

    record = RecordUtil.createFromString( "032 00 *a DBI201304 *x DBI201604" );
    SafeAssert.that( "032a: Publicity date is before current date and 032x: Publicity date is after current date", RecordProduction.checkRecord( date, record ) );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecordProduction.__extractWeekAndYear", function() {
    SafeAssert.equal( "Empty code", RecordProduction.__extractWeekAndYear( "" ), null );
    SafeAssert.equal( "Wrong code", RecordProduction.__extractWeekAndYear( "XXX45215" ), null );

    SafeAssert.equal( "Correct code", RecordProduction.__extractWeekAndYear( "DBI201502" ), { weekno: 2, year: 2015 } );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecordProduction.__calculateFirstProductionDate", function() {
    var expected = new Date( 2007, 4, 28 );
    SafeAssert.equal( "Week: 23, 2007", RecordProduction.__calculateFirstProductionDate( 23, 2007 ), expected );

    expected = new Date( 2006, 11, 25 );
    SafeAssert.equal( "Week: 1, 2007", RecordProduction.__calculateFirstProductionDate( 1, 2007 ), expected );
} );

//-----------------------------------------------------------------------------
/*
UnitTest.addFixture( "RecordProduction.javaCalendar", function() {
    var Calendar = Packages.java.util.Calendar;
    var SimpleDateFormat = Packages.java.text.SimpleDateFormat;

    var cal = Calendar.getInstance();
    cal.set( Calendar.YEAR, 2007 );
    cal.set( Calendar.WEEK_OF_YEAR, 23 );
    cal.set( Calendar.DAY_OF_WEEK, Calendar.MONDAY );

    var sdf = new SimpleDateFormat( "dd/MM-yyyy");

    SafeAssert.equal( "Calendar: 232007", sdf.format( cal.getTime() ) + '', "04/06-2007" );

    var date = new Date( cal.get( Calendar.YEAR ), cal.get( Calendar.MONTH ), cal.get( Calendar.DAY_OF_MONTH ) );
    SafeAssert.equal( "Date: 232007", date.toDateString(), "Mon Jun 04 2007" );

    var curDate = new Date( 2015, 7, 26 );
    SafeAssert.equal( "curDate 1", curDate.toDateString(), "Wed Aug 26 2015" );
    SafeAssert.that( "Compare 1", curDate.getTime() > date.getTime() );

    curDate = new Date( 2007, 5, 4 );
    SafeAssert.equal( "curCal 2", curDate.toDateString(), "Mon Jun 04 2007" );
    SafeAssert.that( "Compare 2", curDate.getTime() === date.getTime() );

    curDate = new Date( 2007, 5, 3 );
    SafeAssert.equal( "curCal 3", curDate.toDateString(), "Sun Jun 03 2007" );
    SafeAssert.that( "Compare 3", curDate.getTime() < date.getTime() );

    curDate = new Date;
    SafeAssert.equal( "Day", curDate.getDate(), 26 );
    SafeAssert.equal( "Month", curDate.getMonth(), 7 );
    SafeAssert.equal( "Year", curDate.getFullYear(), 2015 );
} );
*/
