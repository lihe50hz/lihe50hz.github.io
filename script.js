// Wait for the document to load before running the script 
(function ($) {
  
  // We use some Javascript and the URL #fragment to hide/show different parts of the page
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Linking_to_an_element_on_the_same_page
  $(window).on('load hashchange', function(){
    
    // First hide all content regions, then show the content-region specified in the URL hash 
    // (or if no hash URL is found, default to first menu item)
    $('.content-region').hide();
    
    // Remove any active classes on the main-menu
    $('.main-menu a').removeClass('active');
    var region = location.hash.toString() || $('.main-menu a:first').attr('href');
    
    // Now show the region specified in the URL hash
    $(region).show();
    
    // Highlight the menu link associated with this region by adding the .active CSS class
    $('.main-menu a[href="'+ region +'"]').addClass('active'); 
    
  });
  
})(jQuery);

$(document).ready(function() {
  
  // Initialize - show the first content region by default if no hash
  if (!location.hash) {
    $('.content-region').hide();
    $('#ABOUT').show();
    $(".main-menu a").first().addClass("active");
  }
  
  // Copy to clipboard functionality
  $('.copyable-address').on('click', function() {
    const textToCopy = $(this).data('copy-text');
    
    // Use the modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(function() {
        showCopyPopup('Address copied to clipboard!');
      }).catch(function(err) {
        console.error('Failed to copy: ', err);
        fallbackCopyTextToClipboard(textToCopy);
      });
    } else {
      // Fallback for older browsers
      fallbackCopyTextToClipboard(textToCopy);
    }
  });
  
  // Copy to clipboard functionality for contact items
  $('.copyable-contact').on('click', function(e) {
    // Prevent default action if clicking on email links
    if (e.target.tagName === 'A') {
      return; // Allow email links to work normally
    }
    
    const textToCopy = $(this).data('copy-text');
    const contactType = $(this).text().includes('Phone') ? 'Phone number' : 'Email';
    
    // Use the modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(function() {
        showCopyPopup(`${contactType} copied to clipboard!`);
      }).catch(function(err) {
        console.error('Failed to copy: ', err);
        fallbackCopyTextToClipboard(textToCopy, contactType);
      });
    } else {
      // Fallback for older browsers
      fallbackCopyTextToClipboard(textToCopy, contactType);
    }
  });
  
  // Fallback copy function for older browsers
  function fallbackCopyTextToClipboard(text, type = 'address') {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showCopyPopup(`${type} copied to clipboard!`);
      } else {
        showCopyPopup(`Failed to copy ${type}`, 'error');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      showCopyPopup(`Failed to copy ${type}`, 'error');
    }
    
    document.body.removeChild(textArea);
  }
  
  // Show copy success/error popup
  function showCopyPopup(message, type = 'success') {
    // Remove any existing popup
    $('.copy-popup').remove();
    
    // Create popup element
    const popup = $('<div class="copy-popup"></div>');
    popup.text(message);
    
    if (type === 'error') {
      popup.css('background', '#f44336');
      popup.html('✗ ' + message);
    }
    
    // Add to body and show
    $('body').append(popup);
    
    // Trigger animation
    setTimeout(() => {
      popup.addClass('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
      popup.removeClass('show');
      setTimeout(() => {
        popup.remove();
      }, 300);
    }, 3000);
  }
  
});
