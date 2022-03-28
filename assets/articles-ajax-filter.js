$(function() { 
  var  activeType =  $('.advanced-filter[data-group="Articles"]').data('handle');
  //alert(activeType);
  $(document).on('click', '.advanced-filter', function(e){
    e.preventDefault();
    el = $(this);
    activeType = el.data('handle');
    //  alert(activeType);
    filter_data();     
  });
  $(document).on('click', '.button', function(e){
    e.preventDefault();

    activeType = '';
    //  alert(activeType);
    filter_data(); 
  });
  function filter_data(){
    var base_url = window.location.origin+'/blogs/articles/';
    var slug = '';
    if(activeType){
      slug += activeType;   
    }
    var get_url = base_url+slug;
    // alert(get_url)
    $('.blog_grid_section').html('<div class="_jsLoaderDiv"><img class="_jsLoader" src="https://cdn.shopify.com/s/files/1/2358/5863/t/5/assets/loading.gif" ></div>');
    $.get(get_url, function(data){
      $content =  $(data).find('.main-content').html();
      // alert($content);
      $('.main-content').html($content);
      history.pushState('', '', get_url);
    });
    $('html, body').animate({
      scrollTop: $('.results-shown-number').offset().top
    }, 1000);
  }
  
  $(document).on('click', '.js-road-more', function(e){
  	e.preventDefault();
    
    var href = $(this).attr('href');
    var shopUrl = window.location.origin;
    
    var nextUrl = shopUrl + href;
    
    $.get(nextUrl, function(data){
      $content =  $(data).find('.blog_grid_section').html();
      var nUrl = $(data).find('.js-road-more').attr('href');
      var previewCount = parseInt($('[data-article-count]').text());
      var aCount = parseInt($(data).find('[data-article-count]').text());
      var total = previewCount + aCount;
      $('[data-article-count]').text(total);
      // alert($content);
      $('.blog_grid_section').append($content);
      
      if(nUrl){
      	$('.js-road-more').attr('href',nUrl);
      }else{
      	$('.js-road-more').hide();
      }
    });
  })
});
