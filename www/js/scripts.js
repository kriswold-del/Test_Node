/*!
    * Start Bootstrap - Freelancer v6.0.5 (https://startbootstrap.com/theme/freelancer)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
    */
    (function($) {
    "use strict"; // Start of use strict
  
    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: (target.offset().top - 71)
          }, 1000, "easeInOutExpo");
          return false;
        }
      }
    });
  
    // Scroll to top button appear
    $(document).scroll(function() {
      var scrollDistance = $(this).scrollTop();
      if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    });
  
    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
      $('.navbar-collapse').collapse('hide');
    });
  
    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 80
    });
  
    // Collapse Navbar
    var navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-shrink");
      } else {
        $("#mainNav").removeClass("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
  
    // Floating label headings for the contact form
    $(function() {
      $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
      }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
      }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
      });
    });
  
  })(jQuery); // End of use strict
  

$(document).ready(function(){
  var bins = [
    ['Example container #1', 20,20,20],
    ['Example container #2', 40,40,20],
    ['Example container #3', 40,40,40],
    ['Example container #4', 60,40,40],
    ['Example container #5', 60,60,40],
    ['Example container #6', 60,60,60],
    ['Example container #7', 80,80,80],
    ['Example container #8', 120,60,60],
    ['Example container #9', 120,120,120],
    ['Example container #10', 150,150,150],
  ];
  var arritems = [
      [30,30,30,1],
      [20,60,60,1],
      [20,20,20,1],
      [10,10,40,1]
  ];

    $("#item_json_input").val(JSON.stringify(arritems,undefined, 4));
    $("#bin_json_input").val(JSON.stringify(bins,undefined, 4));
  $("#testAPI").click(function(e){
    e.preventDefault();
    // $.post("", { name: "John", time: "2pm" })
    // .done(function( data ) {
    //   alert("here");
    // });

    var sendbins =  JSON.parse($("#bin_json_input").val());
    var senditems =  JSON.parse($("#item_json_input").val());


    $.ajax({
      type: "POST",
      url: "/",
      data: {bins :JSON.stringify(sendbins),items :JSON.stringify(senditems)}, 
      success: function(data){
        $("#output").html(data.sampleresponse + " Will be the best fit.\nreponse took " + data.executiontime.time +"Ms" );
   }
  })
})
  })