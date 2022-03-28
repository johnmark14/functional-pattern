/* Jonathan Snook - MIT License - https://github.com/snookca/prepareTransition */
(function(a){a.fn.prepareTransition=function(){return this.each(function(){var b=a(this);b.one("TransitionEnd webkitTransitionEnd transitionend oTransitionEnd",function(){b.removeClass("is-transitioning")});var c=["transition-duration","-moz-transition-duration","-webkit-transition-duration","-o-transition-duration"];var d=0;a.each(c,function(a,c){d=parseFloat(b.css(c))||d});if(d!=0){b.addClass("is-transitioning");b[0].offsetWidth}})}})(jQuery);

/* Run function after window resize */
var afterResize=(function(){var t={};return function(callback,ms,uniqueId){if(!uniqueId){uniqueId="Don't call this twice without a uniqueId";}if(t[uniqueId]){clearTimeout(t[uniqueId]);}t[uniqueId]=setTimeout(callback,ms);};})();


// Helper functions
function replaceUrlParam(url, paramName, paramValue) {
  var pattern = new RegExp('('+paramName+'=).*?(&|$)'),
      newUrl = url.replace(pattern,'$1' + paramValue + '$2');
  if ( newUrl == url ) {
    newUrl = newUrl + (newUrl.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
  }
  return newUrl;
}
 
// Timber functions
window.timber = window.timber || {};

timber.cacheSelectors = function () {
  timber.cache = {
    // General
    $html: $('html'),
    $body: $('body'),
   $changeView: $('.change-view'), 
    
       // Cart Page
    cartNoteAdd: '.cart__note-add',
    cartNote: '.cart__note',
     // Search Page       
    $searchInput: $('.search-bar__input'),
    $searchSubmit: $('.search-bar__submit'),
    
    
    
    // Product Page   
    $productImage: $('#product-featured-image')
    
  
  
  }
};

timber.init = function () {  
  timber.cacheSelectors();  
  timber.autoResponsiveElements();
  
  timber.notify();
  timber.cartPage();
  
  
  timber.search();
  
};


timber.productPage = function (options) {
  var moneyFormat = options.money_format,
      variant = options.variant,
      selector = options.selector,
      translations = options.translations;

  // Selectors
  var $productImage = $('#product-featured-image'),
      $addToCart = $('#AddToCart'),
      $productPrice = $('#ProductPrice'),
      $comparePrice = $('#ComparePrice'),
    //  $quantityElements = $('.quantity-selector, label + .js-qty, .qtyminus, .qtyplus, .product-single__quantity'),
      
      $productsku = $('#product-sku'),
      $addToCartText = $('#AddToCartText');            
  const progress_bars = document.querySelectorAll('.progress');
  const inventoryStatus = document.querySelectorAll('.variant-inventory');
  if (variant) {
    
     //update variant inventory    

    // Regardless of stock, update the product price
    $productPrice.html( Shopify.formatMoney(variant.price, moneyFormat) );

    // Also update and show the product's compare price if necessary
    if (variant.compare_at_price > variant.price) {
      $comparePrice
        .html(Shopify.formatMoney(variant.compare_at_price, moneyFormat))
        .show();
    } else {
      $comparePrice.hide();
    }


    // Select a valid variant if available
    if (variant.available) {
      // Available, enable the submit button, change text, show quantity elements
      $addToCart.removeClass('disabled').prop('disabled', false);
      $addToCartText.html(translations.add_to_cart);
      $productsku.text(variant.sku);
     // $inventoryStatus.html(inv_qty[ variant.id ]);
      //$quantityElements.show();
    } else {
      // Sold out, disable the submit button, change text, hide quantity elements
      $addToCart.addClass('disabled').prop('disabled', true);
      $addToCartText.html(translations.sold_out);
   //   $inventoryStatus.hide();
      //$quantityElements.hide();
    }


    const slider_nav = $('.slider-nav');

    if(slider_nav.hasClass('slick-initialized')) {
      const goToIdx = $(`.slick-slide:not(.slick-cloned)[data-image-id=${variant.featured_image.id}]`).data('image-index');
      slider_nav.slick('slickGoTo', goToIdx);
    }
    
    
    
    
    
    



  } else {
    // The variant doesn't exist, disable submit button.
    // This may be an error or notice that a specific variant is not available.
    // To only show available variants, implement linked product options:
    //   - http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options
    $addToCart.addClass('disabled').prop('disabled', true);
    $addToCartText.html(translations.unavailable);
    
    
   
  }
  
  /*begin variant image*/
    if (variant && variant.featured_image) {
        var originalImage = jQuery("#product-featured-image");
        var newImage = variant.featured_image;
        var element = originalImage[0];
       Shopify.Image.switchImage(newImage, element, function (newImageSizedSrc, newImage, element) {
          jQuery('#ProductThumbs img').each(function() {
            var grandSize = jQuery(this).attr('src');            
            grandSize = grandSize.replace('medium','grande');                       
            if (grandSize == newImageSizedSrc) {
              jQuery(this).parent().trigger('click');              
              return false;
            }
          });
        });        
    }
    /*end of variant image */
   
                              
  
   // BEGIN SWATCHES
    if (variant) {
  var form = jQuery('#' + selector.domIdPrefix).closest('form');
  for (var i=0,length=variant.options.length; i<length; i++) {
    var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
    if (radioButton.size()) {
      radioButton.get(0).checked = true;
    }
  }
}
// END SWATCHES
  
  
  
};


timber.autoResponsiveElements = function () {
  var $iframeVideo = $('iframe[src*="youtube.com/embed"], iframe[src*="player.vimeo"]');
  var $iframeReset = $iframeVideo.add('iframe#admin_bar_iframe');

  $('table').wrap('<div class="table-wrapper"></div>');

  $iframeVideo.each(function () {
    // Add wrapper to make video responsive
    $(this).wrap('<div class="video-wrapper"></div>');
  });

  $iframeReset.each(function () {
    // Re-set the src attribute on each iframe after page load
    // for Chrome's "incorrect iFrame content on 'back'" bug.
    // https://code.google.com/p/chromium/issues/detail?id=395791
    // Need to specifically target video and admin bar
    this.src = this.src;
  });
};

timber.notify = function () {
$('#notify-me').on('click' , function() {
$('#notify-me-wrapper').fadeIn();
return false;
});
};

if(window.top.location.href.indexOf("?customer_posted=true") > -1) {
  $(".success").addClass("show");
}   



timber.cartPage = function () {
  

  timber.cache.$body.on('click', timber.cache.cartNoteAdd, function () {
    $(this).addClass('is-hidden');
    $(timber.cache.cartNote).addClass('is-active');   
  });
};
timber.drawersInit = function () {
  // Add required classes to HTML
 // $('#PageContainer').addClass('drawer-page-content');  
  $('.js-drawer-open-top').attr('aria-controls', 'SearchDrawer').attr('aria-expanded', 'false');  
  timber.SearchDrawer = new timber.Drawers('SearchDrawer', 'top', {'onDrawerOpen': timber.searchFocus});
};

timber.searchFocus = function () {
  timber.cache.$searchInput.focus();
  // set selection range hack for iOS
  timber.cache.$searchInput[0].setSelectionRange(0, timber.cache.$searchInput[0].value.length);
};

timber.searchSubmit = function () {
  timber.cache.$searchSubmit.on('click', function(evt) {
    if (timber.cache.$searchInput.val().length == 0) {
      evt.preventDefault();
      timber.cache.$searchInput.focus();
    }
  });
};


/*============================================================================
  Drawer modules
==============================================================================*/
timber.Drawers = (function () {
  var Drawer = function (id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.$nodes = {
      parent: $('body, html'),
      page: $('#PageContainer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  };

  Drawer.prototype.init = function () {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
  };

  Drawer.prototype.open = function (evt) {
    
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$drawer.prepareTransition();

    this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    // Set focus on drawer
    this.trapFocus({
      $container: this.$drawer,
      $elementToFocus: this.$drawer.find('.drawer__close-button'),
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof(this.config.onDrawerOpen) == 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.$nodes.parent.on('keyup.drawer', $.proxy(function (evt) {
      // close on 'esc' keypress
      if (evt.keyCode === 27) {
        this.close();
        return false;
      }
    }, this));

    // Lock scrolling on mobile
    this.$nodes.page.on('touchmove.drawer', function () {
      return false;
    });

    this.$nodes.page.on('click.drawer', $.proxy(function () {
      this.close();
      return false;
    }, this));
  };

  Drawer.prototype.close = function () {
    if (!this.drawerIsOpen) { // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$drawer.prepareTransition();

    this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    // Remove focus on drawer
    this.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    this.$nodes.page.off('.drawer');
    this.$nodes.parent.off('.drawer');
  };

  /**
  * Traps the focus in a particular container
  *
  * @param {object} options - Options to be used
  * @param {jQuery} options.$container - Container to trap focus within
  * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
  * @param {string} options.namespace - Namespace used for new focus event handler
  */
  Drawer.prototype.trapFocus = function (options) {
    var eventName = options.eventNamespace
      ? 'focusin.' + eventNamespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function (evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  };
 
  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  Drawer.prototype.removeTrapFocus = function (options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  };

  return Drawer;
})();

   
timber.search = function(){ 
     $('a#search_trigger').click(function(event){       
         event.stopPropagation();
          $(".search_reveal").slideToggle("500");
          $("body").toggleClass("init-search-type-two");
          return false;
     });
     $(".search_reveal").on("click", function (event) {
         event.stopPropagation();
     });
     $(".close, body").on("click", function () {
       $(".search_reveal").slideUp('500');
       $("body").removeClass("init-search-type-two");
     });
};

// Initialize Timber's JS on docready
$(timber.init)
$(function(){
  $('body').on('click','.results_modal_btn', function(){    
  	var $article = $(this).closest('.article-item');
    var modalSlider = $article.find('[data-init-slideshow]');
// 	$('body').css('overflow-y', 'hidden');
    
    if (modalSlider.not('.slick-initialized')) {
        modalSlider.slick({
            dots: modalSlider.data('dots'),
            slidesToScroll: 1,
            verticalSwiping: false,
            fade: modalSlider.data('fade'),
            cssEase: "ease",
            adaptiveHeight: true,
            autoplay: modalSlider.data('autoplay'),
            autoplaySpeed: modalSlider.data('autoplay-speed'),
            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
            responsive: [{
                breakpoint: 1280,
                settings: {
                    arrows: false,
                    dots: modalSlider.data('dots'),
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: true
                }
            }
            ]
        });
    };
  });
  $('body').on('click','.close', function(){
    $('body').css('overflow-y', 'initial');
  });
})
$(function(){  
  $(document).on('click', '.results_modal_btn', function(e){    
    $('body').css('overflow-y', 'hidden');
    e.preventDefault();
  }); 
  $('body').on('click', function(){
    $('body').css('overflow-y', 'initial');
  });
  var newWidth = $('.blog_section_detail').width();
  var newHeight = newWidth * 9/16;
  $('.blog_section_detail iframe').height(newHeight);
  
  $(document).on('click', '.avatar_btn', function(e){    
    $('body').css('overflow-y', 'hidden');
    e.preventDefault();
  }); 
  
  // disable less link in the course product
//   var HeightDesc = $('.product-description').height();
//   if(HeightDesc < 200 ){
//     $('.pdp-msg').css('display', 'none');    
//   }
//   else{
//     $('.product-description').css('height', '190px');
    
//     $(document).on('click', '.learn-more', function(e){
//       e.preventDefault();
//       $('.product-description').removeClass('p-summary');
//       $('.learn-more-label').hide();
//       $('.less-label').css('display', 'block');
//       $('.product-description').css('height', 'auto');
//     });
//     $(document).on('click', '.less', function(e){
//       e.preventDefault();
//       $('.product-description').addClass('p-summary');    
//       $('.less-label').css('display', 'none');
//       $('.learn-more-label').css('display', 'block');
//   	  $('.product-description').css('height', '190px');
//       $('html, body').animate({
//         scrollTop: $('.product_single_detail_section').offset().top
//       }, 1000);
//     });    
//   }
// if(localStorage.getItem('popshow') != false ){
//   $j("#popup").delay(2000).fadeIn();
//   localStorage.setItem('popState','shown')
// }


if ($('#find-a-practitioner').length != 0 ) {

  localStorage.setItem('prac_page', true);

  if(localStorage.getItem('popshow') == "false" ) {
    localStorage.setItem('prac_page', false);
  }

  if(localStorage.getItem('prac_page') != "false" ) {
    var modal = $('#dis-modal')
    modal.show()
    $('body').addClass('no-overflow')
    $('#find-a-practitioner .dis-footer').addClass('hide-dec')
  }
}

  $('.disclaimer-first').click( function(e) {
    e.preventDefault()
    var modal = $('#dis-modal')
    $('body').addClass('no-overflow')
    modal.show()
  })

  $(document).on('click','.dis-footer .accept', function() {
    var parent = $(this).parents('.practitioner-pop')
    var modal = $(this).parents('#dis-modal')
    var link = $(this).data('url')

    localStorage.setItem('popshow', false);

    if ($('#find-a-practitioner').length == 0 ) {
      document.location.href = link
    }
    
    $('body').removeClass('no-overflow')
    $(modal).hide()
  })

  $(document).on('click','.dis-footer .decline', function() {
    var link = $(this).data('url');
    var parent = $(this).parents('.practitioner-form-wrapper')
    var modal = $(this).parents('#dis-modal')
    $('body').removeClass('no-overflow')
    $(modal).hide()

    document.location.href = link
  })
})

$('#dis-modal .content').scroll( function() {
  var parent = $(this).parents('#dis-modal')
  var btn = $(parent).find('.accept')

  if ($(this).scrollTop() == $(this)[0].scrollHeight - $(this).height()) {
    $(btn).attr('disabled', false)
  }
})


// document.addEventListener('globo.formbuilder.form.submitting',function(e) {
//   var parent = $('.practitioner-form-wrapper.active').find('.practitioner-pop')
//   var o = $('.practitioner-form-wrapper.active').parents('.modal-practitioners-inner')

//   $('.practitioner-form-wrapper.active .form-con').hide()

//   $(o).addClass('no-overflow')
//   console.log(e)
//   $(parent).show()
// })
