    var mexico_topic_id = 1350;
    var nigeria_topic_id = 1348;

    var annotate = function() {
      jQuery(function ($) {
        $('#notebook').annotator().annotator('setupPlugins');
      });
    }

    ////////////////////////////////////////////////////////////////////
    // Top Stories for Topic

    var pullStories = function(topic_id) {
      var storiesAPI = "http://localhost:5000/top_stories/" + topic_id;
      $.getJSON( storiesAPI, {
        format: "json"
      })
      .done(function( data ) {
        $(data['stories']).each(function( i, item ) {
          $( "<div>" ).addClass('item').append( 
            $("<a>", { href: item.url, target: '_article' }).text(
              item.title
            ) 
          ).appendTo( "#top_stories_list" );
          if(i > 25) {
            return false;
          }
        });
        $( "#top_stories" ).slideDown("slow");
        console.log("Completed pulling top stories.")
      });
    };
    pullStories({{topic_id}});
    

    $( "a#reload_stories" ).live( "click", function( event ) {
      event.preventDefault();
      $("#top_stories_list").empty();
      pullStories({{topic_id}});
    });

    ////////////////////////////////////////////////////////////////////
    // Top Words for Topic

    var pullTopWords = function(topic_id) {
      var topWordsAPI = "http://localhost:5000/top_words/" + topic_id;
      $.getJSON( topWordsAPI, {
        format: "json"
      })
      .done(function( data ) {
        $(data['words']).each(function( i, item ) {
          $( "<div>" ).addClass('item').append( 
            $("<a>", { href: '#', onclick: "copyWordToNotebook(this);", target: '_word' }).text(
              item.term + ' (' + item.count + ')'
            ) 
          ).appendTo( "#top_words_list" );
          if(i > 25) {
            return false;
          }
        });
        $( "#top_words" ).slideDown("slow");
        console.log("Completed pulling top words.")
      });
    };
    pullTopWords({{topic_id}});


    $( "a#reload_top_words" ).live( "click", function( event ) {
      event.preventDefault();
      $("#top_words_list").empty();
      pullTopWords({{topic_id}});
    });

    ////////////////////////////////////////////////////////////////////
    // Top Media for Topic

    var pullTopMedia = function(topic_id) {
      var topMediaAPI = "http://localhost:5000/top_media/" + topic_id;
      $.getJSON( topMediaAPI, {
        format: "json"
      })
      .done(function( data ) {
        $(data['media']).each(function( i, item ) {
          $( "<div>" ).addClass('item').append( 
            $("<a>", { href: item.url, target: '_media' }).text(
              item.name + ' (' + item.inlink_count + ' / ' + item.bitly_click_count + ')'
            ) 
          ).appendTo( "#top_media_list" );
          if(i > 25) {
            return false;
          }
        });
        $( "#top_media" ).slideDown("slow");
        console.log("Completed pulling top media.")
      });
    };
    pullTopMedia({{topic_id}});


    $( "a#reload_top_media" ).live( "click", function( event ) {
      event.preventDefault();
      $("#top_media_list").empty();
      pullTopMedia({{topic_id}});
    });

  // Close columns and open notebook view
  var openNotebook = function() {
    $( "#top_media" ).animate({height:'toggle'},200);
    $( "#top_stories" ).animate({height:'toggle'},200);
    $( "#top_words" ).animate({height:'toggle'},200);
    $( "#notebook" ).animate({height:'toggle'},600);
    
    $( "#nb_top_words_list" ).animate({width:'toggle'},600);
    $( "#nb_top_stories_list" ).animate({width:'toggle'},600);
    $( "#nb_top_media_list" ).animate({width:'toggle'},600);
  }

  var copyWordToNotebook = $(function(word) {
    var $dupWord = $(word).clone();
    $('.nb_top_words_list').html($dupWord);
  });






