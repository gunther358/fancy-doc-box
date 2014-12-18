$(document).ready(function() {
	$('.fancybox, .fancybox-img').fancybox();
});

(function ($) {
	//Shortcut for fancyBox object
	var F = $.fancybox;

	$.extend(F.defaults, {
		prevEffect: 'none',
		nextEffect: 'none',
		autoScale : false,
		padding: 10,
		mouseWheel: false,
		fitToView: true,
		autoSize: false,
		autoDimensions: false,
		height: 900,
		loop: false,
		arrows: false,
		closeBtn: false,
		data: {},
		buttonTpl: $('<script type="text/template" id="fancybox-buttons-tpl">' +
						'<div id="fancybox-buttons">' +
							'<ul>' +
							'<% if (typeof fancyboxPrev !== "undefined" && fancyboxPrev) { %><li><a class="btnPrev" title="Previous" href="javascript:"></a></li><% } %>' +
							'<% if (typeof fancyboxDownloadUrl !== "undefined") { %><li><a class="btnDownload" title="Pobierz plik" href="<%= fancyboxDownloadUrl %>"></a></li><% } %>' +
							'<% if (typeof fancyboxPrintUrl !== "undefined") { %><li><a class="btnPrint" title="Drukuj" href="<%= fancyboxPrintUrl %>"></a></li><% } %>' +
							'<% if (typeof fancyboxNext !== "undefined" && fancyboxNext) { %><li><a class="btnNext" title="Next" href="javascript:"></a></li><% } %>' +
							'</ul>' +
							'<a class="btnClose" title="Zamknij" href="javascript:"></a>' +
						'</div>' +
					'</script>'),
		helpers: {
			title: { type : 'outside', position: 'top' },
			buttons: {},
			size: {},
			overlay: {
				speedOut : 0
			}
		},
		beforeLoad : function() {
			if (this.element) {
				$.extend(this.data, this.element.data());
			}
		}
	});

	F.helpers.buttons = {
		defaults : {
			skipSingle : false,
			position   : 'top'
		},

		tpl: null,
		list : null,

		beforeLoad: function (opts, obj) {
			//Add margin for button bar
			obj.margin[opts.position === 'bottom' ? 2 : 0 ] += 40;

			var config = {};

			//Data can be empty when initializing from JSON
			if ($.isEmptyObject(obj.data)) {
				config = obj;
			} else {
				config = obj.data;
			}

			config.fancyboxPrev = config.fancyboxNext = obj.group.length > 1;

			var tpl = _.template($(obj.buttonTpl).html());

			this.tpl = tpl(config);
		},

		afterShow: function (opts, obj) {
			if (this.list) {
				this.list.remove();
			}

			this.list = $(this.tpl).addClass(opts.position).appendTo('body').hide();

			var buttons = {
				prev: this.list.find('.btnPrev').click( F.prev ),
				next: this.list.find('.btnNext').click( F.next ),
				close: this.list.find('.btnClose').click( F.close )
			};

			if (obj.index > 0 || obj.loop) {
				buttons.prev.removeClass('btnDisabled');
			} else {
				buttons.prev.addClass('btnDisabled');
			}

			if (obj.loop || obj.index < obj.group.length - 1) {
				buttons.next.removeClass('btnDisabled');
			} else {
				buttons.next.addClass('btnDisabled');
			}

			this.buttons = buttons;
		},

		beforeClose: function () {
			if (this.list) {
				this.list.remove();
			}

			this.list = null;
			this.buttons = null;
		},

		onUpdate: function() {
			this.list.show();

			var sum = 0;

			this.list.find('li').each(function() {
				sum += $(this).width();
			});

			var position = (this.list.width() / 2) - (sum / 2);

			this.list.css({
				left: position
			});
		}
	};

	F.helpers.size = {
		beforeLoad: function (opts, obj) {
			var config = {};

			//Data can be empty when initializing from JSON
			if ($.isEmptyObject(obj.data)) {
				config = obj;
			} else {
				config = obj.data;
			}

			var width = config.fancyboxWidth;
			if (width) {
				obj.width = parseInt(width);
			}

			var height = config.fancyboxHeight;
			if (height) {
				obj.height = parseInt(height);
			}
		}
	};

}(jQuery));