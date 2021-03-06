(function($) {
  var body = $('body'), doc = $(document), html = $('html'), win = $(window),   wrapperOverlaySlt = '.wrap-overlay',  iconNav, dropdownCart,  miniProductList;
    var sidebarCart = $('#sidebar-cart'),
        btnRemove = sidebarCart.find('.btn-remove'),
        sidebarCartNoItems = sidebarCart.find('.cart-empty'),
        sidebarCartHasItems = sidebarCart.find('.mini-products-list'),
        sidebarCartFooter = sidebarCart.find('.cart-footer');


  /* Compare Product */
  var storage = $.localStorage;
  var compare = {};  
  var total_compare = 4;
  if(compare.length > 0)
  {
    if (storage.isSet('compare')) {
      compare = storage.get('compare');
    } else {
      storage.set('compare', {});
    }
  }


  var cookieName = "wishlistList";
  var collsideExist = "collection_sidebar";


  if ($(collsideExist).length > 0) {
    //work only in collection page
    History.Adapter.bind(window, 'statechange', function() {
      var State = History.getState();
      if (!buddha.isSidebarAjaxClick) {
        buddha.sidebarParams();
        var newurl = buddha.sidebarCreateUrl();
        buddha.sidebarGetContent(newurl);
        buddha.reActivateSidebar();
      }
      buddha.isSidebarAjaxClick = false;
    });
  }



      if (window.use_color_swatch) { 
    $('.swatch :radio').change(function() {
      var optionIndex = $(this).closest('.swatch').attr('data-option-index');
      var optionValue = $(this).val();
      $(this)
      .closest('form')
      .find('.single-option-selector')
      .eq(optionIndex)
      .val(optionValue)
      .trigger('change');
    }); 

  }



  $(doc).on("click touchstart", function(n) {           
    var r = $(".quick-view");
    var i = $("#slidedown-cart");
    var s = $("#ToggleDown");
    var o = $("#email-modal .modal-window");

    if (!r.is(n.target) && r.has(n.target).length === 0 && !i.is(n.target) && i.has(n.target).length === 0 && !s.is(n.target) && s.has(n.target).length === 0 && !o.is(n.target) && o.has(n.target).length === 0 ) {
      buddha.closeQuickViewPopup();
    }
  })

  $(doc).keyup(function(n) {
    if (n.keyCode == 27) {
      buddha.closeQuickViewPopup();      
      clearTimeout(buddha.KidsTimeout);
      if ($(".modal").is(":visible")) {
        $(".modal").fadeOut(500)
      }
    }
  });

  doc.ready(function () {
     iconNav = $('[data-menu-mb-toogle]'),
     dropdownCart = $('#slidedown-cart'),
     miniProductList = dropdownCart.find('.mini-products-list');
    buddha.init();
    
     doc     
     .on('shopify:section:load', buddha.initSliderFeaturedProducts)
     .on('shopify:section:unload', buddha.initSliderFeaturedProducts)
     
      .on('shopify:section:load', buddha.initFeaturedProductTabs)
     .on('shopify:section:unload', buddha.initFeaturedProductTabs)
     
     .on('shopify:section:load', buddha.initProductVerticleRow)
     .on('shopify:section:unload', buddha.initProductVerticleRow)
     
     .on('shopify:section:load', buddha.initSlideshow)
     .on('shopify:section:unload', buddha.initSlideshow)
    
     .on('shopify:section:load', buddha.initQuoteSlider)
     .on('shopify:section:unload', buddha.initQuoteSlider)
     
     .on('shopify:section:load', buddha.initBlogSlider)
     .on('shopify:section:unload', buddha.initBlogSlider)
     
     .on('shopify:section:load', buddha.initBrandSlider)
     .on('shopify:section:unload', buddha.initBrandSlider)
     
     
  });

  var winWidth = win.innerWidth();

  win.off('resize.initMenuMobile').on('resize.initMenuMobile', function() {
    var resizeTimerId;

    clearTimeout(resizeTimerId);

    resizeTimerId = setTimeout(function() {
      var curWinWidth = win.innerWidth();

      if ((curWinWidth < 1200 && winWidth >= 1200) || (curWinWidth >= 1200 && winWidth < 1200)) {
        buddha.showHideMenuMobile();
        buddha.initToggleMuiltiLangCurrency();
        buddha.addTextMuiltiOptionActive($('#currencies'), $('#currencies [data-currency].active'), $('[data-currency-label]'));  
        buddha.dropdownCart();
      };
      winWidth = curWinWidth;
    }, 0);
  });





  var buddha = {
    KidsTimeout: null,
    isSidebarAjaxClick: false,
    init: function() {  
      this.showHideMenuMobile();      
      this.closeAllOnMobile();
      this.initToggleSubMenuMobile();
      this.closeHeaderTop();
      this.initQuickView();     
      this.initAddToCart();
      this.initThumbchange();
      this.initlightSlider();
      this.initModal();
      this.initProductAddToCart();     
      this.dropdownCart();  
      this.initWishlist();  
      this.initCompare();    
      this.initRemoveCompare();
      this.initToggleMuiltiLangCurrency();
      this.addTextMuiltiOptionActive($('#currencies'), $('#currencies [data-currency].active'), $('[data-currency-label]'));
      
      this.initProductMoreview();                     
          
      
      this.initelevateZoom();
      this.initShortcode();
     // this.initParallax();
//       this.initScrollTop();         
      this.initHeaderSticky();         
      this.initSidebar();
      this.initColorSwatchGrid();  
      if(body.hasClass('template-collection') || body.hasClass('template-search')) {
      this.initInfiniteScrolling();              
       }       
      this.product_gallery();                    
      this.initNewsLetterPopup();
      if(window.preloader_enable){
        this.preloader();
      }
      this.videoPlay();
      this.sizeChart();
      this.headerAlter();
      this.addEventLookbookModal();
      this.headerToggle();
      this.headerallCollections();     
      if(body.hasClass('template-index') || body.hasClass('template-page') || body.hasClass('template-blog') || body.hasClass('template-product')) {
        this.initSlideshow();      
        this.initSlideGrid();
        this.initQuoteSlider();
        this.initBlogSlider();
        this.initBrandSlider();
        this.initSliderFeaturedProducts();   
        this.initFeaturedProductTabs();
        this.initProductVerticleRow();
      };

      this.realtimeVisitor();
      this.initSoldOutProductShop();
      this.openSearchForm();
      if(body.hasClass('template-product') ) {
        this.changeSwatch('#AddToCartForm .swatch :radio');
        if($('.frequently-bought-together-block').length > 0){
          this.initBundleProducts();        
        }
      }
    },
    
    
    dropdownCart: function () {
            this.closeDropdownCartTranslate();
            this.initDropdownCartMobile();
            this.initDropdownCartDesktop();
            this.checkItemsInDropdownCart();
            this.removeItemDropdownCart();
          // this.initDropDownCart();
        },

        appendDropdownCartForMobile: function () {
            var wrapperTopCart = $('.wrapper-top-cart');

            if (win.innerWidth < 1200) {
                dropdownCart.appendTo(body);
            } else {
                dropdownCart.appendTo(wrapperTopCart);
            }
        },

        closeDropdownCartTranslate: function () {
            buddha.closeTranslate('#slidedown-cart .close-cart', 'cart-show', '#reload_page');
        },
    
     closeTranslate: function (closeElm, classRemove) {
            if ($(closeElm).length) {
                body.off('click.closeCustomer', closeElm).on('click.closeCustomer', closeElm, function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.removeClass(classRemove);
                });
            };
        },

    
    initDropdownCartMobile: function() {
            $(".header-mb, .header-default").find("[data-cart-toggle]").off("click.initDropdownCartMobile").on("click.initDropdownCartMobile", function(e) {              
                e.preventDefault(), e.stopPropagation(), html.toggleClass("cart-show");
            })
        },
    
    

        initDropdownCartDesktop: function () {
            var siteHeader = $('.site-header');
            if (siteHeader.hasClass('header-default')) {
                buddha.appendDropdownCartForMobile();             
            }
        },


        checkItemsInDropdownCart: function () {
            var cartNoItems = dropdownCart.find('.no-items'),
                cartHasItems = dropdownCart.find('.has-items');
          
            

            if (miniProductList.children().length) {
                cartHasItems.show();
                cartNoItems.hide();
              
                sidebarCartNoItems.hide();
                sidebarCartHasItems.show();
                sidebarCartFooter.show();
            } else {
                cartHasItems.hide();
                cartNoItems.show();
              
                sidebarCartNoItems.show();
                sidebarCartHasItems.hide();
                sidebarCartFooter.hide();
            };
        },

        removeItemDropdownCart: function (cart) {
            var btnRemove = dropdownCart.find('.btn-remove');

            btnRemove.off('click.removeCartItem').on('click.removeCartItem', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var productId = $(this).parents('.item').attr('id');
                productId = productId.match(/\d+/g);

                Shopify.removeItem(productId, function (cart) {
                    $("#cart-item-"+productId).remove();
                    $("#sidebar-cart-item-"+productId).remove();
                    buddha.doUpdateDropdownCart(cart);
                    buddha.checkBundleProducts();
                });
            });
        },

        updateDropdownCart: function () {
            Shopify.getCart(function (cart) {
                buddha.doUpdateDropdownCart(cart);
            });
        },

        doUpdateDropdownCart: function (cart) {
          console.log(cart);
          html.toggleClass("cart-show");
            var template = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><a href="javascript:void(0)" title="Remove This Item" class="btn-remove"><svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10 fa-2x"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg></a><a class="product-name" href="{URL}">{TITLE}</a><div class="option"><small>{VARIANT}</small></div><div class="cart-collateral"><span class="qtt">{QUANTITY} X </span><span class="price">{PRICE}</span></div></div></li>';

          $(".ajax-success-modal").find(".ajax_cartCount").text(cart.item_count );
          $(".ajax-success-modal").find(".ajax_cartTotal").html(Shopify.formatMoney(cart.total_price, window.money_format));
          $("#minicart_total").html(Shopify.formatMoney(cart.total_price, window.money_format));          
          $('[data-cart-count]').text(cart.item_count);
          dropdownCart.find('.summary .price').html(Shopify.formatMoney(cart.total_price, window.money_format));
          $('#sidebar-cart').find('.cart-footer .notranslate').html(Shopify.formatMoney(cart.total_price, window.money_format));

            miniProductList.html('');

            if (cart.item_count > 0) {
                for (var i = 0; i < cart.items.length; i++) {
                    var item = template;

                    item = item.replace(/\{ID\}/g, cart.items[i].id);
                    item = item.replace(/\{URL\}/g, cart.items[i].url);
                    item = item.replace(/\{TITLE\}/g, cart.items[i].product_title);
                    item = item.replace(/\{VARIANT\}/g, cart.items[i].variant_title || '');
                    item = item.replace(/\{QUANTITY\}/g, cart.items[i].quantity);
                    item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart.items[i].image, '160x'));
                    item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].price, window.money_format));

                    miniProductList.append(item);
                }

                buddha.removeItemDropdownCart(cart);

                if (buddha.checkNeedToConvertCurrency()) {
                  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#sidebar-cart span.money', 'money_format');
                  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#slidedown-cart span.money', 'money_format');
                  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '.ajax_cartTotal span.money', 'money_format');                   
                }
            }

            buddha.checkItemsInDropdownCart();
        },
    
    
   
     initBrandSlider: function () {
     var brandsSlider = $('[data-brands-slider]');
            brandsSlider.each(function () {
                var self = $(this);                   
                if (self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: self.data('rows'),
                        slidesToScroll: 1,                        
            			dots: window.brand_pagination,
                        infinite: false,                     
                        speed: 800,
                      	arrows: window.brand_navigation,
                        appendArrows: '.brand_nav',
                        prevArrow: '<a class="prev-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>',
                        nextArrow: '<a class="next-arrow"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>',
                        responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 4,
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                }
                            }
                        ]
                    });
                }
            });
    },
    

    
     initSlideshow: function () {
            var slickSlideshow = $('[data-init-slideshow]');

            if (slickSlideshow.length) {
                slickSlideshow.each(function () {
                    var self = $(this);

                    if (self.not('.slick-initialized')) {
                        self.slick({
                            dots: self.data('dots'),
                            slidesToScroll: 1,
                            verticalSwiping: false,
                            fade: self.data('fade'),
                            cssEase: "ease",
                            adaptiveHeight: true,
                            autoplay: self.data('autoplay'),
                            autoplaySpeed: self.data('autoplay-speed'),
                            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                            responsive: [{
                                breakpoint: 1280,
                                settings: {
                                    arrows: false,
                                    dots: self.data('dots'),
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
            };
        },
    
      initSlideGrid: function () {
            var slickSlideshow = $('[data-init-slidegrid]');

            if (slickSlideshow.length) {
                slickSlideshow.each(function () {
                    var self = $(this);
                    if (self.not('.slick-initialized')) {
                        self.slick({
                            dots: self.data('dots'),
                            slidesToScroll: 1,
                            verticalSwiping: false,
                            fade: self.data('fade'),
                            cssEase: "ease",
                            adaptiveHeight: true,
                            autoplay: self.data('autoplay'),
                            autoplaySpeed: self.data('autoplaySpeed'),
                            prevArrow: '<a class="prev-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>',
                            nextArrow: '<a class="next-arrow"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>',
                            responsive: [{
                                breakpoint: 1280,
                                settings: {
                                  
                                  dots: self.data('dots'),
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
            };
        },
    
      
    initSliderFeaturedProducts: function () {
      var ProductSingleRow = $('[data-product-single-row-carousel]');
      var ProductMultiRow = $('[data-product-multi-row-carousel]');     
      ProductSingleRow.each(function () {
        var self = $(this),
            productGrid = self.find('.productLoop').attr('id'),                    
            navid = self.find('.product_loop_nav').attr('id'),
            rowItems = $('#'+productGrid).data('row'),
            colItems = $('#'+productGrid).data('cols');
          if($('#'+productGrid).not('.slick-initialized')) {
            $('#'+productGrid).slick({
              slidesToShow: colItems,
              slidesToScroll: colItems,              
              autoplay: window.grid_hpc_autoplay,              
              speed: 1000,
              infinite: false,
              arrows: window.grid_carousel_navigation,
              dots: window.grid_carousel_pagination,
              appendArrows: $('#' +navid),
              prevArrow: '<a class="prev-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>',
              nextArrow: '<a class="next-arrow"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>',
              responsive: [
                {
                  breakpoint: 1199,
                  settings: {  
                    slidesToShow: colItems - 1,
                    slidesToScroll: colItems - 1,  
                    
                  }
                },
                {
                  breakpoint: 769,
                  settings: {                              
                    slidesToShow: 3,
                    slidesToScroll: 3,  
                  }
                },
                {
                  breakpoint: 569,
                  settings: {                              
                    slidesToShow: 2,
                    slidesToScroll: 1,  
                  }
                }
              ]
            });
          };  
       });
      ProductMultiRow.each(function () {
        var self = $(this),
            productGrid = self.find('.productLoop').attr('id'),                    
            navid = self.find('.product_loop_nav').attr('id'),
            rowItems = $('#'+productGrid).data('row'),
            colItems = $('#'+productGrid).data('cols');
          if($('#'+productGrid).not('.slick-initialized')) {
            $('#'+productGrid).slick({
              slidesToShow: colItems,
              rows: rowItems,                                           
              autoplay: window.grid_hpc_autoplay,                          
              speed: 1000,
              infinite: false,
              arrows: window.grid_carousel_navigation,
              dots: window.grid_carousel_pagination,
              appendArrows: $('#' +navid),
              prevArrow: '<a class="prev-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>',
              nextArrow: '<a class="next-arrow"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>',
              responsive: [
                {
                  breakpoint: 1199,
                  settings: {  
                    slidesToShow: colItems - 1,
                    slidesToScroll: colItems - 1,  
                    
                  }
                },
                {
                  breakpoint: 769,
                  settings: {                              
                    slidesToShow: 3,
                    slidesToScroll: 3,  
                  }
                },
                {
                  breakpoint: 569,
                  settings: {                              
                    slidesToShow: 2,
                    slidesToScroll: 1,  
                  }
                }
              ]
            });
          };            
        
      });
    },
    
    
        initFeaturedProductTabs: function () {
      var ProductSingleRow = $('[data-product-single-row-tab]');
      var ProductMultiRow = $('[data-product-multi-row-tab]');     
      ProductSingleRow.each(function () {
        var self = $(this),
            productGrid = self.find('.tab2.tab-items').attr('id'),                    
            navid = self.find('.product_tab_nav').attr('id'),
            rowItems = $('#'+productGrid).data('row'),
            colItems = $('#'+productGrid).data('cols');
          if($('#'+productGrid).not('.slick-initialized')) {
            $('#'+productGrid).slick({
              slidesToShow: colItems,
              slidesToScroll: colItems,              
              autoplay: window.hptab_autoplay,              
              speed: 1000,
              infinite: false,
              arrows: window.hptab_navigation,
              dots: window.hptab_pagination,
              appendArrows: $('#' +navid),
              prevArrow: '<a class="prev-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>',
              nextArrow: '<a class="next-arrow"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>',
              responsive: [
                {
                  breakpoint: 1199,
                  settings: {  
                     slidesToShow: colItems - 1,
                    slidesToScroll: colItems - 1,  
                    
                  }
                },
                {
                  breakpoint: 769,
                  settings: {                              
                    slidesToShow: colItems - 2,
                    slidesToScroll: colItems - 2,  
                  }
                },
                {
                  breakpoint: 569,
                  settings: {                              
                    slidesToShow: 2,
                    slidesToScroll: 1,  
                  }
                }
              ]
            });
          };  
       });
      ProductMultiRow.each(function () {
        var self = $(this),
            productGrid = self.find('.tab2.tab-items').attr('id'),                    
            navid = self.find('.product_tab_nav').attr('id'),
            rowItems = $('#'+productGrid).data('row'),
            colItems = $('#'+productGrid).data('cols');
          if($('#'+productGrid).not('.slick-initialized')) {
            $('#'+productGrid).slick({
              slidesPerRow: colItems,
              rows: rowItems,                                           
              autoplay: window.hptab_autoplay,                          
              speed: 1000,
              infinite: false,
              arrows: window.hptab_navigation,
              dots: window.hptab_pagination,
              appendArrows: $('#' +navid),
              prevArrow: '<a class="prev-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>',
              nextArrow: '<a class="next-arrow"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>',
              responsive: [
                {
                  breakpoint: 1199,
                  settings: {  
                     slidesToShow: colItems - 1,
                    slidesToScroll: colItems - 1,  
                    
                  }
                },
                {
                  breakpoint: 769,
                  settings: {                              
                    slidesToShow: colItems - 2,
                    slidesToScroll: colItems - 2,  
                  }
                },
                {
                  breakpoint: 569,
                  settings: {                              
                    slidesToShow: 2,
                    slidesToScroll: 1,  
                  }
                }
              ]
            });
          };            
        
      });
    },
    
    
    
    initProductVerticleRow: function () {
      var ProductVerticleRow = $('[data-product-verticle-row-carousel]');
      ProductVerticleRow.each(function () {
        var self = $(this),
            productVGrid = self.attr('id'),               
            Vnavid = self.attr('id'),
            showItems = self.data('show'),
            scrollItems = self.data('scroll');         
        if($('#'+productVGrid).not('.slick-initialized')) {
          $('#'+productVGrid).slick({
            slidesToShow: showItems,
            slidesToScroll: scrollItems,   
            vertical: true,
            verticalSwiping: true,
            autoplay: window.list_hpc_autoplay,              
            speed: 1000,
            infinite: false,
            arrows: window.list_carousel_navigation,
            dots: window.list_carousel_pagination,
            appendArrows: $('#' + Vnavid),
            //   appendArrows: '#navCtrls-test-collection-nav',
            prevArrow: '<a class="prev-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>',
            nextArrow: '<a class="next-arrow"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>',
            responsive: [
              {
                breakpoint: 1199,
                settings: {  
                  slidesToShow: 2,
                  slidesToScroll: 2,
                }
              },
              {
                breakpoint: 967,
                settings: {                              
                  slidesToShow: 2,
                  slidesToScroll: 1,  
                  vertical: false,
                  verticalSwiping: false,
                }
              },
              {
                breakpoint: 569,
                settings: {                              
                  slidesToShow: 1,
                  slidesToScroll: 1,  
                  vertical: false,
                  verticalSwiping: false,
                }
              }
            ]
          });
        };  
      });
    },
    
    
    
    initQuoteSlider: function () {
     var QSlider4 = $('[data-quote-slider2]'),
          quotesNav4 = $('[data-quote-Nav2]'),
          blockSize = $('.quotes-section .quotes-slider').data('count');
      QSlider4.each(function () {
        QSlider4.slick({             
          dots:true,
          slidesToShow: 1,
          slidesToScroll: 1, 
          autoplay:true,
          autoplaySpeed:3000,
          arrows: true,       
          appendArrows: quotesNav4,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
          responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
            }},
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }}
        ]
        });

                }); 

    },
    initBlogSlider: function () {
      var BlogSlider = $('[data-blog-slider1]'),
      BlogNav =$('[data-blog-Nav1]');    
      
      BlogSlider.each(function() {
        var self = $(this);
        if (self.not('.slick-initialized')) {
          self.slick({
            slidesToShow: window.blog_slidestoshow,
            slidesToScroll: 1,            
            dots: window.blog_pagination,
            centerMode: true,
            centerPadding: '0',
            focusOnSelect: true,
            autoplay:window.blog_autoplay,
            arrows: window.blog_navigation,
            appendArrows: BlogNav,
            prevArrow: '<a class="prev-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>',
			nextArrow: '<a class="next-arrow"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>',
            autoplaySpeed:4000,
            responsive: [
              {
                breakpoint: 992,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }},
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }}
            ]
          }); 
        }
      })
    },
   
      openSearchForm: function () {
            var iconSearchSlt = '[data-search-mobile-toggle]',
                wrapperHeader = $('.wrapper-header'),
                formSearch = wrapperHeader.find('.search-form');

            doc.off('click.toggleSearch', iconSearchSlt).on('click.toggleSearch', iconSearchSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.addClass('search-open');
            });

            doc.off('click.hideSearch').on('click.hideSearch', function (e) {
                var searchForm = $('.wrapper-header .search-form .search-bar');

                if (!searchForm.is(e.target) && !searchForm.has(e.target).length) {
                    html.removeClass('search-open');

                    $('.quickSearchResultsWrap').hide();
                }
            });
        },
  

        initZoom: function () {
            var zoomElm = $('.product-img-box [data-zoom]');

            if (win.width() >= 1200) {
                zoomElm.zoom();
            } else {
                zoomElm.trigger('zoom.destroy');
            };
        },
    
      showHideMenuMobile: function () {
        if (iconNav.length && iconNav.is(':visible')) {
          iconNav.off('click.showMenuMobile').on('click.showMenuMobile', function (e) {            
            e.preventDefault();
            e.stopPropagation();
            html.toggleClass('translate-overlay');
            $('.close-menu-mb').toggleClass('menu-open');

            $('.main-menu.jas-mb-style').css({
              "overflow": ""
            });
            $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
          })
        };
      },

    
      closeAllOnMobile: function () {
        body.off('click.close', wrapperOverlaySlt).on('click.close', wrapperOverlaySlt, function (e) {
          e.preventDefault();
          e.stopPropagation();

          html.removeClass('cart-show customer-show sidebar-open options-show');
          $('.close-menu-mb').removeClass('menu-open');

          $('.main-menu.jas-mb-style').css({
            "overflow": ""
          });
          $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
        });
      },
     addEventShowOptions: function() {
            var optionsIconSlt = '[data-show-options]';

            doc.off('click.showOptions', optionsIconSlt).on('click.showOptions', optionsIconSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('options-show');
            });

            buddha.closeTranslate('.lang-currency-groups .close-option', 'options-show');
        },
 initToggleSubMenuMobile: function () {
            var mainMenu = $('.main-menu.jas-mb-style'),
                siteNav = $('.site-nav'),
                iconDropdown = siteNav.find('[data-toggle-menu-mb]');

            iconDropdown.off('click.dropdownMenu').on('click.dropdownMenu', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var curParent = $(this).parent(),
                    curMenu = curParent.next('.sub-menu-mobile');

                if (curMenu.hasClass('sub-menu-open')) {
                    curMenu.removeClass('sub-menu-open');
                } else {
                    curMenu.addClass('sub-menu-open').css({
                        "overflow": ""
                    });
                    mainMenu.animate({
                        scrollTop: 0
                    }, 0);
                    mainMenu.css({
                        "overflow": "hidden"
                    });
                };
            });

            buddha.linkClickToggleSubMenuMobile(mainMenu);
        },
    
            linkClickToggleSubMenuMobile: function (mainMenu) {
            var menuMobile = $('.site-nav .dropdown'),
                iconDropdown = menuMobile.find('[data-toggle-menu-mb]'),
                menuMobileLabel = $('.sub-menu-mobile .menu-mb-title');

            if (iconDropdown.length && iconDropdown.is(':visible')) {
                menuMobile.off('click.current').on('click.current', function (e) {
                    e.stopPropagation();

                    $(this).children('.sub-menu-mobile').addClass('sub-menu-open').css({
                        "overflow": ""
                    });
                    mainMenu.animate({
                        scrollTop: 0
                    }, 0);
                    mainMenu.css({
                        "overflow": "hidden"
                    });
                });

                menuMobile.find('.menu__moblie').on('click', function (e) {
                    e.stopPropagation();
                });

                menuMobileLabel.off('click.closeMenu').on('click.closeMenu', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if($(this).parent().hasClass('bg')) {
                        $(this).parent().parent().removeClass('sub-menu-open');
                    }else {
                        $(this).parent().removeClass('sub-menu-open');
                    };

                    if (!$(this).closest('.menu-lv-2').length) {
                        mainMenu.css({
                            "overflow": ""
                        });
                    };
                })
            };
        },
    sidebarInitToggle: function() {
        var sidebarToggle = $('[data-sidebar]');
      $(".sidebar-button #showTagsFilter").click(function() {        
        $(sidebarToggle).toggleClass("open"), $("html").toggleClass("open-sidebar"), $(".wrap-overlay, .close-sidebar").click(function() {
          $("html").removeClass("open-sidebar"), $(sidebarToggle).removeClass("open")
        })
      });

           if ($(".sidebar-tag").length > 0) {
        $(".sidebar-tag .widget h4 span").click(function() {
          var $title = $(this).parents('.widget');
          if ($title.hasClass('click')) {
            $title.removeClass('click');
          } else {
            $title.addClass('click');
          }

          $(this).parents(".sidebar-tag").find(".widget-content").slideToggle();
        });
      }
    },
    initSoldOutProductShop: function () {
            var soldProduct = $('[data-soldOut-product]');

            if (soldProduct.length) {
                soldProduct.each(function () {
                    var self = $(this);

                    var items = self.data('items').toString().split(","),
                        hours = self.data('hours').toString().split(","),
                        i = Math.floor(Math.random() * items.length),
                        j = Math.floor(Math.random() * hours.length);

                    self.find('.items-count').text(items[i]);
                    self.find('.hours-num').text(hours[j]);
                });
            }
        },
    
    
    initSoldOutProductShop: function () {
            var soldProduct = $('[data-soldOut-product]');

            if (soldProduct.length) {
                soldProduct.each(function () {
                    var self = $(this);

                    var items = self.data('items').toString().split(","),
                        hours = self.data('hours').toString().split(","),
                        i = Math.floor(Math.random() * items.length),
                        j = Math.floor(Math.random() * hours.length);

                    self.find('.items-count').text(items[i]);
                    self.find('.hours-num').text(hours[j]);
                });
            }
        },
   realtimeVisitor: function () {
     if ($('.realTime').length >0) {
    var el = $('.realTime');
          $(function(a){
          var min = 1,
          max = el.find('.counter_real_time').attr('data-counter-max'),
          t=1,
          r=max;
          t=Math.ceil(t),
          r=Math.floor(r);
          var o=Math.floor(Math.random()*(r-t+1))+t,
          n=["1","2","4","3","6","10","-1","-3","-2","-4","-6"],
          h="",e="",l=["10","20","15"],h="",e="",M="";
          setInterval(function(){
          if(h=Math.floor(Math.random()*n.length),e=n[h],o=parseInt(o)+parseInt(e),min>=o){
          M=Math.floor(Math.random()*l.length);
          var a=l[M];o+=a
        }
        if(o<1 || o>max ){
          o=Math.floor(Math.random()*(r-t+1))+t;
        }
        el.find("#number_counter>span").html((parseInt(o)));el.show();
      },parseInt(el.find('.counter_real_time').attr('data-interval-time')))
      });
     }
  },
      closeHeaderTop: function () {
            var headerTopEml = $('.header-top'),
                closeHeaderTopElm = headerTopEml.find('[data-close-header-top]');

            if (closeHeaderTopElm.length && closeHeaderTopElm.is(':visible')) {
                if ($.cookie('headerTop') == 'closed') {
                    headerTopEml.remove();
                };

                closeHeaderTopElm.off('click.closeHeaderTop').on('click.closeHeaderTop', function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    headerTopEml.remove();
                    $.cookie('headerTop', 'closed', {
                        expires: 1,
                        path: '/'
                    });
                });
            };
        },
    initToggleMuiltiLangCurrency: function () {
      var langCurrencyGroups = $('.lang-currency-groups'),
          dropdownGroup = langCurrencyGroups.find('.btn-group'),
          dropdownLabel = dropdownGroup.find('.dropdown-label');

      if (dropdownLabel.length && dropdownLabel.is(':visible')) {
        dropdownLabel.off('click.toggleMuiltiOption').on('click.toggleMuiltiOption', function (e) {
          e.preventDefault();
          e.stopPropagation();

          var selfNextDropdown = $(this).next();

          if (!selfNextDropdown.is(':visible')) {
            dropdownLabel.next('.dropdown-menu').hide();
            selfNextDropdown.slideDown(300);
          } else {
            selfNextDropdown.slideUp(300);
          }
        });

        buddha.hideMuiltiLangCurrency();
      } else {
        dropdownLabel.next('.dropdown-menu').css({
          'display': ''
        });
      };
    },

    hideMuiltiLangCurrency: function () {
      doc.off('click.hideMuiltiLangCurrency').on('click.hideMuiltiLangCurrency', function (e) {
        var muiltiDropdown = $('.lang-currency-groups .dropdown-menu');

        if (!muiltiDropdown.is(e.target) && !muiltiDropdown.has(e.target).length) {
          muiltiDropdown.slideUp(300);
        }
      });
    },
    addTextMuiltiOptionActive: function (SltId, dataSlt, label) {
      if (label.length && label.is(':visible')) {
        var item = dataSlt.html();

        SltId.prev(label).html(item);
      };
    },


    headerToggle: function() {      
      $(".header-account_links ul").on("click", ".init", function() {
        $(this).closest(".header-account_links ul").children('li:not(.init)').toggle();
      });

      var allOptions = $(".header-account_links ul").children('li:not(.init)');
      $(".header-account_links ul").on("click", "li:not(.init)", function() {
        allOptions.removeClass('selected');
        $(this).addClass('selected');
        $(".header-account_links ul").children('.init').html($(this).html());
        allOptions.toggle();
      });
      buddha.activeArrow();
    },
    headerallCollections: function() {     
      $(".header-all--collections ul").on("click", ".init", function() {
        $(this).closest(".header-all--collections ul").children('li:not(.init)').toggle();
      });

      var allOptions = $(".header-all--collections ul").children('li:not(.init)');
      $(".header-all--collections ul").on("click", "li:not(.init)", function() {
        allOptions.removeClass('selected');
        $(this).addClass('selected');
        $(".header-all--collections ul").children('.init').html($(this).html());
        allOptions.toggle();
      });
      buddha.activeArrow();

    },
    activeArrow: function() {
      $('.init').click(function() {
        if($(this).hasClass('active')) {       
          $(this).removeClass('active');
        }
        else{
          $(this).addClass('active');
        }
      });
    },


    addEventLookbookModal: function () {      
      $( '[data-lookbook-icon]' ).on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        var handle = $(this).data('handle'),
            position = $(this);

        buddha.doAjaxAddLookbookModal(handle, position);  
        $( '[data-close-lookbook-modal], .ajax-lookbook-modal .overlay'  ).on('click', function() {
          //doc.off('click.closeLookbookModal').on('click.closeLookbookModal', '[data-close-lookbook-modal], .ajax-lookbook-modal .overlay', function () {
          buddha.closeLookbookModal();
          return false;
        });
      });
    },
    doAjaxAddLookbookModal: function (handle, position) {
      var offSet = $(position).offset(),
          top = offSet.top,
          left = offSet.left,
          iconWidth = position.innerWidth(),
          innerLookbookModal = $('.ajax-lookbook-modal').innerWidth(),
          str3 = iconWidth + "px",
          str4 = innerLookbookModal + "px",
          newtop,
          newleft;

      if (window.innerWidth > 767) {
        if (left > (innerLookbookModal + 31)) {
          newleft = "calc(" + left + "px" + " - " + str4 + " + " + "2px" + ")";
        } else {
          newleft = "calc(" + left + "px" + " + " + str3 + " - " + "2px" + ")";
        }

        newtop = top - (innerLookbookModal / 2) + "px";
      } else {
        newleft = 0;
        newtop = top - 30 + "px";
      };

      if (buddha.isAjaxLoading) return;

      $.ajax({
        type: "get",
        url: '/products/' + handle + '?view=json',

        success: function (data) {
          $('.ajax-lookbook-modal').css({
            'left': newleft,
            'top': newtop
          });

          $('.ajax-lookbook-modal .lookbook-content').html(data);

          $('.ajax-lookbook-modal').fadeIn(500);
        },

        error: function (xhr, text) {
          $('.ajax-error-message').text(e.parseJSON(xhr.responseText).description);

          buddha.showModal('.ajax-error-modal');
        }
      });
    },
    closeLookbookModal: function() {
      $(".ajax-lookbook-modal").fadeOut(500);
    },

    videoPlay: function() { 
      if ( $( '.p-video' ).length > 0 ) {
        $( '.jas-popup-url' ).magnificPopup({
          disableOn: 0,
          tLoading: '<div class="loader"><div class="loader-inner"></div></div>',
          type: 'iframe'
        });
      }
    },
    sizeChart: function() {
      var sizeChart_class = $('.size-chart-open-popup');
      if ( sizeChart_class.length ) {
        $(sizeChart_class).magnificPopup({
          type:'inline',
          midClick: true
        });
      }
    },

    headerAlter: function() { 
      var header_13 = $('.header-type-13');       
      if ( header_13.length ) {          
        $( '.nav-menu-icon' ).on('click', function() {
          $('.menu-item-depth-0').each(function(i){
            var menuitem = $(this);
            setTimeout(function() {
              menuitem.toggleClass('menu-item-show');
            }, 100*i);
          });
          $(this).find('span').each(function(i){
            var iconitem = $(this);
            setTimeout(function() {
              iconitem.toggleClass('animate-icon');
            }, 100*i);  
          });
          $('.nav-bar-mobile').toggleClass('nav-show');
        });    
      }
    },

    preloader: function() { 
      $(window).load(function() { 
        var loader = $( '.se-pre-con' );
        if ( loader.length ) {
          $( window ).on( 'beforeunload', function() {
            loader.fadeIn( 500, function() {
              loader.children().fadeIn( 100 )
            });
          });
          loader.fadeOut(1500 );
          loader.children().fadeOut();
        }
      });
    },
    product_gallery: function() { 
      var product_gallery = $( '.product_gallery' );        
      if ( product_gallery.length ) {
        $(product_gallery).not('.slick-initialized').slick({ 
          slidesToShow: 1,
          dots: false,
          arrows: true
        });
      }
    },     

    initColorSwatchGrid: function() { 
      jQuery('.item-swatch li label').click(function(){                                   
        var newImage = jQuery(this).parent().find('.swatchimg').attr('img');
        jQuery(this).parents('.item-row').find('.featured-image').attr({ src: newImage }); 
        return false;
      });
    },



    initHeaderSticky: function(){
      if(window.use_sticky){
        var w = window.innerWidth;

        $(".header-sticky").sticky({topSpacing:0, zIndex: '999'});
        var headerH = $('.header-sticky').height();
        $(document).bind('ready scroll', function() {
          var docScroll = $(document).scrollTop();
          if(docScroll >= headerH) {
            if (!$('#header-landing').hasClass('header-animate')) {
              $('#header-landing').addClass('header-animate').css({ top: '-155px' }).stop().animate({ top: 0 }, 500);
            }
          } else {
            $('#header-landing').removeClass('header-animate').removeAttr('style');
          }
        });

      }
    },

//     initScrollTop: function(){
//       $().UItoTop({ easingType: 'easeOutQuart' });
//     },

    initParallax: function() {        
      $('.parallax').each(function(){
        $(this).bind('inview', function (event, visible) {
          if(visible == true) {
            $(this).parallax("50%", 0.3);
          } else {
            $(this).css('background-position','');
          }
        });
      });     

    },


    initNewsLetterPopup: function() {
      if (window.newsletter_popup) {
        var k = $("[data-newsletter]"), closebtn = k.find(".close-window"), i = k.find(".window-content");
        modalContent = k.find(".ajax-modal-content"), "closed" != $.cookie("emailSubcribeModal") && (buddha.setTimeout = setTimeout(function() {
          buddha.openEmailModalWindow(k)
        }, 500)), closebtn.click(function(closebtn) {
          closebtn.preventDefault(), buddha.closeEmailModalWindow(k)
        }), k.on("click", function(closebtn) {
          i.is(closebtn.target) || i.has(closebtn.target).length || buddha.closeEmailModalWindow(k)
        }), $("#mc_embed_signup form").submit(function() {
          "" != $("#mc_embed_signup .mail").val() && buddha.closeEmailModalWindow(k)
          $(".newsletter-success-modal").find(".ajax-modal-content").show();
          buddha.showModal(".newsletter-success-modal");

        })
      }
    },





    openEmailModalWindow: function(t) {
      $('.newsletterwrapper').fadeIn(500)
    },
    closeEmailModalWindow: function(t) {
      $('.newsletterwrapper').fadeOut(500),
        $.cookie("emailSubcribeModal", "closed", {
        expires: 1,
        path: "/"
      })
    },
    initShortcode: function() {
      $('.dt-sc-toggle').toggle(function(){ $(this).addClass('active'); },function(){ $(this).removeClass('active'); });
      $('.dt-sc-toggle').click(function(){ $(this).next('.dt-sc-toggle-content').slideToggle(); });
      $('.dt-sc-toggle-frame-set').each(function(){
        var $this = $(this),
            $toggle = $this.find('.dt-sc-toggle-accordion');

        $toggle.click(function(){
          if( $(this).next().is(':hidden') ) {
            $this.find('.dt-sc-toggle-accordion').removeClass('active').next().slideUp();
            $(this).toggleClass('active').next().slideDown();
          }
          return false;
        });

        //Activate First Item always
//         $this.find('.dt-sc-toggle-accordion:first').addClass("active");
//         $this.find('.dt-sc-toggle-accordion:first').next().slideDown();
      });/* Toggle Shortcode end*/

      //TABS...
      if($('ul.tabs').length > 0) {
        $('ul.tabs').tabs('> .dt-sc-tabs_content');
      }

      if($('ul.dt-sc-tabs-frame').length > 0){
        $('ul.dt-sc-tabs-frame').tabs('> .dt-sc-tabs-frame-content');
      }

      if($('ul.tabs').length > 0) {
        $('ul.tabs').tabs('> .dt-sc-tabs_content');
      }

      if($('.dt-sc-tabs').length > 0) {
        $('.dt-sc-tabs').tabs('> .dt-sc-tabs-content');
      }

      if($('.dt-sc-tabs-vertical-frame').length > 0){ 
        $('.dt-sc-tabs-vertical-frame').tabs('> .dt-sc-tabs-vertical-frame-content');   
        $('.dt-sc-tabs-vertical-frame').each(function(){
          $(this).find("li:first").addClass('first').addClass('current');
          $(this).find("li:last").addClass('last');
        });   
        $('.dt-sc-tabs-vertical-frame li').click(function(){
          $(this).parent().children().removeClass('current');
          $(this).addClass('current');
        });   
      }  
    },



    initWishlist: function() {
      buddha.updateWishlistButtons()
      buddha.initWishlistButtons()
    },



    initWishlistButtons: function() {
      if($(".add-in-wishlist-js").length == 0) {
        return false;
      }
      $(".add-in-wishlist-js").each(function(){
        $(this).unbind();
        $(this).click(function(event){
          
          event.preventDefault();
          try
          {
            var id = $(this).attr('href');
            if($.cookie(cookieName) == null) {
              var str = id;
            } else {
              if($.cookie(cookieName).indexOf(id) == -1) {
                var str = $.cookie(cookieName) + '__' + id;
              }
            }
            $.cookie(cookieName, str, {expires:14, path:'/'});
            jQuery('.loadding-wishbutton-'+id).show();
            jQuery('.default-wishbutton-'+id).remove();
            setTimeout(function(){ jQuery('.loadding-wishbutton-'+id).remove(); jQuery('.added-wishbutton-'+id).show(); }, 2000);
            $(this).unbind();
          }
          catch (err) {} // ignore errors reading cookies
        })
      });
    },


    updateWishlistButtons: function() {
      try
      {
        if($.cookie(cookieName) != null && $.cookie(cookieName) != '__' && $.cookie(cookieName) != '') {
          var str = String(e.cookie(cookieName)).split("__");
          for (var i=0; i<str.length; i++) {
            if (str[i] != '') {
              jQuery('.added-wishbutton-'+str[i]).show();
              jQuery('.default-wishbutton-'+str[i]).remove();
              jQuery('.loadding-wishbutton-'+str[i]).remove();

            }
          }
        }
      }
      catch (err) {}
    },

    initelevateZoom: function() {
      $("#product-featured-image").length > 0 && ($(".visible-phone").is(":visible") ? ($("#product-featured-image").elevateZoom({
        gallery: "ProductThumbs",
        cursor: "pointer",
        galleryActiveClass: "active",
        imageCrossfade: !1,
        scrollZoom: false,
        onImageSwapComplete: function() {
          $(".zoomWrapper div").hide()
        },
        loadingIcon: window.loading_url
      }), $("#product-featured-image").bind("click", function() {
        return !1
      })) : ($("#product-featured-image").elevateZoom({
        gallery: "ProductThumbs",
        cursor: "pointer",
        galleryActiveClass: "active",
        imageCrossfade: !0,
        scrollZoom: false,
        onImageSwapComplete: function() {
          $(".zoomWrapper div").hide()
        },
        loadingIcon: window.loading_url
      }), $("#product-featured-image").bind("click", function() {
        var i = $("#product-featured-image").data("elevateZoom");
        return $.fancybox(i.getGalleryList({})), !1
      })))
    },


    initelevateZoomInner: function() {
      $("#product-featured-image").length > 0 && ($(".visible-phone").is(":visible") ? ($("#product-featured-image").elevateZoom({
        gallery: "ProductThumbs",
        cursor: "pointer",
        galleryActiveClass: "active",
        imageCrossfade: !1,
        scrollZoom: false,
        onImageSwapComplete: function() {
          $(".zoomWrapper div").hide()
        },
        loadingIcon: window.loading_url
      }), $("#product-featured-image").bind("click", function() {
        return !1
      })) : ($("#product-featured-image").elevateZoom({
        gallery: "ProductThumbs",              
        galleryActiveClass: "active",              
        zoomType: 'inner',
        cursor: 'crosshair',
        onImageSwapComplete: function() {
          $(".zoomWrapper div").hide()
        },
        loadingIcon: window.loading_url
      }), $("#product-featured-image").bind("click", function() {              
        return !1
      })))

    },

    initProductMoreview: function() {
      if ($('.more-view-vertical').length > 0) {
        this.initverticalMoreview();
      } 
      else
      {
      this.initOwlMoreview();
      }
    },


   /*  initProductMoreviewNew: function (productMoreview) {
            var sliderFor = productMoreview.find('.slider-for'),
                sliderNav = productMoreview.find('.slider-nav'),
                vertical = sliderNav.data('vertical');

            if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
                sliderFor.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    asNavFor: sliderNav,
                    adaptiveHeight:true
                });

                sliderNav.slick({
                    infinite: true,
                    slidesToShow: sliderNav.data('rows'),
                    vertical: vertical,
                    slidesToScroll: 1,
                    asNavFor: sliderFor,
                    focusOnSelect: true,
                    nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
                    prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
                    responsive: [{
                            breakpoint: 1200,
                            settings: {
                                get dots() {
                                    if (vertical == true) {
                                        return dots = true;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = true;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = true;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 360,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = true;
                                    }
                                },
                            }
                        }
                    ]
                });
            };

            if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch) {
                var swatch = productMoreview.closest('[data-more-view-product]').siblings('.product-shop').find('.swatch'),
                    swatchColor = swatch.find('.swatch-element.color'),
                    inputChecked = swatchColor.find(':radio:checked');

                if(inputChecked.length) {                  
                    var className = inputChecked.data('filter');
                    if(className !== undefined) {
                        sliderNav.slick('slickUnfilter');
                        sliderFor.slick('slickUnfilter');           
                        if(sliderNav.find(className).length && sliderFor.find(className).length) {                          
                            sliderNav.slick('slickFilter', className).slick('refresh');
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    };
                };
            }
        },
*/
    

    initverticalMoreview: function() {
      var e = $(".slider-for"), i = $(".slider-nav");

      if (e.hasClass("slick-initialized") || i.hasClass("slick-initialized") || (e.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: !1,
        fade: !0,
        asNavFor: i
     
      }), i.slick({
        infinite: !0,
        slidesToShow: 4,
        vertical: true,        
        slidesToScroll: 1,
        asNavFor: e,
        focusOnSelect: !0,  
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
         responsive: [

           {
             breakpoint: 992,
             settings: {
               slidesToShow: 3,
               slidesToScroll: 1,               
             }
           },
           
           {
             breakpoint: 767,
             settings: {
               slidesToShow: 3,
               slidesToScroll: 1,
               vertical: false,        
             }
           }
         ]


      })), 
          "variant_grouped" === window.color_swatch_style && window.use_color_swatch) {

      }

    },


    
    initOwlMoreview: function() {
      var e = $(".slider-for"), i = $(".slider-nav");
      if (e.hasClass("slick-initialized") || i.hasClass("slick-initialized") || (e.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: !1,
        fade: !0,
        asNavFor: i
      }), i.slick({
        infinite: !0,
        slidesToShow: 5,
        vertical: false,        
        slidesToScroll: 1,
        asNavFor: e,
        focusOnSelect: !0,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
         responsive: [

           {
             breakpoint: 992,
             settings: {
               slidesToShow: 3,
               slidesToScroll: 1,               
             }
           },
           {
             breakpoint: 768,
             settings: {
               slidesToShow: 5,
               slidesToScroll: 1,
             }
           },
           {
             breakpoint: 480,
             settings: {
               slidesToShow: 3,
               slidesToScroll: 1,
             }
           }
         ]

      
      })), 
          "variant_grouped" === window.color_swatch_style && window.use_color_swatch) {

      }

    },

            changeSwatch: function (swatchSlt) {
            doc.on('change', swatchSlt, function () {
                var className = $(this).data('filter');
                var optionIndex = $(this).closest('.swatch').attr('data-option-index');
                var optionValue = $(this).val();

                $(this)
                    .closest('form')
                    .find('.single-option-selector')
                    .eq(optionIndex)
                    .val(optionValue)
                    .trigger('change');

                if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch && className !== undefined) {
                    var productShop = $(swatchSlt).closest('.product-shop');

                    if(productShop.closest('.product-slider').length) {
                        var productImgs = productShop.closest('.product-slider').find('[data-moreview-product-slider]'),
                            sliderFor = productImgs.find('.slider-for');

                        sliderFor.slick('slickUnfilter');

                        if(sliderFor.find(className).length) {
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        
                        }
                    }else {
                        var productImgs = productShop.prev('[data-more-view-product]');

                        if(productImgs.length) {
                            var sliderNav = productImgs.find('.slider-nav'),
                                sliderFor = productImgs.find('.slider-for');

                            sliderNav.slick('slickUnfilter');
                            sliderFor.slick('slickUnfilter');

                            if(sliderNav.find(className).length && sliderFor.find(className).length) {
                                sliderNav.slick('slickFilter', className).slick('refresh');
                                sliderFor.slick('slickFilter', className).slick('refresh');
                        
                            }
                        }
                    }

                }
            });
        },

    initProductWishlist: function() {
      $(".product-single button.wishlist").click(function(n) {
        n.preventDefault();
        var r = $(this).parent();
        var i = r.parents(".grid-item");
        e.ajax({
          type: "POST",
          url: "/contact",
          data: r.serialize(),
          beforeSend: function() {
            buddha.showLoading()
          },
          success: function(n) {
            buddha.hideLoading();                  
            var o = $("#product-featured-image").attr("src");
            var wp = $(".product-single__title").text();
            var wamt = $(".product-single__price .grid-link__org_price span.money").text();   

            $(".ajax-success-modal").find(".added-to-wishlist").show();
            $(".ajax-success-modal").find(".added-to-cart").hide();
            $(".ajax-success-modal").find(".ajax-product-image").attr("src", o);    
            $(".ajax-success-modal").find(".ajax-product-title").text(wp);
            $(".ajax-success-modal").find(".ajax_price").text(wamt);
            //e(".ajax-success-modal").find(".ajax_qty").text(wamt);


            buddha.showModal(".ajax-success-modal")
          },
          error: function(n, r) {
            buddha.hideLoading();
            $(".loading-modal").hide();
            $(".ajax-error-message").text(e.parseJSON(n.responseText).description);
            buddha.showModal(".ajax-error-modal")
          }
        })
      })
    },

    showModal: function(n) {
      $(n).fadeIn(500);
      buddha.KidsTimeout = setTimeout(function() {
        $(n).fadeOut(500)
      }, 5e3)
    },
    checkItemsInDropdownCart: function() {
      if ($("#slidedown-cart .mini-products-list").children().length > 0) {
        $("#slidedown-cart .no-items").hide();
        $("#slidedown-cart .has-items").show()
      } else {
        $("#slidedown-cart .has-items").hide();
        $("#slidedown-cart .no-items").show()
      }
    },
    initModal: function() {
      $(".continue-shopping").click(function() {
        clearTimeout(buddha.KidsTimeout);
        $(".ajax-success-modal").fadeOut(500)
      });
      $(".close-modal, .overlay").click(function() {
        clearTimeout(buddha.KidsTimeout);
        $(".ajax-success-modal, .compare_modal").fadeOut(500)
      })
    },
    

    initProductAddToCart: function() {
      if ($("#AddToCart").length > 0) {
        $("#AddToCart").click(function(n) {
          n.preventDefault();
          if ($(this).attr("disabled") != "disabled") {
            if (!window.ajax_cart) {
              $(this).closest("form").submit()
            } else {
              var r = $("#AddToCartForm select[name=id]").val();
              if (!r) {
                r = $("#AddToCartForm input[name=id]").val()
              }
              var i = $("#AddToCartForm input[name=quantity]").val();
              if (!i) {
                i = 1
              }                          

              
              var o = $('.slick-current img[id|="product-featured-image"]').attr("src"); 
              
              var p = $(".product-single__title").text();
              var amt = $(".product_single_price .grid-link__org_price span.money").text();      
              
              buddha.doAjaxAddToCart(r, i, o, p, amt)
            }
          }
          return false
        })
      }
    },
    initlightSlider: function() {
      if ($(".vertical").length > 0) {
        $('.vertical').lightSlider({      
          item:3,
          loop:false,
          slideMove:1,
          easing: 'linear',
          pager: false,
          speed:600,
          vertical:true,
          // currentPagerPosition: 'middle',
          verticalHeight:170,
          vThumbWidth:70,

          responsive : [
            {
              breakpoint:800,
              settings: {
                item:3,
                slideMove:1,
                slideMargin:4,                  
              }
            },
            {
              breakpoint:480,
              settings: {
                item:2,
                slideMove:1
              }
            }
          ]
        });  
      } 
    },

    initThumbchange: function() {
      if ($(".thumb_items img").length > 0) {
        $(".thumb_items img").click(function(n) {
          n.preventDefault();                  
          var r = $(this).parents(".item-row");
          var i = $(r).attr("id");                                  
          var photo_fullsize =  $(this).attr('src');               
          $(r).find(".grid-link img").attr('src', photo_fullsize); 

        })
        //return false
      }
    },

    

    initAddToCart: function() {
      if ($(".add-cart-btn").length > 0) {
        $(".add-cart-btn").click(function(n) {
          n.preventDefault();
          if ($(this).attr("disabled") != "disabled") {
            var r = $(this).parents(".item-row");
            var i = $(r).attr("id");
            i = i.match(/\d+/g);
            if (!window.ajax_cart) {
              $("#cart-form-" + i).submit()
            } else {
              var s = $("#cart-form-" + i + " select[name=id]").val();                          
              if (!s) {
                s = $("#cart-form-" + i + " input[name=id]").val()
              }                          
              var o = $("#cart-form-" + i + " select[name=quantity]").val();
              if (!o) {
                o = 1
              }
             
              var a = $(r).find(".featured-image").attr("src");
              var p = $(r).find(".grid-link__title").text();
              var amt = $(r).find(".grid-link__meta .product_price .grid-link__org_price span.money").text();                         
              buddha.doAjaxAddToCart(s, o, a, p, amt)
            }
          }
          return false
        })
      }
    },
    showLoading: function() {
      $(".loading-modal").show()
    },
    hideLoading: function() {
      $(".loading-modal").hide()
    },
    doAjaxAddToCart: function(n, r, a, p, amt) {
      $.ajax({
        type: "post",
        url: "/cart/add.js",
        data: "quantity=" + r + "&id=" + n,
        dataType: "json",
        beforeSend: function() {
          buddha.showLoading()
        },
        success: function(n) {
          buddha.hideLoading();                    
          // // buddha.showModal(".ajax-success-modal");
          // $(".ajax-success-modal").find(".ajax-product-image").attr("src", a);
          // $(".ajax-success-modal").find(".added-to-wishlist").hide();
          // $(".ajax-success-modal").find(".added-to-cart").show();
          // $(".ajax-success-modal").find(".ajax-product-title").text(p);
          // $(".ajax-success-modal").find(".ajax_price").text(amt);
          // $(".ajax-success-modal").find(".ajax_qty").text(r);

          buddha.updateDropdownCart()
        },
        error: function(n, r) {
          buddha.hideLoading();
          $(".ajax-error-message").text(e.parseJSON(n.responseText).description);
          buddha.showModal(".ajax-error-modal")
        }
      })
    },
    initQuickView: function() {
      $(".quick-view-text").click(function() {
        $('.quick-view').addClass('open-in');  
        var product = $(this).attr("id");
        Shopify.getProduct(product, function(product) {
          var r = $("#quickview-template").html();
          $(".quick-view").html(r);
          var i = $(".quick-view");
          var s = product.description.replace(/(<([^>]+)>)/ig, "");
          s = s.split(" ").splice(0, 30).join(" ") + "...";
          i.find(".product-title a").text(product.title);
          i.find(".product-title a").attr("href", product.url);  
          
          
          i.find(".price").html(Shopify.formatMoney(product.price, window.money_format));
          i.find(".product-item").attr("id", "product-" + product.id);
          i.find(".variants").attr("id", "product-actions-" + product.id);
          i.find(".variants select").attr("id", "product-select-" + product.id);
          if (product.compare_at_price > product.price) {
            i.find(".compare-price").html(Shopify.formatMoney(product.compare_at_price_max, window.money_format)).show();
            i.find(".price").addClass("on-sale")
          } else {
            i.find(".compare-price").html("");
            i.find(".price").removeClass("on-sale")
          }
          if (!product.available) {
            i.find("select, input, .product_price, .total-price, .dec, .inc, .variants label").remove();
            i.find(".add-to-cart-btn").text("Unavailable").addClass("disabled").attr("disabled", "disabled");                        
          } else {
            i.find(".product_price div.price").html(Shopify.formatMoney(product.price, window.money_format));     
            i.find(".total-price span").html(Shopify.formatMoney(product.price, window.money_format));                        
            if (window.use_color_swatch) {                        
              buddha.createQuickViewVariantsSwatch(product, i);
            } else {
              buddha.createQuickViewVariants(product, i);
            }

          }
          i.find(".button").on("click", function() {
            var n = i.find(".quantity").val(),
                r = 1;
            if ($(this).text() == "+") {
              r = parseInt(n) + 1
            } else if (n > 1) {
              r = parseInt(n) - 1
            }
            i.find(".quantity").val(r);
            if (i.find(".total-price").length > 0) {
              buddha.updatePricingQuickview();
            }
          });

          buddha.loadQuickViewSlider(product, i);
          buddha.initQuickviewAddToCart();
          $(".quick-view").fadeIn(500);

          if ($('.quick-view .total-price').length > 0) {
            $('.quick-view input[name=quantity]').on('change', buddha.updatePricingQuickview);
          }
        });
        return false


        if (window.show_multiple_currencies && window.shop_currency != jQuery("#currencies").val())
        {

          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#sidebar-cart span.money', 'money_format');
          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#slidedown-cart span.money', 'money_format');
        }

      });             
      $(document).on("click",".quick-view .overlay, .close-window", function() {              
        buddha.closeQuickViewPopup();
        $('.quick-view').removeClass("open-in");
        $('.quick-view').removeClass("option-loader");               
        return false
      })

    },



    updatePricingQuickview: function() {
      //try pattern one before pattern 2
      var regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;
      var unitPriceTextMatch = $('.quick-view .price').text().match(regex);

      if (!unitPriceTextMatch) {
        regex = /([0-9]+[.|,][0-9]+)/g;
        unitPriceTextMatch = $('.quick-view .price').text().match(regex);
      }

      if (unitPriceTextMatch) {
        var unitPriceText = unitPriceTextMatch[0];
        var unitPrice = unitPriceText.replace(/[.|,]/g, '');
        var quantity = parseInt($('.quick-view input[name=quantity]').val());
        var totalPrice = unitPrice * quantity;

        var totalPriceText = Shopify.formatMoney(totalPrice, window.money_format);
        regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;     
        if (!totalPriceText.match(regex)) {
          regex = /([0-9]+[.|,][0-9]+)/g;
        } 
        totalPriceText = totalPriceText.match(regex)[0];

        var regInput = new RegExp(unitPriceText, "g");
        var totalPriceHtml = $('.quick-view #QProductPrice').html().replace(regInput, totalPriceText);

        $('.quick-view .total-price span').html(totalPriceHtml);
      }
    },




    initQuickviewAddToCart: function() {
      if ($(".quick-view .add-to-cart-btn").length > 0) {
        $(".quick-view .add-to-cart-btn").click(function() {
          var n = $(".quick-view select[name=id]").val();
          if (!n) {
            n = $(".quick-view input[name=id]").val()
          }
          var r = $(".quick-view input[name=quantity]").val();
          if (!r) {
            r = 1
          }
          var p = $('.quick-view .product-title a').html();
          var a = $(".quick-view .quickview-featured-image img").attr("src");                 
          buddha.doAjaxAddToCart(n, r, a, p);
          buddha.closeQuickViewPopup();
          $('.quick-view').removeClass("open-in");
          $('.quick-view').removeClass("option-loader");
        })
      }
    },
    updateDropdownCart: function() {
      Shopify.getCart(function(cart) {
        buddha.doUpdateDropdownCart(cart)
      })
    },

    checkNeedToConvertCurrency: function() {
      return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency
    },
 loadQuickViewSlider: function(product, r) {
            var s = Shopify.resizeImage(product.featured_image, "grande");
            r.find(".quickview-featured-image").append('<a href="' + product.url + '"><img src="' + s + '" title="' + product.title + '"/><div style="height: 100%; width: 100%; top:0px; left:0px;right:0; z-index: 2000; position: absolute; display: none; background: url(' + window.loading_url + ') 50% 50% no-repeat;"></div></a>');
            if (product.images.length > 1) {
                var o = r.find(".more-view-wrapper ul");
                for (i in product.images) {
                    var u = Shopify.resizeImage(product.images[i], "grande");
                    var a = Shopify.resizeImage(product.images[i], "medium");
                    var f = '<li><a href="javascript:void(0)" data-image="' + u + '"><img src="' + a + '"  /></a></li>';
                    o.append(f)
                }
                o.find("a").click(function() {
                    var t = r.find(".quickview-featured-image img");
                    var product = r.find(".quickview-featured-image div");
                    if (t.attr("src") != $(this).attr("data-image")) {
                        t.attr("src", $(this).attr("data-image"));
                        product.show();
                        t.load(function(t) {
                            product.hide();
                            $(this).unbind("load");
                            product.hide()
                        })
                    }
                });
               
                 if (o.hasClass("quickview-more-views-owlslider")) {
                    buddha.initQuickViewMoreview(o)
                } else {
                    buddha.initQuickViewMoreview(o)
                }
              
            } else {
             
                r.find(".more-view-wrapper").remove();
               
            } 
        },
    initQuickViewMoreview: function(q) {
      if (q) {
        q.slick({          
          slidesToScroll: 1,
          slidesToShow: 4,
          dots: false,
          arrows: true,   
          infinite: false,
          speed: 800,
         // appendArrows: '.quick-view-carousel',
          nextArrow: '<button type="button" class="slick-next"><i class="fa fa-chevron-right"></i></button>',
          prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-chevron-left"></i></button>'
           
                        
        });
      }

    },


    convertToSlug: function(e) {
      return e.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    },
    createQuickViewVariantsSwatch: function(product, quickviewTemplate) {
      if (product.variants.length > 1) { //multiple variants
        for (var i = 0; i < product.variants.length; i++) {
          var variant = product.variants[i];
          var option = '<option value="' + variant.id + '">' + variant.title + '</option>';
          quickviewTemplate.find('form.variants > select').append(option);
        }
        new Shopify.OptionSelectors("product-select-" + product.id, {
          product: product,
          onVariantSelected: selectCallbackQuickview
        });

        //start of quickview variant;
        var filePath = window.file_url.substring(0, window.file_url.lastIndexOf('?'));
        var assetUrl = window.asset_url.substring(0, window.asset_url.lastIndexOf('?'));
        var options = "";
        for (var i = 0; i < product.options.length; i++) {
          options += '<div class="swatch clearfix" data-option-index="' + i + '">';
          options += '<div class="header">' + product.options[i].name + ' :' + '</div>';
          options += '<div class="swatch-section">';
          var is_color = false;
          if (/Color|Colour/i.test(product.options[i].name)) {
            is_color = true;
          }
          var optionValues = new Array();
          for (var j = 0; j < product.variants.length; j++) {
            var variant = product.variants[j];
            var value = variant.options[i];
            var valueHandle = this.convertToSlug(value);
            var forText = 'swatch-' + i + '-' + valueHandle;
            if (optionValues.indexOf(value) < 0) {
              //not yet inserted
              options += '<div data-value="' + value + '" class="swatch-element ' + (is_color ? "color" : "") + valueHandle + (variant.available ? ' available ' : ' soldout ') + '">';

              if (is_color) {
                options += '<div class="tooltip">' + value + '</div>';
              }
              options += '<input id="' + forText + '" type="radio" name="option-' + i + '" value="' + value + '" ' + (j == 0 ? ' checked ' : '') + (variant.available ? '' : ' disabled') + ' />';
              if (is_color) {
                options += '<label for="' + forText + '" style="background-color: ' + valueHandle + '; background-image: url(' + filePath + valueHandle + '.png)"></label>';
              } else {
                options += '<label for="' + forText + '">' + value + '</label>';
              }
              options += '</div>';
              if (variant.available) {
                $('.quick-view .swatch[data-option-index="' + i + '"] .' + valueHandle).removeClass('soldout').addClass('available').find(':radio').removeAttr('disabled');
              }
              optionValues.push(value);
            }
          }
          options += '</div></div>';
        }
        quickviewTemplate.find('form.variants > select').after(options);
        quickviewTemplate.find('.swatch :radio').change(function() {
          var optionIndex = $(this).closest('.swatch').attr('data-option-index');
          var optionValue = $(this).val();
          $(this)
          .closest('form')
          .find('.single-option-selector')
          .eq(optionIndex)
          .val(optionValue)
          .trigger('change');
        });
        if (product.available) {
          Shopify.optionsMap = {};
          Shopify.linkOptionSelectors(product);
        }

        //end of quickview variant
      } else { //single variant
        quickviewTemplate.find('form.variants > select').remove();
        var variant_field = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';
        quickviewTemplate.find('form.variants').append(variant_field);
        if (window.show_multiple_currencies && window.shop_currency != jQuery("#currencies").val())
        {
          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), "span.money", "money_format")
        }
      }
    },
    createQuickViewVariants: function(t, product) {
      if (t.variants.length > 1) {
        for (var r = 0; r < t.variants.length; r++) {
          var i = t.variants[r];
          var s = '<option value="' + i.id + '">' + i.title + "</option>";
          product.find("form.variants > select").append(s)
        }
        new Shopify.OptionSelectors("product-select-" + t.id, { product: t,  onVariantSelected: selectCallbackQuickview  });

        if (t.options.length == 1) {
          $(".selector-wrapper:eq(0)").prepend("<label>" + t.options[0].name + "</label>")
        }
        product.find("form.variants .selector-wrapper label").each(function(n, r) {
          $(this).html(t.options[n].name)
        })
      } else {
        product.find("form.variants > select").remove();
        var o = '<input type="hidden" name="id" value="' + t.variants[0].id + '">';
        product.find("form.variants").append(o)

        if (window.show_multiple_currencies && window.shop_currency != jQuery("#currencies").val())
        {
          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), "span.money", "money_format")
        }
      }
    },      
    closeQuickViewPopup: function() {
      $(".quick-view").fadeOut(500)
    },
    initSidebar: function() {
      //if category page then init sidebar
      if ($(".mobileToggle").length > 0) {
        buddha.sidebarParams();              
        buddha.sidebarMapEvents();               
        buddha.sidebarInitToggle();
        buddha.sidebarMapClear();
        buddha.sidebarMapClearAll();
        buddha.initSortby();                
        buddha.sidebarMapPaging();
        buddha.addEventViewModeLayout();
        buddha.setTextForLimitedFilter();
        buddha.ajaxFilterLimit();             
      }
    },

    
    
    
       addEventViewModeLayout: function () {
            buddha.setActiveViewModeMediaQuery();

            body.on('click', '.view-mode .icon-mode', function (e) {
                e.preventDefault();

                var self = $(this),
                    col = self.data('col'),
                    parents = self.closest('[data-view-as]');

                if (!self.hasClass('active')) {
                    parents.find('.icon-mode').removeClass('active');
                    self.addClass('active');

                    buddha.viewModeLayout();
                };

            });
        },

     ajaxFilterLimit: function () {
          var limitFilterSlt = '[data-limited-view] li span',
              limitFilter = $(limitFilterSlt);

          body.off(limitFilterSlt).on('click', limitFilterSlt, function (e) {
            e.preventDefault();
            e.stopPropagation();

            var self = $(this),
                parent = self.parent();

            if (!parent.hasClass('active')) {
              var dataValue = self.data('value'),
                  value = "" + dataValue + "";

              $('[data-limited-view] .label-tab .label-text').text(value);

              buddha.doAjaxLimitGetContent(value);
            };

            limitFilter.closest('.dropdown-menu').prev().trigger('click');
          });
        },

        doAjaxLimitGetContent: function (value) {
          if (buddha.isAjaxLoading) return;

          $.ajax({
            type: "Post",
            url: '/cart.js',
            data: {
              "attributes[pagination]": value
            },

            success: function (data) {
              window.location.reload();
            },

            error: function (xhr, text) {
              $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
              buddha.showModal('.ajax-error-modal');
            },
            dataType: 'json'
          });
        },
    
        viewModeLayout: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                products = $('.collection-template .product-collection'),
                gridItem = products.find('.item-row'),
                strClass = 'wide--one-half post-large--one-half large--one-half medium--one-half wide--one-third post-large--one-third large--one-third medium--one-half wide--one-quarter post-large--one-quarter large--one-quarter medium--one-half wide--one-fifth post-large--one-fifth large--one-fifth medium--one-half small--one-half',
                gridClass = 'grid-2 grid-3 grid-4 grid-5 products-grid-view product-list-view';

            switch (col) {
                case 1:
                    if(gridItem.hasClass('grid-item-mansory')) {
                        products.removeClass(gridClass).addClass('product-list-view');
                    } else {
                        products.removeClass('products-grid-view').addClass('product-list-view');
                    }

                    gridItem.removeClass(strClass).addClass('col-1');               
                    break;

                default:
                    switch (col) {
                        case 2:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid-view grid-2');
                            } else {
                                products.removeClass('product-list-view').addClass('products-grid-view');
                            }
                            gridItem.removeClass(strClass).addClass('wide--one-half post-large--one-half large--one-half medium--one-half small--one-half');                        
                        break;

                        case 3:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid-view grid-3');
                            } else {
                                products.removeClass('product-list-view').addClass('products-grid-view');
                            }
                            gridItem.removeClass(strClass).addClass('wide--one-third post-large--one-third large--one-third medium--one-half small--one-half');
                            break;

                        case 4:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid-view grid-4');
                            } else {
                                products.removeClass('product-list-view').addClass('products-grid-view');
                            }
                            gridItem.removeClass(strClass).addClass('wide--one-quarter post-large--one-quarter large--one-quarter medium--one-half small--one-half');
                            break;

                        case 5:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid-view grid-5');
                            } else {
                                products.removeClass('product-list-view').addClass('products-grid-view');
                            }
                            gridItem.removeClass(strClass).addClass('wide--one-fifth post-large--one-third large--one-third medium--one-half small--one-half');
                            break;
                    }
            };
        },

        setActiveViewModeMediaQuery: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                windowWidth = window.innerWidth;

            if (windowWidth < 768) {
                if (col === 3 || col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="2"]').addClass('active');
                }
            } else if (windowWidth < 992 && windowWidth >= 768) {
                if (col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="3"]').addClass('active');
                }
            } else if (windowWidth < 1200 && windowWidth >= 992) {
                if (col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="4"]').addClass('active');
                }
            }

            if (viewMode.length) {
                buddha.viewModeLayout();
            }
        },

    
    
    sidebarMapView: function() {

      var   listButton = $('a.list');
      var gridButton = $('a.grid');
      var append = $('div.collection-grid');
      listButton.on('click',function(){
        gridButton.removeClass('on');
        listButton.addClass('on');
        append.removeClass('collection-grid').addClass('collection-list');
        buddha.sidebarAjaxClick();      

      });

      gridButton.on('click',function(){
        listButton.removeClass('on');
        gridButton.addClass('on');
        append.removeClass('collection-list').addClass('collection-grid');
        buddha.sidebarAjaxClick();      

      });




    },

    sidebarMapShow: function() {
      $(".filter-show a").click(function(n) {
        if (!$(this).parent().hasClass("active")) {
          var thisPaging = $(this).attr('href');
          var view = $(".view-mode a.active").attr("href");
          Shopify.queryParams.view = thisPaging;                    
          buddha.sidebarAjaxClick();                  
          $(".filter-show .btn span").text(thisPaging);
          $(".filter-show li.active").removeClass("active");
          $(this).parent().addClass("active");
        }
        n.preventDefault();
      });
    },

    sidebarMapSorting: function(n) {
      $(".filter-sortby a").click(function(n) {
        if (!$(this).parent().hasClass("active")) {
          Shopify.queryParams.sort_by = $(this).attr("href");
          buddha.sidebarAjaxClick();
          var sortbyText = $(this).text();                  
          $(".filter-sortby  button span").text(sortbyText);
          $(".filter-sortby li.active").removeClass("active");
          $(this).parent().addClass("active");
        }
        n.preventDefault();
      });
    },

    initSortby: function() {
      //sort by filter
      if (Shopify.queryParams.sort_by) {
        var sortby = Shopify.queryParams.sort_by;
        var sortbyText = $(".filter-sortby a[href='" + sortby + "']").text();
        $(".filter-sortby  button span").text(sortbyText);
        $(".filter-sortby li.active").removeClass("active");
        $(".filter-sortby a[href='" + sortby + "']").parent().addClass("active");
      }
    },
    sidebarMapPaging: function() {
      $(".pagination-custom a").click(function(n) {
        var page = $(this).attr("href").match(/page=\d+/g);
        if (page) {
          Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));
          if (Shopify.queryParams.page) {
            var newurl = buddha.sidebarCreateUrl();
            buddha.isSidebarAjaxClick = true;
            History.pushState({
              param: Shopify.queryParams
            }, newurl, newurl);
            buddha.sidebarGetContent(newurl);
            //go to top
            $('body,html').animate({
              scrollTop: 500
            }, 600);
          }
        }
        n.preventDefault();
      });
    },
    sidebarMapTagEvents: function() {
      $('.sidebar-tag a:not(".clear"), .sidebar-tag label').click(function(n) {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
          currentTags = Shopify.queryParams.constraint.split('+');
        }

        //one selection or multi selection
        if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(":checked")) {
          //remove other selection first
          var otherTag = $(this).parents('.sidebar-tag').find("input:checked");
          if (otherTag.length > 0) {
            var tagName = otherTag.val();
            if (tagName) {
              var tagPos = currentTags.indexOf(tagName);
              if (tagPos >= 0) {
                //remove tag
                currentTags.splice(tagPos, 1);
              }
            }
          }
        }

        var tagName = $(this).prev().val();
        if (tagName) {
          var tagPos = currentTags.indexOf(tagName);
          if (tagPos >= 0) {
            //tag already existed, remove tag
            currentTags.splice(tagPos, 1);
          } else {
            //tag not existed
            currentTags.push(tagName);
          }
        }
        if (currentTags.length) {
          Shopify.queryParams.constraint = currentTags.join('+');
        } else {
          delete Shopify.queryParams.constraint;
        }
        buddha.sidebarAjaxClick();
        n.preventDefault();
      });
    },



   

    sidebarMapClearAll: function() {
      //clear all selection
      $('.refined-widgets a.clear-all').click(function(n) {
        delete Shopify.queryParams.constraint;
        delete Shopify.queryParams.q;
        buddha.sidebarAjaxClick();
        n.preventDefault();
      });
    },
    sidebarMapClear: function() {
      $(".sidebar-tag").each(function() {
        var sidebarTag = $(this);
        if (sidebarTag.find("input:checked").length > 0) {
          //has active tag
          sidebarTag.find(".clear").show().click(function(n) {                     
            var currentTags = [];
            if (Shopify.queryParams.constraint) {
              currentTags = Shopify.queryParams.constraint.split('+');
            }
            sidebarTag.find("input:checked").each(function() {
              var selectedTag = $(this);
              var tagName = selectedTag.val();
              if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos >= 0) {
                  //remove tag
                  currentTags.splice(tagPos, 1);
                }
              }
            });
            if (currentTags.length) {
              Shopify.queryParams.constraint = currentTags.join('+');
            } else {
              delete Shopify.queryParams.constraint;
            }
            buddha.sidebarAjaxClick();
            n.preventDefault();
          });
        }
      });
    },
    sidebarMapEvents: function() {
      buddha.sidebarMapTagEvents();
      buddha.sidebarMapView();     
      buddha.sidebarMapShow();
      buddha.sidebarMapSorting();
      buddha.viewModeLayout();
      buddha.setTextForLimitedFilter();
    },
    
     setTextForLimitedFilter: function () {
            var filterLimited = $('[data-limited-view]'),
                labelTab = filterLimited.find('.label-tab'),
                labelText = labelTab.find('.label-text'),
                limitedLinkActive = labelTab.next().find('li.active'),
                text = limitedLinkActive.text();

            labelText.text(text);

            if (filterLimited.length) {
                var limited = filterLimited.find('li.active span').data('value'),
                    limitedActive = filterLimited.find('span[data-value="' + limited + '"]'),
                    limitedText = limitedActive.text();

                labelText.text(limitedText);
                labelTab.next().find('li').removeClass('active');
                limitedActive.parent().addClass('active');
            };
        },
    
    reActivateSidebar: function() {
      $(".sidebar-tag .active").removeClass("active");
      $(".sidebar-tag input:checked").attr("checked", false);


      //view mode and show filter
      if (Shopify.queryParams.view) {

        $(".view-mode .active").removeClass("active");
        var view = Shopify.queryParams.view;
        if (view.indexOf("list") >= 0) {
          $(".view-mode .list").addClass("active");
          //paging
          view = view.replace("list", "");
        } else {
          $(".view-mode .grid").addClass("active");
        }

        $(".filter-show > button span").text(view);
        $(".filter-show li.active").removeClass("active");
        $(".filter-show a[href='" + view + "']").parent().addClass("active");
      }
      buddha.initSortby();
    },
        sidebarMapData: function(data) {
          var currentList = $(".col-main .products-grid");           
          var productList = $(data).find(".col-main .products-grid");                     
          currentList.replaceWith(productList);
          //convert currency
           if (buddha.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            };

          //replace refined
          $(".refined-widgets").replaceWith($(data).find(".refined-widgets"));

          //replace tags
          $(".sidebar-block").replaceWith($(data).find(".sidebar-block"));

          //replace paging
          if ($(".padding").length > 0) {
            $(".padding").replaceWith($(data).find(".padding"));
          } else {
            $(".grid-link__container.col-main").append($(data).find(".padding"));
          }

          if ($(".spr-badge").length > 0) {
            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
          }
        },
    sidebarCreateUrl: function(baseLink) {
      var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');
      if (baseLink) {
        //location.href = baseLink + "?" + newQuery;
        if (newQuery != "")
          return baseLink + "?" + newQuery;
        else
          return baseLink;
      }
      return location.pathname + "?" + newQuery;
    },
    sidebarAjaxClick: function(baseLink) {
      delete Shopify.queryParams.page;
      var newurl = buddha.sidebarCreateUrl(baseLink);
      buddha.isSidebarAjaxClick = true;
      History.pushState({
        param: Shopify.queryParams
      }, newurl, newurl);
      buddha.sidebarGetContent(newurl);
    },
    sidebarGetContent: function(newurl) {
      $.ajax({
        type: 'get',
        url: newurl,
        beforeSend: function() {
          buddha.showLoading();
        },
        success: function(data) {
          buddha.sidebarMapData(data);
          buddha.sidebarMapTagEvents();
          buddha.sidebarInitToggle();
          buddha.sidebarMapClear();
          buddha.sidebarMapClearAll();
          buddha.hideLoading();
          buddha.initQuickView();
          buddha.initAddToCart();
          buddha.initThumbchange();
          buddha.initlightSlider()
          buddha.initWishlist();
          buddha.sidebarMapPaging();
          buddha.initInfiniteScrolling();
          buddha.initColorSwatchGrid();          
          $('body,html').animate({ scrollTop: 0 }, "slow");

        },
        error: function(xhr, text) {
          buddha.hideLoading();
          $('.loading-modal').hide();
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          buddha.showModal('.ajax-error-modal');
        }
      });
    },
    sidebarParams: function() {
      Shopify.queryParams = {};
      //get after ?...=> Object {q: "Acme"} 
      if (location.search.length) {
        for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');
          if (aKeyValue.length > 1) {
            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }
    },
   
       initInfiniteScrolling: function () {
            var infiniteScrolling = $('.infinite-scrolling');
            var infiniteScrollingLinkSlt = '.infinite-scrolling a';
            if (infiniteScrolling.length) {
                body.off('click.initInfiniteScrolling', infiniteScrollingLinkSlt).on('click.initInfiniteScrolling', infiniteScrollingLinkSlt, function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (!$(this).hasClass('disabled')) {
                        var url = $(this).attr('href');
                        buddha.doAjaxInfiniteScrollingGetContent(url);
                    };
                });

                if (window.infinity_scroll_feature) {                  
                    $(window).scroll(function () {                      
                        if (buddha.isAjaxLoading) return;
                        var collectionTplElm = $('[data-section-type="collection-template"]');
                        if (!collectionTplElm.length) {
                            collectionTplElm = $('[data-search-page]');                            
                        };
                     
                        var collectionTop = collectionTplElm.offset().top;
                        var collectionHeight = collectionTplElm.outerHeight();
                        var posTop = collectionTop + collectionHeight - $(window).height();                      
                     
                        if ($(this).scrollTop() > posTop && $(this).scrollTop() < (posTop + 200)) {                          
                            var button = $(infiniteScrollingLinkSlt);

                            if (button.length && !button.hasClass('disabled')) {                              
                                var url = button.attr('href');                              
                                buddha.doAjaxInfiniteScrollingGetContent(url);
                            };
                        };
                    });
                };
            }
        },

        doAjaxInfiniteScrollingGetContent: function (url) {
            if (buddha.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: url,
                beforeSend: function () {
                    buddha.showLoading();
                },
                success: function (data) {
                    buddha.ajaxInfiniteScrollingMapData(data);
                    buddha.initColorSwatchGrid();
                     buddha.initQuickView();
                    if ($('[data-view-as]').length) {
                        buddha.viewModeLayout();
                    };                   
                },
                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    buddha.showModal('.ajax-error-modal');
                },
                complete: function () {
                    buddha.hideLoading();
                }
            });
        },

        ajaxInfiniteScrollingMapData: function (data) {
            var collectionTemplate = $('.collection-template'),
                currentProductColl = collectionTemplate.find('.product-collection'),
                newCollectionTemplate = $(data).find('.collection-template'),
                newProductColl = newCollectionTemplate.find('.product-collection'),
                newProductItem = newProductColl.children('.item-row').not('.banner-img');

            showMoreButton = $('.infinite-scrolling a');

            if (newProductColl.length) {
                currentProductColl.append(newProductItem);

               if ($('.collection-template .product-collection[data-layout]').length) {
                    buddha.KidsTimeout = setTimeout(function () {
                        currentProductColl.isotope('appended', newProductItem).isotope('layout');
                    }, 700);
                }

                if ($(data).find('.infinite-scrolling').length > 0) {
                    showMoreButton.attr('href', newCollectionTemplate.find('.infinite-scrolling a').attr('href'));
                } else {
                    //no more products
                    var noMoreText = window.no_more_product;
                   showMoreButton.html(noMoreText).addClass('disabled');
                };

                if (buddha.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };

                if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                    return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                };
            };
        },
    convert_currency: function(value) {            
      var newCurrency = Currency.currentCurrency;
      var oldCurrency = shopCurrency;
      if(isNaN(value)){
        value =  0.0;
      }

      var cents = 0.0;
      var oldFormat = Currency.moneyFormats['USD'][ Currency.format] || '';
      var newFormat = Currency.moneyFormats[newCurrency][Currency.format] || '';
      if (oldFormat.indexOf('amount_no_decimals') !== -1) {
        cents = Currency.convert(parseInt(value, 10)*100, oldCurrency, newCurrency);
      }
      else if (oldCurrency === 'JOD' || oldCurrency == 'KWD' || oldCurrency == 'BHD') {
        cents = Currency.convert(parseInt(value, 10)/10, oldCurrency, newCurrency);
      }
      else { 
        cents = Currency.convert(parseInt(value, 10), oldCurrency, newCurrency);
      }
      var my_data =  Currency.formatMoney(cents, newFormat);
      return my_data;


    },

    compare_to_table: function(data) {

      if (Object.keys(data).length <= 0) {
        return '';
      }
      var html = '';
      var i = 0;

      var end_check = (Object.keys(data).length - 1);
      var width_tr = (end_check > 0) ? (90 / (Object.keys(data).length)) : 90;
      var data_html = '';
      for (i = 0; i <= end_check; i++) {
        var el = data[i];
        var is_sale = false;
        if (el.compare_at_price > el.price) {
          is_sale = true
        }
        data_html = data_html + '<th class="item-row ' + el.handle + '"  id="product-' + el.id + '"><button type="button" class="close btn remove-compare center-block" aria-label="Close" data-handle="' + el.handle + '"> '+window.remove+ ' <i class="fas fa-times" aria-hidden="true"></i></button></th>';
        //Start title 

        if (i == 0) {
          html = html + '<tr>';
          html = html + '<th width="15%" class="product-name" >' + window.product_name + '</th>';
        }
        html = html + '<td width="' + width_tr + '%"  class="' + el.handle + ' grid-link__title"> ' + el.title + '  </td>';
        if (i >= end_check) {
          html = html + '</tr>';
        }
        // End Title 


      }
      for (i = 0; i <= end_check; i++) {
        var el = data[i];
        var is_sale = false;
        if (el.compare_at_price > el.price) {
          is_sale = true
        }
        if (i == 0) {
          html = html + '<tr>';
          html = html + '<th width="15%" class="product-name " >' + window.product_image +'</th>';

        }
        // start product image
        html = html + '<td width="' + width_tr + '%" class="item-row ' + el.handle + '" id="product-'+el.variants[0].id+'"> <img src="' + el.featured_image + '"  width="150" class="featured-image"/> '+ '<div class="compare-product-name">'+ el.title +'</div>' +'<div class="product-price product_price"> ';
        if (is_sale) {
          html = html + '<strong>On Sale</strong>' + '<span class="price-sale"><span class="money" data-currency-'+Currency.currentCurrency+'="'+buddha.convert_currency(el.price,'11')+'">'+buddha.convert_currency(el.price,'11')+'</span></span>';
        } else {
          html = html + '<span class="price-sale"><span class="money" data-currency-'+Currency.currentCurrency+'="'+buddha.convert_currency(el.price,'11')+'">'+buddha.convert_currency(el.price,'11')+'</span></span>';
        }
        if (buddha.convert_currency(el.compare_at_price, 'nosymbol') > 0) {
          html = html + '<span class="visually-hidden">Regular price</span> <s>' + buddha.convert_currency(el.compare_at_price, '11') + '</s>';
        }
        html = html + '</div>';
        //convert_currency(el.price,'3');
        if (el.variants.length > 1) {          
          html = html + '<a class="btn" href="#" onclick="location.href=\'/products/' + el.handle + '\'">' + window.select_options + '</a>';
        } else {
          html = html + '<form  action="/cart/add" method="post" class="variants clearfix" id="cart-form-'  + el.variants[0].id  + '">';
          html = html + '<input type="hidden" name="id" value="' + el.variants[0].id +'" />';   
          html = html + '<a href="#" title="Add to Cart" data-pid="' + el.variants[0].id + '" class="add-to-cart btn">Add to Cart</a>';
          html = html + '</form>';
        }
        html = html + '<p   class="' + el.handle + ' grid-link__title hidden"> ' + el.title + '  </p>';

        html = html + ' </td>';

        if (i >= end_check) {
          html = html + '</tr>';
        }
        // End product image
      }
      for (i = 0; i <= end_check; i++) {
        var el = data[i];
        var is_sale = false;
        if (el.compare_at_price > el.price) {
          is_sale = true
        }
        if (i == 0) {
          html = html + '<tr>';
          html = html + '<th width="15%" class="product-name" >' + window.product_desc +'</th>';

        }        
        html = html + '<td width="' + width_tr + '%" class="' + el.handle + ' "> <p class="description-compare"> ' + el.description.replace(/(<([^>]+)>)/ig, "").split(" ").splice(0, 15).join(" ") + "..." + ' </p> </td>';
        if (i >= end_check) {
          html = html + '<tr>';
        }

      }
      for (i = 0; i <= end_check; i++) {
        var el = data[i];
        var is_sale = false;
        if (el.compare_at_price > el.price) {
          is_sale = true
        }
        if (i == 0) {
          html = html + '<tr>';
          html = html + '<th width="15%" class="product-name" > Availability  </th>';

        }

        var avai_stock = (el.available) ? window.available_stock : window.unavailable_stock;
        html = html + '<td   width="' + width_tr + '%" class="available-stock ' + el.handle + '"> <p> ' + avai_stock + ' </p> </td>';
        if (i >= end_check) {
          html = html + '<tr>';
        }

      }
      $(".th-compare").html('<td>Action</td>'+data_html);
      $("#table-compare").html(html);  
      $(document).on('click','.add-to-cart', function(event) {
        event.preventDefault();
        if ($(this).attr("disabled") != "disabled") {
          var r = $(this).parents(".item-row");
          var i = $(r).attr("id");
          i = i.match(/\d+/g);
          if (!window.ajax_cart) {
            $("#cart-form-" + i).submit()
          } else {
            var s = $("#cart-form-" + i + " select[name=id]").val();
            if (!s) {
              s = $("#cart-form-" + i + " input[name=id]").val()
            }
            var o = $("#cart-form-" + i + " input[name=quantity]").val();
            if (!o) {
              o = 1
            }
            var a = $(r).find(".featured-image").attr("src");
            var p = $(r).find(".grid-link__title").text();
            var amt = $(r).find(".product_price span.money").text();                         
            buddha.compareAjaxAddToCart(s, o, a, p, amt)

          }
        }
        return false


      });



    },

    compareAjaxAddToCart: function(n, r, a, p, amt) {   
      e.ajax({
        type: "post",
        url: "/cart/add.js",
        data: "quantity=" + r + "&id=" + n,
        dataType: "json",
        beforeSend: function() {
          $(".ajax-success-compare-modal").fadeOut(500);
          buddha.showLoading()                    
        },
        success: function(n) {

          buddha.hideLoading();  
          buddha.showModal(".ajax-success-modal");
          $(".ajax-success-modal").find(".ajax-product-image").attr("src", a);
          $(".ajax-success-modal").find(".added-to-wishlist").hide();
          $(".ajax-success-modal").find(".added-to-cart").show();
          $(".ajax-success-modal").find(".ajax-product-title").text(p);
          $(".ajax-success-modal").find(".ajax_price").text(amt);
          $(".ajax-success-modal").find(".ajax_qty").text(r);
          // t.updateDropdownCart()
        },
        error: function(n, r) {
          buddha.hideLoading();
          $(".ajax-error-message").text(e.parseJSON(n.responseText).description);
          buddha.showModal(".ajax-error-modal")
        }
      })
    },

    modal_compare: function(compare){
      if (!$.isEmptyObject(compare)) {
        $(".error-compare").hide(20);
        var list_id = '';
        var json_compare = [];
        var check_end = 0;
        var compare_size = (Object.keys(compare).length - 1);
        $.each(compare, function(index, el) {
          var json_url = "/products/" + el + ".js";
          if ($.trim(el) != "") {
            jQuery.getJSON(json_url, function(product) {
              json_compare[check_end] = product;
              if (check_end >= compare_size) {
                buddha.compare_to_table(json_compare);
              }
              check_end += 1;
            });

          }

        });
        $("#moda-compare").fadeIn();       
      }

    },


    initCompare: function(){
      $(doc).on('click','.compare', function(event) {
        event.preventDefault();
        buddha.showLoading();
        /* Act on the event */
        var ethis = $(this);
        var pid = $(this).data('pid');

        compare = storage.get('compare');

        if ($.isEmptyObject(compare)) {
          compare = {};
        }
        var check_compare = true;
        if (Object.keys(compare).length >= total_compare) {
          /* swal({
          title: window.confirm_box,
          text: window.compare_note,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#4cae4c",
          confirmButtonText: window.confirm_box,
          timer: 600,
          cancelButtonText: window.cancelButtonText,
          closeOnConfirm: true
        });
        */
          alert("Yes can compare maximum 4 products only!");
          buddha.modal_compare(compare);            

        } else {
          for (var i = 1; i <= 4; i++) {
            if (compare['p' + i] == "" || compare['p' + i] == undefined) {
              compare['p' + i] = pid;
              break;
            } else if (compare['p' + i] == pid) {
              ethis.addClass('added');
              check_compare = false;
              buddha.modal_compare(compare);

              break;
            }
          }
          if (check_compare) {
            storage.set('compare', compare);
            buddha.modal_compare(compare);
            ethis.addClass('add-success');
            $("[data-pid='"+pid+"']").addClass('added');//.text(window.added_to_cmp);          
          }
        }
        buddha.hideLoading();
      });
    },


    initRemoveCompare: function(){   
      $(document).on('click', '.remove-compare', function(event) {
        event.preventDefault();
        /* Act on the event */

        var id = $(this).data('handle');
        $("." + id).fadeOut(600).remove();
        $("[data-pid='"+id+"']").removeClass('added add-success');//.text(window.add_to_cmp);
        $.each(compare, function(index, el) {
          if (el == id) {         
            compare[index] = "";
            delete compare[index];

          }
        });
        storage.set('compare', compare);       
        var rmtd = $('#table-compare tr td');
        rmtd.length ? ' ' : $('#moda-compare').fadeOut(600);
      });

      /** End compare */

    },
    initBundleProducts: function() {

            var btnAddToCartSlt = '[data-bundle-addToCart]',
                bundleImagesSlide = $('[data-bundle-images-slider]'),
                btnToggleOptionsSlt = '.fbt-toogle-options',
                bundlePrice = $('.products-grouped-action .bundle-price'),
                bundleCheckbox = '.bundle-checkbox';

            var replaceDiscountRate = function(){
                if(bundlePrice.length > 0){
                    var discountRate = bundlePrice.data('discount-rate')*100;
                    var discountText = $('.products-grouped-action .discount-text span');
                    if(discountText.length > 0){
                        discountText.each(function(){
                            $(this).text($(this).text().replace('[discount]',discountRate)).parent().show();
                        })
                    }

                }
            }

            var bundleSlider = function() {
                if(bundleImagesSlide.length && bundleImagesSlide.not('.slick-initialized')) {
                    var images = bundleImagesSlide.data('rows');

                    bundleImagesSlide.slick({
                        get slidesToShow() {
                            if(images >= 5) {
                                return this.slidesToShow = 5;
                            }
                            else {
                                return this.slidesToShow = images;
                            }
                        },
                        slidesToScroll: 1,
                        dots: false,
                        infinite: false,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-chevron-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
                        responsive: [{
                                breakpoint: 992,
                                settings: {
                                    get slidesToShow() {
                                        if(images >= 4) {
                                            return this.slidesToShow = 4;
                                        }
                                        else {
                                            return this.slidesToShow = images;
                                        }
                                    },
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    get slidesToShow() {
                                        if(images > 3) {
                                            return this.slidesToShow = 3;
                                        }
                                        else {
                                            return this.slidesToShow = images;
                                        }
                                    }
                                }
                            }
                        ]
                    });
                }
            };

            var toggleVariantOptions = function() {
                body.off('click.toggleVariantOptions', btnToggleOptionsSlt).on('click.toggleVariantOptions', btnToggleOptionsSlt, function(e) {
                    e.preventDefault();
                  //  $(this).next().slideToggle();                  
                  $(this).next().slideToggle('slow', function() {
                    $(this).css('overflow', '');
                  });
                  
                  
                })
            };

            var handleCheckedProduct = function() {
                // check all checkbox on loadpage
                $('.fbt-checkbox input').prop('checked',true);

                body.off('click.checkedProduct', bundleCheckbox).on('click.checkedProduct', bundleCheckbox, function(e) {
                    e.preventDefault();

                    var self = $(this),
                        ipt = self.prev(),
                        dataId = self.closest('.fbt-product-item').data('bundle-product-id');

                    if(!ipt.prop('checked')) {
                        ipt.prop('checked', true);
                        $('[data-bundle-product-id="'+ dataId +'"]').addClass('isChecked');
                    } else {
                        ipt.prop('checked', false);

                        $('[data-bundle-product-id="'+ dataId +'"]').removeClass('isChecked');
                    };
                    updateTotalPrice();
                })
            };

            var initSelectedSwatch = function() {
                $('.fbt-product-item').each(function() {
                    var self = $(this);
                    var productId = self.data('bundle-product-id');
                    var selectedVariantId = $(this).find('[name="group_id"]').val();
                    var productOpts = self.find('.swatch');
                    var variantArr = window.productVariants[productId];

                    if (!variantArr) {
                        return;
                    }
                    // Get selected variant
                    var selectedVariant = variantArr.find(function(variant){
                        return variant.id == selectedVariantId
                    });

                    // Check selected swatch
                    productOpts.each(function(index){
                        var optionIndex = 'option' + (index + 1);
                        var selectedSwatch = $(this).find('.swatch-element[data-value="'+selectedVariant[optionIndex]+'"]');

                        selectedSwatch.find('input').prop('checked', true);
                    })

                });

            }

            var updateTotalPrice = function() {
                var bundleProItem = $('.fbt-product-item.isChecked');
                var bundlePrice = $('.products-grouped-action .bundle-price');
                var oldPrice = $('.products-grouped-action .old-price');
                var discountRate = bundlePrice.data('discount-rate');
                var totalPrice = 0;
                var checkedProductLength = $('.fbt-product-item.isChecked').length;
                var maxProduct = $('.fbt-product-item').length;

                bundleProItem.each(function() {
                    var selectElm = $(this).find('select[name=group_id]'),
                        inputElm = $(this).find('input[name=group_id]');

                    if(selectElm.length) {
                        var price = selectElm.find(':selected').data('price');
                    } else {
                      if (inputElm.length) {
                        var price = $(this).find('input[name=group_id]').data('price');
                      } else {
                        var price = $(this).find('input[name=id]').data('price');
                      }
                    }

                    if(price) {
                        totalPrice += price;

                        if(bundlePrice.length > 0 && oldPrice.length > 0){
                            oldPrice.html(Shopify.formatMoney(totalPrice, window.money_format));
                            bundlePrice.html(Shopify.formatMoney(totalPrice*(1 - discountRate), window.money_format));
                             if(checkedProductLength == maxProduct){
                                window.bundleMatch = true;
                                bundlePrice.show();
                                oldPrice.show();
                                $('.products-grouped-action .price').hide();
                            }else{
                                window.bundleMatch = false;
                                bundlePrice.hide();
                                oldPrice.hide();
                                $('.products-grouped-action .price').show();
                            }
                        }

                        $('.products-grouped-action .total .price').html(Shopify.formatMoney(totalPrice, window.money_format));


                    };
                })
                if (buddha.checkNeedToConvertCurrency()) {
                  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            };

            var disableSoldoutSwatchAllBundles = function(){
                var productItem = $('.fbt-product-item');
                productItem.each(function(){
                    var self = $(this);
                    disableSoldoutSwatchBundle(self);
                })
            };

            var disableSoldoutSwatchBundle = function(productItem){
                var productId = productItem.data('bundle-product-id');
                var variantList = window.productVariants[productId];
                var options = productItem.find('[data-option-idx]');
                var selectedSwatchOpt1 = productItem.find('[data-option-idx="0"]').find('input:checked').val();
                var selectedSwatchOpt2 = productItem.find('[data-option-idx="1"]').find('input:checked').val();
                var selectedSwatchOpt3 = productItem.find('[data-option-idx="2"]').find('input:checked').val();

                options.each(function(){
                    var optionIndex = $(this).data('option-idx');
                    var swatch = $(this).find('.swatch-element');
                    switch (optionIndex) {
                        case 0:
                        // loop through all swatchs in option 1 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                        case 1:
                        // loop through all swatchs in option 2 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == selectedSwatchOpt1 && variant.option2 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                        case 2:
                        // loop through all swatchs in option 3 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == selectedSwatchOpt1 && variant.option2 == selectedSwatchOpt2 && variant.option3 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                    }
                });
            };

            var changeSwatchProductBundle = function() {
                var swatchSlt = '.fbt-product-item .swatch :radio';

                doc.off('change.changeBundleSwatch', swatchSlt).on('change.changeBundleSwatch', swatchSlt, function(e) {
                    var self = $(this);
                    if (self.prop('checked')) {
                        var productItem = $(this).closest('.fbt-product-item');
                        var productId = productItem.data('bundle-product-id');
                        var variantList = window.productVariants[productId];
                        var optionIdx = self.closest('[data-option-idx]').data('option-idx');
                        var swatches = productItem.find('.swatch-element');
                        var thisVal = self.val();
                        var selectedVariant;
                        var fbtPrice = productItem.find('.fbt-prices'),
                            priceSale = fbtPrice.find('.price-sale'),
                            productPrice = fbtPrice.find('[data-fbt-price-change]');
                        var productInput = productItem.find('[name=group_id]');
                        // Get selected swatches
                        var selectedSwatchOpt1 = productItem.find('[data-option-idx="0"]').find('input:checked').val();
                        var selectedSwatchOpt2 = productItem.find('[data-option-idx="1"]').find('input:checked').val();
                        var selectedSwatchOpt3 = productItem.find('[data-option-idx="2"]').find('input:checked').val();
                        // Re-active all swatches
                        swatches.removeClass('soldout');
                        swatches.find(':radio').prop('disabled',false);
                        // Auto get first available variant
                        switch (optionIdx){
                            case 0:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == thisVal && variant.option2 == selectedSwatchOpt2 && variant.available;
                                })
                                if(availableVariants != undefined){
                                    selectedVariant =  availableVariants;
                                }else{
                                     // variant was sold out, so auto select other available variant
                                    var altAvailableVariants = variantList.find(function(variant){
                                        return variant.option1 == thisVal && variant.available;
                                    })
                                    selectedVariant =  altAvailableVariants;
                                };
                                break;
                            case 1:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == selectedSwatchOpt1 && variant.option2 == thisVal && variant.available;
                                })
                                if(availableVariants != undefined){
                                    selectedVariant =  availableVariants;
                                }else{
                                    // Something went wrong, if correct, never meet this
                                    console.log('Bundle Error: variant was soldout, on option selection #2')
                                };
                                break;
                            case 2:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == selectedSwatchOpt1 && variant.option2 == selectedSwatchOpt2 && variant.option3 == thisVal && variant.available;
                                })
                                if(availableVariants != undefined){
                                   selectedVariant =  availableVariants;
                                }else{
                                    // Something went wrong, if correct, never meet this
                                    console.log('Bundle Error: variant was soldout, on option selection #3')
                                };
                                break;
                        }

                        productInput.val(selectedVariant.id);

                        // Check new swatch input
                        initSelectedSwatch();
                        // Disable sold out swatches base on new checked inputs
                        disableSoldoutSwatchBundle(productItem);

                        // Do select callback function
                         productPrice.html(Shopify.formatMoney(selectedVariant.price, window.money_format));

                         // change variant id of main product for adding to cart
                         productItem.find('input[name=id][type=hidden]').val(selectedVariant.id)

                            if (selectedVariant.compare_at_price > selectedVariant.price) {
                                priceSale.find('[data-fbt-price-change]').addClass('special-price');
                                priceSale.find('.old-price').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format)).show();
                            }
                            else {
                                priceSale.find('.old-price').hide();
                                priceSale.find('[data-fbt-price-change]').removeClass('special-price');
                            }

                            productItem.find('select').val(selectedVariant.id).trigger('change');

                            updateTotalPrice();
    
                          if (buddha.checkNeedToConvertCurrency()) {
                              Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                            }

                            // Change product image
                            var newImage = productInput.find('option:selected',this).attr('data-image');
                            if(newImage != undefined){
                                var productImage = $('.fbt-image-item[data-bundle-product-id="'+productId+'"]').find('img');
                                productImage.attr('src',newImage)
                            }

                    }
                });
            };

            var initBundleAddToCart = function() {

                doc.off('click.bundleAddToCart', btnAddToCartSlt).on('click.bundleAddToCart', btnAddToCartSlt, function(e) {
                    e.preventDefault();

                    var self = $(this),
                        form = self.closest('form'),
                        curPro = form.find('[data-collections-related]'),
                        handle = curPro.data('collections-related'),
                        bundleProduct = form.find('[data-grouped-product-item].isChecked'),
                        title = $('h1.product-title').text(),
                        image = $('[id^="product-featured-image"]').first().attr('src');

                    if(self.attr('disabled') !== "disabled") {
                        buddha.showLoading();
                        Shopify.queue = [];
                        var i = 0;
                        bundleProduct.each(function() {
                            var variantId = $(this).find('[name=group_id]').val();

                            if(variantId) {
                                Shopify.queue.push( {
                                    variantId: variantId,
                                    quantity: 1
                                });

                            };
                        });

                        Shopify.moveAlong = function() {
                            if (Shopify.queue.length) {
                                var request = Shopify.queue.shift();
                                buddha.showLoading();
                                Shopify.addItem(request.variantId, request.quantity, Shopify.moveAlong);
                                buddha.KidsTimeout = setTimeout(function(){
                                    buddha.hideLoading();
                                },5000)
                            }
                            else {
                                buddha.hideLoading();
                                var variant_id = curPro.find('[name=id]').val();
                                var formData = $(self.data('form-id'));
                                var data = formData.serialize();
                                var quantity = 1;
                                switch (window.ajax_cart) {
                                    case "none":
                                        buddha.doAjaxAddToCart(data, handle,true);
                                        break;

                                    case "normal":
                                        buddha.doAjaxAddToCartNormal(data, title,image);
                                        break;

                                    case "upsell":
                                        buddha.doAjaxAddToCart(data, handle);
                                        break;
                                };
                             
                                // add discount code first
                                try{
                                    var discount_code = "FBT-BUNDLE-"+ meta.product.id;
                                    buddha.apply_discount( discount_code );
                                }
                                catch(e){
                                    console.log(e)
                                }
                                return false;
                            };
                        }

                        Shopify.moveAlong();

                    }

                });

                 
            };
            replaceDiscountRate();
            bundleSlider();
            toggleVariantOptions();
            handleCheckedProduct();
            initSelectedSwatch();
            disableSoldoutSwatchAllBundles();
            changeSwatchProductBundle();
            updateTotalPrice();
            initBundleAddToCart();
        },
        apply_discount: function( discount_code ){
            if(window.bundleMatch){
                $.ajax({
                    url: "/discount/" + discount_code,
                    success: function(response){
                        console.log('Discount code added');
                    }
                });
            }

        },
        checkBundleProducts: function() {
          var discount_code = $.cookie('discount_code');
          if( discount_code != "" && discount_code != null ){
            var mainProduct = discount_code.replace('FBT-BUNDLE-', '');
            if( mainProduct != '')
                getShoppingCart();
          }

            function getShoppingCart () {

                if( $('ul.cart-list li').length > 0 ) {
                var check = false;
                var cart = [];
                $('ul.cart-list li').each(function(i, el) {
                  var product_id = $(el).data('product_id');
                  if( product_id == mainProduct){
                    check = true;
                  }
                  if(cart.indexOf( product_id ) == -1)
                    cart.push( product_id );
                });

                if( check == true ){
                  $.ajax({
                    url: "/collections/bundle-" + mainProduct + "?view=bundle-json",
                    success: function(response){
                      var myBundle = JSON.parse(response);
                      if(cart.length >= myBundle.results.length) {
                        checkProductInCart(cart, myBundle.results);
                      }
                      else
                        remove_discount();
                    }
                  });
                }
                else 
                  remove_discount();
              }

/*
              $.ajax({
                type: "Post",
                url: '/cart.js',
                dataType: 'json',
                success: function (data) {
                  if(data != null ) {
                    if( data.item_count > 0 ) {
                        var check = false;
                        var cart = [];
                        data.items.forEach(function(el) {
                          if(el.product_id == mainProduct){
                                check = true;
                          }
                          if(cart.indexOf(el.product_id) == -1)
                            cart.push(el.product_id);
                        });
                      if( check == true ){
                        $.ajax({
                          url: "/collections/bundle-" + mainProduct + "?view=json",
                          success: function(response){
                            var myBundle = JSON.parse(response);
                            if(cart.length >= myBundle.results.length) {
                              checkProductInCart(cart, myBundle.results);
                            }
                            else
                              remove_discount();
                          }
                        });
                      }
                      else
                        remove_discount();
                    }
                  }
                },
                error: function (xhr, text) {

                },
            });
             */
          }

          function checkProductInCart(cart, collection){
            var i = 0;
            collection.forEach(function(el) {
              if(cart.indexOf(el.id) != -1) {
                i++;
              }
            });
            if( i != collection.length)
              remove_discount();
          }

          function remove_discount(){
            $.ajax({
              url: "/checkout?discount=%20",
              success: function(response){
                // $.cookie('discount_code', '');
                
              }
            });
          }
        }

  }

  })(jQuery)