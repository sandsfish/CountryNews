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
          $( "<li>" ).append( 
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
          $( "<li>" ).append( 
            $("<a>", { href: '#', target: '_word' }).text(
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
          $( "<li>" ).append( 
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



  // TODO: Background colored neon red to green to yellow to blue based on inlink count
  // var pullTopicStories = (function(cid, terms) {
  //   console.log(cid);
  //   var topicStoriesAPI = 'http://localhost:5000/top_stories/' + cid;
  //   $.getJSON( topicStoriesAPI, {
  //     terms: terms,
  //     format: "json"
  //   });
  // };)

  // pullTopicStories.promise().done(function( data ) {
  //   console.log(data);
  //   $(data['stories']).each(function( i, item ) {
  //     $( "<li>" ).append( 
  //       $("<a>", { href: item.url, target: '_article' }).text(
  //         item.title + ' (' + item.inlink_count + ')'
  //       ).append($('<br>'))
  //     ).appendTo( "#top_stories_inlink_list" );
  //   });
  // });

  // pullTopicStories('1348', '');

  // Refresh list of stories with new call to API

  var openNotebook = function() {
    $( "#top_media" ).animate({height:'toggle'},200);
    $( "#top_stories" ).animate({height:'toggle'},200);
    $( "#top_words" ).animate({height:'toggle'},200);
    $( "#notebook" ).animate({width:'toggle'},100);
    annotate();
  }