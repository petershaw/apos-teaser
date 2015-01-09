apos.widgetPlayers.teaser = function($widget) {
  var data = apos.getWidgetData($widget);
  if (!data._ajax) {
    // The server already populated it for us
    return;
  }

  $.get(
    '/apos-teaser/render-teaser',
    data,
    function(result) {
    	console.log("content.js", result);
      $widget.html(result);
    }
  );
};
