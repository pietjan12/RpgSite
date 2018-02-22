$( document ).ready(function() {
    var animation_elements = $.find('.animate');
    var web_window = $(window);

    //Video pauzeren/afspelen
  	$(".video").on("click", function() {
     		this.paused?this.play():this.pause();
  	});

    //Controleren of er al items in zicht zijn.
    check_if_in_view();

  	// navigatiebalk transparant/ zichtbaar maken indien nodig en elementen animeren.
  	$(window).scroll(function() {
	    if ($("#mainNav").offset().top > 200) {
	      $("#mainNav").addClass("navbar-shrink");
	    } else {
	      $("#mainNav").removeClass("navbar-shrink");
	    }

      check_if_in_view();
    });

    //check to see if any animation containers are currently in view
    function check_if_in_view() {
      //get current window information
      var window_height = web_window.height();
      var window_top_position = web_window.scrollTop();
      var window_bottom_position = (window_top_position + window_height);

      //iterate through elements to see if its in view
      $.each(animation_elements, function() {

        //get the elements information
        var element = $(this);
        var element_height = $(element).outerHeight();
        var element_top_position = $(element).offset().top;
        var element_bottom_position = (element_top_position + element_height);

        //check to see if this current container is visible (its viewable if it exists between the viewable space of the viewport)
        if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
          element.addClass('in-view');
        } else {
          element.removeClass('in-view');
        }
      });
    }
	
	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

    //Smooth Scroll naar sectie.
    $("#ScrollDown").click(function() {
        $('html, body').animate({
            scrollTop: $("#newsSummary").offset().top
        }, 1000);
    });


    $('.hero-scroll').scrollLeft(600);


    var down=false;
    var scrollLeft=0;
    var x = 0;

    $('.hero-scroll').on('mousedown mouseup mousemove mouseleave', function mouseState(e) {
      if (e.type == "mousedown") {
          down = true;
          scrollLeft = this.scrollLeft;
          x = e.clientX;
      }

      if(e.type== "mouseup") {
          down = false;
      } 

      if(e.type == "mousemove") {
        if(down){
          this.scrollLeft = scrollLeft + x - e.clientX;
        }
      }

      if(e.type=="mouseleave") {
        down = false;
      }
    });


     $(".hero").click(function() {

        if(!$(this).hasClass("inview")) {
		
		  if(!isMobile()) {

          var left = $(this).offset().left;

          console.log(left);

          var flexbox = $('.hero-scroll');

          flexbox.animate( { scrollLeft: left }, 500 );
		  
		  }

          var inview = $.find('.inview'); 

          $.each(inview, function() { 
            $(this).removeClass('inview');
          });

          $(this).addClass('inview');
        }

    });
});