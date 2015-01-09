
var cache = {};
var pending = {};

module.exports = function(options, callback) {
  return new Construct(options, callback);
};

module.exports.Construct = Construct;

function Construct(options, callback) {
  var apos = options.apos;
  var app = options.app;
  
  var that = this;
  that.apos = apos;
  that.app = app;
  var lifetime = options.lifetime ? options.lifetime : 60000;

  that.apos.mixinModuleAssets(that, 'teaser', __dirname, options);

  // This widget should be part of the default set of widgets for areas
  // (this isn't mandatory)
  apos.defaultControls.push('teaser');

  // Include our editor template in the markup when aposTemplates is called
  that.pushAsset('template', 'teaserEditor', { when: 'user' });

  // Make sure that aposScripts and aposStylesheets summon our assets

  // We need the editor for teaser feeds. (TODO: consider separate script lists for
  // resources needed also by non-editing users.)
  that.pushAsset('script', 'content', { when: 'always' });
  that.pushAsset('script', 'editor', { when: 'user' });
  that.pushAsset('stylesheet', 'content', { when: 'always' });

  that.widget = true;
  that.label = options.label || 'Teaser';
  that.css = options.css || 'teaser';
  that.icon = options.icon || 'icon-teaser';

  that.jsonProperties = [ '_ajax' ];

  that.sanitize = function(item) {
  	console.log("sanitize");
    item.limit = parseInt(item.limit, 10);
  };

  that.renderWidget = function(data) {
  	console.log("renderWidget", data);
    try {
      if (data.item._ajax) {
        // We've decided to let the browser
        // fetch this with a separate AJAX requet
        return '';
      } else {
        // We're rendering it now, during the page load,
        // server side
        return that.render('teaser', data);
      }
    } catch (e) {
      // No fatal crashes on other people's bad data please
      console.error('teaser feed rendering error:');
      console.error(e);
      console.error(data.item);
      return '';
    }
  };

  app.get('/apos-teaser/render-teaser', function(req, res) {
  	console.log("app.get");
    that.sanitize(req.query);
    delete req.query._ajax;
    return res.send(that.renderWidget({ item: req.query }));
  });

  // Loader method for the widget
  that.load = function(req, item, callback) {
    console.log("load", item);
    return setImmediate(callback);
  };

  apos.addWidgetType('teaser', that);

  return setImmediate(function() { return callback(null); });
}
