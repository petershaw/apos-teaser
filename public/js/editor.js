// @class Editor for teaser feed widgets

function AposTeaserWidgetEditor(options) {
	var that = this;

	if (!options.messages) {
		options.messages = {};
	}
	if (!options.messages.missing) {
		options.messages.missing = 'Required information is missing.';
	}

	that.type = 'teaser';
	options.template = '.apos-teaser-editor';

	AposWidgetEditor.call(that, options);

	that.prePreview = getTeaser;
	that.preSave = getTeaser;

	that.afterCreatingEl = function() {
		that.$headline = that.$el.find('[name="headline"]');
		that.$headline.val(that.data.headline);
	
		that.$imageTextOverlay = that.$el.find('[name="imageTextOverlay"]');
		that.$imageTextOverlay.val(that.data.imageTextOverlay);
	
		that.$teasercontent = that.$el.find('[name="teasercontent"]');
		that.$teasercontent.val(that.data.teasercontent);

		setTimeout(function() {
			that.$headline.focus();
		}, 500);
	};
  
	function getTeaser(callback) {
		that.exists = !!that.$headline.val();
		if (that.exists) {
			that.data.headline = that.$headline.val();
			that.data.imageTextOverlay = that.$imageTextOverlay.val();
			that.data.teasercontent = $(that.$teasercontent).val();
		}
		return callback();
	}
}

AposTeaserWidgetEditor.label = 'Teaser';
apos.addWidgetType('teaser');
