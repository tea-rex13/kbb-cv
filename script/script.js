// add class navbarDark when scrolling
const header = document.querySelector('.navbar');

window.onscroll = function() {
    var top = window.scrollY;
    if(top >=100) {
        header.classList.add('navbarDark');
    }
    else {
        header.classList.remove('navbarDark');
    }
}
// Close mobile navbar when a nav link is clicked
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbar = document.querySelector('.navbar-collapse');
        const bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });
        bsCollapse.hide();
    });
});

// Wait for the document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {

  // Get a reference to the "back to top" button
  const backToTopButton = document.querySelector('.back-to-top');

  // Function to toggle the button's visibility
  const toggleVisibility = () => {
    // Check how far the user has scrolled from the top
    // A value of 200 means the button will appear after scrolling down 200 pixels
    if (window.scrollY > 200) {
      // If scrolled past the threshold, add the 'show' class
      backToTopButton.classList.add('show');
    } else {
      // Otherwise, remove the 'show' class
      backToTopButton.classList.remove('show');
    }
  };

  // Add an event listener to the window to check for scroll events
  window.addEventListener('scroll', toggleVisibility);

});
