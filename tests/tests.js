

QUnit.test( "temperature F/C converting and displaying test ", function( assert ) {
  

  convertTemp("si",37.12,"qunite-test-div-1");
  var result=$("#qunite-test-div-1").html();
  assert.ok(  result === "37°C", "37°C Passed!" );

  convertTemp("si",0.00,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.ok(  result === "0°C", "0°C  Passed!" );

  convertTemp("si",-12.00,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.ok(  result === "-12°C", "-12 °C Passed!" );

  convertTemp("us",89.61,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.ok(  result === "90°F", "90°F Passed!" );

  convertTemp("us",89.61,"qunite-test-div-1",86.92);
  result=$("#qunite-test-div-1").html();
  assert.equal(  result , "<b>90°</b>/ 87°F", "90°F Passed!" );

  convertTemp("us","21°C","qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.ok(  result === "21°C", "String Input Passed!" );

});

QUnit.test( "wind speed converting and displaying test", function( assert ) {
  convertWind("us",10.00);
  var result=$("#wind").html();
  assert.ok( result === "10 mph ", "10 mph Passed!" );
  
  convertWind("us",0.57);
  result=$("#wind").html();
  assert.ok( result === "1 mph ", "1 mph Passed!" );
  
  convertWind("us",0.00);
  result=$("#wind").html();
  assert.ok( result === "0 mph ", "0 mph Passed!" );
  
  convertWind("is",10.00);
  result=$("#wind").html();
  assert.equal( result , "36 kmph", "36 kmph Passed!" );
  
  convertWind("is",99.32);
  result=$("#wind").html();
  assert.equal( result , "358 kmph", "358 kmph Passed!" );

  convertWind("is",0.00);
  result=$("#wind").html();
  assert.equal( result , "0 kmph", "0 kmph Passed!" );
});

QUnit.test( "24 hour clock / 12 hour clock based time converting and displaying test", function( assert ) {
  // test clocks displaying on 'non-date' div
  convertTime("is",1465689600,0,"qunite-test-div-1");
  var result=$("#qunite-test-div-1").html();
  assert.equal( result ,"0:00", "Sun, 12 Jun 2016 00:00:00 GMT (UTCOffset:7) - 24 Hour Clock Passed!" );

  convertTime("us",1465689600,0,"qunite-test-div-1");
  var result=$("#qunite-test-div-1").html();
  assert.equal( result ,"12AM", "Sun, 12 Jun 2016 00:00:00 GMT (UTCOffset:0) - 12 Hour Clock Passed!" );

   convertTime("us",1465689700,7,"qunite-test-div-1");
  var result=$("#qunite-test-div-1").html();
  assert.equal( result ,"7:01AM", "Sun, 12 Jun 2016 00:01:40 GMT (UTCOffset:7) - 12 Hour Clock Passed!" );

  convertTime("is",1465622600,11,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.equal( result ,"16:23", "Sat, 11 Jun 2016 05:23:20 GMT (UTCOffset:11) - 24 Hour Clock Passed!" );

  convertTime("us",1465622600,7,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.equal( result ,"12:23PM", "Sat, 11 Jun 2016 05:23:20 GMT (UTCOffset:7) - 12 Hour Clock Passed!" );

  convertTime("is",1563122212,-2,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.equal( result ,"14:36", "Sun, 14 Jul 2019 16:36:52 GMT (UTCOffset:-2) - 24 Hour Clock Passed!" );

  convertTime("us",1563122212,-2,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.equal( result ,"2:36PM", "Sun, 14 Jul 2019 16:36:52 GMT (UTCOffset:-2) - 12 Hour Clock Passed!" );

  convertTime("is",1563122212,0,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.equal( result ,"16:36", "Sun, 14 Jul 2019 16:36:52 GMT (UTCOffset:0) - 24 Hour Clock Passed!" );

  convertTime("us",1563122212,0,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.equal( result ,"4:36PM", "Sun, 14 Jul 2019 16:36:52 GMT (UTCOffset:0) - 12 Hour Clock Passed!" );

  convertTime("is",1512129600,0,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.equal( result ,"12:00", "Sun, 14 Jul 2017 12:00:00 GMT (UTCOffset:0) - 24 Hour Clock Passed!" );

  convertTime("us",1512129600,0,"qunite-test-div-1");
  result=$("#qunite-test-div-1").html();
  assert.equal( result ,"12PM", "Sun, 14 Jul 2017 12:00:00 GMT (UTCOffset:0) - 12 Hour Clock Passed!" );

 

// test clocks displaying on 'date' div;
  timeZone="EST";
  convertTime("us",1465689600,8,"date");
  result=$("#date").html();
  assert.equal( result ,"at 8:00 am EST", "Sun, 12 Jun 2016 00:00:00 GMT - 12 Hour Clock displying on 'data' div Passed!" );
  timeZone="";


  timeZone="GMT";
  convertTime("is",1563122212,0,"date");
  result=$("#date").html();
  assert.equal( result ,"at 16:36 GMT", "Sun, 14 Jul 2019 16:36:52 GMT - 24 Hour Clock displying on 'data' div Passed!" );
  timeZone="";

//test using formated time string as input
  convertTime("us","16:20 EDT",7,"date");
  result=$("#date").html();
  assert.equal( result ,"16:20 EDT", "Formatted Time Input String Passed!" );
});

QUnit.test( "weekday converting and displaying test ", function( assert ) {
  convertDayOfWeek(1563122212,2,"qunite-test-div-1");
  var result=$("#qunite-test-div-1").html();
  assert.equal(result,"Sunday", "Sun, 14 Jul 2019 16:36:52 GMT Passed");

  convertDayOfWeek(1363083207,-11,"qunite-test-div-1");
  var result=$("#qunite-test-div-1").html();
  assert.equal(result,"Monday", "Tue, 12 Mar 2013 10:13:27 GMT Passed");

  convertDayOfWeek(1451606400,0,"qunite-test-div-1");
  var result=$("#qunite-test-div-1").html();
  assert.equal(result,"Friday", "Fri, 01 Jan 2016 00:00:00 GMT Passed");

  convertDayOfWeek(1456704000,0,"qunite-test-div-1");
  var result=$("#qunite-test-div-1").html();
  assert.equal(result,"Monday", "Mon, 29 Feb 2016 00:00:00 GMT Passed");

  convertDayOfWeek(1472817600,12,"qunite-test-div-1");
  var result=$("#qunite-test-div-1").html();
  assert.equal(result,"Saturday", "Fri, 02 Sep 2016 12:00:00 GMT Passed");
});


QUnit.test( "convertHourly list results test", function( assert ) {

  var list=convertHourly("us",sample_data1);
  assert.deepEqual(list,sample_res1,"Testoni Farm, Illiois at 1470026249 passed");
  list=convertHourly("us",sample_data2);
  assert.deepEqual(list,sample_res2,"Moscow, Russia at 1470031200 passed");
  list=convertHourly("is",sample_data3);
  assert.deepEqual(list,sample_res3,"Egyak, Hungary at 1470029529 passed");


});

QUnit.test( "convertWeekly list results test", function( assert ) {

  var list=convertWeekly("us",sample_data1);
  assert.deepEqual(list,sample_res01,"Testoni Farm, Illiois at 1470026249 passed");
  list=convertWeekly("us",sample_data2);
  assert.deepEqual(list,sample_res02,"Moscow, Russia at 1470031200 passed");
  list=convertWeekly("is",sample_data3);
  assert.deepEqual(list,sample_res03,"Egyak, Hungary at 1470029529 passed");


});




QUnit.test( "search city with invalid input test ", function( assert ) {


  var tmpTimeZone=timeZone;
  var done1 = assert.async();
  $("#search").val("");
  var asyctest=  searchCityInfo();
  console.log(asyctest);
  asyctest.always(function(data){
  	assert.equal(timeZone,tmpTimeZone,"'' Invalid Input Didn't Neither Throw Exception Nor Change Global Values ");
  	done1();
  });


  var done2 = assert.async();
  $("#search").val("hhhzz");
  var asyctest=  searchCityInfo();
  console.log(asyctest);
  asyctest.always(function(data){
  	assert.equal(timeZone,tmpTimeZone,"'hhhzz' Invalid Input Didn't  Neither Throw Exception Nor Change Global Values ");
  	done2();
  });
  

  var done3 = assert.async();
  $("#search").val("*-1");
  var asyctest=  searchCityInfo();
  console.log(asyctest);
  asyctest.always(function(data){
  	assert.equal(timeZone,tmpTimeZone,"'*-1' Invalid Input Didn't  Neither Throw Exception Nor Change Global Values ");
  	done3();
  });

  var done4 = assert.async();
  $("#search").val("Invalid City, United States");
  var asyctest=  searchCityInfo();
  console.log(asyctest);
  asyctest.always(function(data){
  	assert.equal(timeZone,tmpTimeZone,"'Invalid City' Which is Not Existing City didn't  Neither Throw Exception Nor Change Global Values ");
    done4();
  });

  
  var done5 = assert.async();
  $("#search").val("   ");
  var asyctest=  searchCityInfo();
  console.log(asyctest);
  asyctest.always(function(data){
    assert.equal(timeZone,tmpTimeZone,"'   ' Invalid Input didn't  Neither Throw Exception Nor Change Global Values ");
    done5();
  });
});

QUnit.test( "search city outside US test1", function( assert ) {
  var done1 = assert.async();
  $("#search").val("Guangzhou");
  var tmpTimeZone=timeZone;
  timeZone="";
  var asyctest=  searchCityInfo();
  console.log(asyctest);
  
  asyctest.always(function(data){
    assert.equal(timeZone,"CST","Guangzhou ,China TimeZone Passed");
    timeZone=tmpTimeZone;
    done1();
  });
    
});

QUnit.test( "search city outside US test2", function( assert ) {
  var done1 = assert.async();
  $("#search").val("London, United Kingdom");
  var tmpTimeZone=timeZone;
  timeZone="";
  var asyctest=  searchCityInfo();
  console.log(asyctest);
 
  asyctest.always(function(data){
    assert.equal(timeZone,"BST","London, United Kingdom TimeZone Passed");
    timeZone=tmpTimeZone;
    done1();
  });
    
});

QUnit.test( "search city inside US test1 ", function( assert ) {
  var done1 = assert.async();
  $("#search").val("Newark, Delaware");
  var tmpTimeZone=timeZone;
  timeZone="";
  var asyctest=  searchCityInfo();
  console.log(asyctest);
  
  asyctest.always(function(data){
    assert.equal(timeZone,"EDT","Newark, Delaware TimeZone Passed");
    timeZone=tmpTimeZone;
    done1();
  });
    
});

QUnit.test( "search city inside US test2 ", function( assert ) {
  var done1 = assert.async();
  $("#search").val("Milwaukee, Wisconsin");
  var tmpTimeZone=timeZone;
  timeZone="";
  var asyctest=  searchCityInfo();
  console.log(asyctest);
  
  asyctest.always(function(data){
    assert.equal(timeZone,"CDT","Milwaukee, Wisconsin TimeZone Passed");
    timeZone=tmpTimeZone;
    done1();
  });
    
});


QUnit.test( "search city inside US test2 ", function( assert ) {
  var done1 = assert.async();
  $("#search").val("  Mountain View, California  ");
  var tmpTimeZone=timeZone;
  timeZone="";
  var asyctest=  searchCityInfo();
  console.log(asyctest);
  
  asyctest.always(function(data){
    assert.equal(timeZone,"PDT","Mountain View, California TimeZone Passed");
    timeZone=tmpTimeZone;
    done1();
  });
    
});


QUnit.test( "F button switch test ", function( assert ) {
  var locationUnitTmp = locationUnit; //reserve default locationUnit; 
  locationUnit="si";
  $("#fButton").click();
  assert.equal(locationUnit,"us","When F Button clicked , global unit changed for 'si' to 'us'");
  locationUnit=locationUnitTmp;

  locationUnitTmp = locationUnit; //reserve default locationUnit; 
  locationUnit="us";
  $("#fButton").click();
  assert.equal(locationUnit,"us","When F Button clicked , global unit didn't change when it was 'us'");
  locationUnit=locationUnitTmp;
});

QUnit.test( "C button switch test ", function( assert ) {
  var locationUnitTmp = locationUnit; //reserve default locationUnit; 
  locationUnit="us";
  $("#cButton").click();
  assert.equal(locationUnit,"si","When C Button clicked , global unit changed from 'us' to 'si'");
  locationUnit=locationUnitTmp;

  locationUnitTmp = locationUnit; //reserve default locationUnit; 
  locationUnit="si";
  $("#cButton").click();
  assert.equal(locationUnit,"si","When C Button clicked , global unit didn't change when it is 'si'");
  locationUnit=locationUnitTmp;
});



QUnit.test( "scrolling test Y=575", function( assert ) {
   
  var done1 = assert.async();
  $(window).scrollTop(575);
  setTimeout(function() {
    
    var r0=$("body").find("#nav.navbar-default");
    var r1=$("body").find("#nav.navbar-fixed-top");
    var r2=$("body").find(".navbar.nav1");
    assert.equal(r0.length,0,".navbar-default was removed when scroll position was 575");
    assert.equal(r1.length,0,".navbar-fixed-top was removed when scroll position was 575");
    assert.equal(r2.length,3,".nav1 was added when scroll position was 575");
    done1();
 
  },1000);
});

QUnit.test( "scrolling test Y>575", function( assert ) {
  var done2 = assert.async();
  $(window).scrollTop(700);
  setTimeout(function() {
    var r0=$("body").find("#nav.navbar-default");
    var r1=$("body").find("#nav.navbar-fixed-top");
    var r2=$("body").find(".navbar.nav1");
    assert.equal(r0.length,1,".navbar-default was removed when scroll position was 700");
    assert.equal(r1.length,1,".navbar-fixed-top was removed when scroll position was 700");
    assert.equal(r2.length,0,".nav1 was added when scroll position was 700");
    done2();
  },1000);
});

QUnit.test( "scrolling test Y<575", function( assert ) {
  var done2 = assert.async();
  $(window).scrollTop(0);
  setTimeout(function() {
    var r0=$("body").find("#nav.navbar-default");
    var r1=$("body").find("#nav.navbar-fixed-top");
    var r2=$("body").find(".navbar.nav1");
    assert.equal(r0.length,0,".navbar-default was removed when scroll position was 0");
    assert.equal(r1.length,0,".navbar-fixed-top was removed when scroll position was 0");
    assert.equal(r2.length,3,".nav1 was added when scroll position was 0");
    done2();
  },1000);
});



