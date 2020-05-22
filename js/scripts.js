(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    const replace = (s) => s.replace(/^\//, '');
    let isSamePathName = replace(location.pathname) === replace(this.pathname);
    let isSameHostName = location.hostname === this.hostname;
    if (isSamePathName && isSameHostName) {
      let target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 72)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 75
  });

  // Collapse Navbar
  let navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-scrolled");
    } else {
      $("#mainNav").removeClass("navbar-scrolled");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Magnific popup calls
  $('.portfolio-box').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });

  // Form submit
  $('#sendEmailForm').on('submit', function(event) {

    event.preventDefault();
    let button = $('#submitEmail');
    const originalHTML = button.html();
    button.html('<span class="spinner-border" role="status" aria-hidden="true"></span>');
    button.attr('disabled', true);

    const emailInput = $('#emailInput');

    const emailValue = emailInput.val();

    $.post( 'http://localhost:3000/email', { email: emailValue })
        .done(function(data){

          console.log('Registered');
        })
        .fail(function(xhr, status, error) {
          switch (xhr.status) {
            case 409:
              console.log('Existing');
            default:
              console.error('Call failed')
          }
        })
        .always(function () {
          button.html(originalHTML);
          button.attr('disabled', false);
        });

  });



})(jQuery); // End of use strict
