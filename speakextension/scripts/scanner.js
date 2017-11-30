var horizontalmovement = "down"; // up
var verticalmovement = "right"; // left, right
var state = "none";  // verticalscan, horizontalscan, none
var scrolledState = "none";
var previousState = "none";
var interval = null;
var globalOffset = 0;

var scanSpeed = 10;

var mostRecentTextAreaContext = null;
var mostRecentTextAreaValue = "";
var isCapsOn = false;
var isShiftOn = false;
var buttonClicked = ""; 
var previousButtonClicked = ""; 

$(document).ready(function() {

 


  $("body").append('<div class="scanbar" id="vertical-scanbar"></div>');
  $("body").append('<div class="scanbar" id="horizontal-scanbar"></div>');

  $("body").append("<input type='button' id='thebutton' class='showkeyboard' value='Software Keyboard'>");
  $("body").append("<input type='button' class='scrolldown' value='down'>");
  $("body").append("<input type='button' class='scrollup' value='up'>");

  $("body").append('<div class="keyboard" id="the-keys" ><div class="key num dual">~<br>`</div><div class="key num dual">!<br>1</div><div class="key num dual">@<br>2</div><div class="key num dual">#<br>3</div><div class="key num dual">$<br>4</div><div class="key num dual">%<br>5</div><div class="key num dual">^<br>6</div><div class="key num dual">&<br>7</div><div class="key num dual">*<br>8</div><div class="key num dual">(<br>9</div><div class="key num dual">)<br>0</div><div class="key num dual">_<br>-</div><div class="key num dual">+<br>=</div><div class="key backspace">Backspace</div><div class="key tab">Tab</div><div class="key letter">Q</div><div class="key letter">W</div><div class="key letter">E</div><div class="key letter">R</div><div class="key letter">T</div><div class="key letter">Y</div><div class="key letter">U</div><div class="key letter">I</div><div class="key letter">O</div><div class="key letter">P</div><div class="key dual">{<Br>[</div><div class="key dual">}<br>]</div><div class="key letter dual slash">|<br>\</div><div class="key caps">Caps<br>Lock</div><div class="key letter">A</div><div class="key letter">S</div><div class="key letter">D</div><div class="key letter">F</div><div class="key letter">G</div><div class="key letter">H</div><div class="key letter">J</div><div class="key letter">K</div><div class="key letter">L</div>  <div class="key dual">:<br>;</div><div class="key dual"><br></div><div class="key enter">Enter</div><div class="key shift left">Shift</div><div class="key letter">Z</div>  <div class="key letter">X</div><div class="key letter">C</div><div class="key letter">V</div><div class="key letter">B</div><div class="key letter">N</div><div class="key letter">M</div><div class="key dual"><<br>,</div><div class="key dual">><br>.</div><div class="key dual">?<br>/</div><div class="key shift right">Shift</div><div class="key ctrl">Ctrl</div><div class="key heart">&hearts;</div><div class="key">Alt</div><div class="key space"> </div></div></div>');


   $("#thebutton").click(function() {

      console.log("hey jude" + state + "..." + previousState);



      if(state == "none" && previousState == "horizontalscan") {


        if ($('#the-keys').css('display')=='block') {
          $('#the-keys').css('display', 'none');
        } 
        else if ($('#the-keys').css('display')=='none') {
          $('#the-keys').css('display', 'block');
        }

    }  
  })


  $(".scrolldown").click(function() {
    console.log("scroll down has been clicked ... ");
    $('html, body').animate({
      
        scrollTop: $(window).scrollTop()+150
    }, 1000);
    scrolledState = "down";
    return true;
  }) 
  $(".scrollup").click(function() {
    console.log("scroll up has been clicked ... ");
    $('html, body').animate({
        scrollTop: $(window).scrollTop()-150
    }, 1000);

    scrolledState = "up";
    return true;
  }) 




  $('input').click(function() {



    if ($(this)[0]['type'] == 'text') {
      mostRecentTextAreaContext = $(this)
      mostRecentTextAreaValue = $(this)[0]['value']
    }


  })

  $('.keyboard > div').click(function() {
    var myClass = $(this).attr("class");
    previousButtonClicked = buttonClicked;
    buttonClicked = $(this).text().toString();
    
    
    


      if (state == 'none' && previousState == 'horizontalscan') {

        if(buttonClicked.includes('CapsLock')) {
      buttonClicked = "";
      isCapsOn = !isCapsOn;
    }
    if(buttonClicked.includes('Shift')) {
      buttonClicked = "";
      isShiftOn = !isShiftOn; 
    }

    console.log(isCapsOn);


        if(isCapsOn) {
            buttonClicked = buttonClicked.toUpperCase();
        } 
        else {
          buttonClicked = buttonClicked.toLowerCase();
        }
        if(myClass == 'key letter' || myClass == 'key heart' || myClass == 'key space') {
          mostRecentTextAreaContext[0]['value'] = mostRecentTextAreaContext[0]['value'] + buttonClicked;
        }
        if(myClass == 'key backspace') {
          buttonClicked = "";
          mostRecentTextAreaContext[0]['value'] = mostRecentTextAreaContext[0]['value'].slice(0, -1);
          //buttonClicked = mostRecentTextAreaContext[0]['value']
          
        }
        if(myClass == 'key tab') {
          buttonClicked = "    ";
          mostRecentTextAreaContext[0]['value'] = mostRecentTextAreaContext[0]['value'] + buttonClicked;
        }

        if (myClass == 'key num dual' || myClass == 'key dual' || myClass == 'key letter dual slash') {

            if(isShiftOn) {
              buttonClicked = buttonClicked.slice(0,1);
            } 
            else {
              buttonClicked = buttonClicked.slice(1,2);
            }
            mostRecentTextAreaContext[0]['value'] = mostRecentTextAreaContext[0]['value'] + buttonClicked;
        }


      }
      

    
    
  })


  $(document).keydown(function(e) {
  	if(e.key=="b") {


      console.log("b has been pressed .. .")
      clearInterval(interval);

      if(state=="none") { 
        previousState = state;
        state = "verticalscan";
        $("#horizontal-scanbar").show();



        if(!$(window).scrollTop()) { //abuse 0 == false :)
            
// Setting up the vertical scan
        interval = setInterval(function() {
          var offset = $("#horizontal-scanbar").offset();
          var y = offset.top;


          //console.log("aroon " + y);

          
          

          //console.log("OFFSET = " + offset.top);

          if(horizontalmovement=="down" ) {
            y = y+scanSpeed  ;
         //   console.log("RHS y = " + y );
          } 

          else if(horizontalmovement=="up") {
            y = y-scanSpeed;
          }

         // console.log("scan speed = " + scanSpeed);

          if(y >= $(window).height()) {
            console.log("crossed window height: " + y + ":" + $(window).height());
            horizontalmovement = "up";
          } else if(y <= 0) {
            horizontalmovement = "down";
          }

          //console.log("new y is " + y + " " + $(window).height());

          $("#horizontal-scanbar").css("top", y+"px");
        }, 100);






          } else { ///////////////////////////////
console.log("yo yo : " + $(window).scrollTop())


            // Setting up the vertical scan
        interval = setInterval(function() {
          var offset = $("#horizontal-scanbar").offset();
          var y = offset.top;

          if(y != 0 && globalOffset == 0) {
            console.log("global offset is being set" + globalOffset);
            globalOffset = y;
          }

          console.log("aroon " + y);

          globalOffset = $(window).scrollTop();
          

          console.log("OFFSET = " + offset.top);

          if(horizontalmovement=="down" ) {
            y = y+scanSpeed - globalOffset ;
            console.log("1.RHS y = " + y );
          } 

          else if(horizontalmovement=="up") {
            y = y-scanSpeed- globalOffset ;
            console.log("2.RHS y = " + y );
          }

         // console.log("scan speed = " + scanSpeed);

          if(y >= $(window).height()) {
            console.log("crossed window height: " + y + ":" + $(window).height());
            horizontalmovement = "up";
          } else if(y <= 0) {
            horizontalmovement = "down";
          }

          //console.log("new y is " + y + " " + $(window).height());

          $("#horizontal-scanbar").css("top", y+"px");
        }, 100);
          }

        

  	  } else if(state=="verticalscan") {
        previousState = state;
        state = "horizontalscan";
        $("#vertical-scanbar").show();

        // Setting up the vertical scan
        interval = setInterval(function() {
          var offset = $("#vertical-scanbar").offset();
          var x = offset.left;

          if(verticalmovement=="right") {
            x = x+scanSpeed;
          } else if(verticalmovement=="left") {
            x = x-scanSpeed;
          }

          if(x >= $(window).width()) {
            verticalmovement = "left";
          } else if(x <= 0) {
            verticalmovement = "right";
          }


          $("#vertical-scanbar").css("left", x+"px");
        }, 100);
      } 

      else if(state=="horizontalscan") {
       
        var offset = $("#vertical-scanbar").offset();
        var x = offset.left + $("#vertical-scanbar").width()/2.0;

        var offset = $("#horizontal-scanbar").offset();
        var y = offset.top + $("#horizontal-scanbar").height()/2.0;


        $("body").append("<div class='click'></div>");

        $(".click").css("left", x+"px");
        $(".click").css("top", y+"px");

        $(".click").animate({
          width: "+=25",
          height: "+=25",
          left: "-=12.5",
          top: "-=12.5",
          "border-radius": "+=12"
        }, 800, function() {
          $(".click").hide();
          var elementtoclick = document.elementFromPoint(x, y - globalOffset);


          console.log("CLICKABLE ELEMENT = \("+ x + ", "+y +"\)");
          console.log("simulating click");
          simulateClick(elementtoclick);
        });

        $("#horizontal-scanbar").hide();
        $("#vertical-scanbar").hide();
      }
  	}
  })
})

function simulateClick(element) {
  previousState = state;
	state = "none";
  if (!element) return;
  var dispatchEvent = function (elt, name) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(name, true, true);
    elt.dispatchEvent(clickEvent);
  };
  dispatchEvent(element, 'mouseover');
  dispatchEvent(element, 'mousedown');
  dispatchEvent(element, 'click');
  dispatchEvent(element, 'mouseup');
};