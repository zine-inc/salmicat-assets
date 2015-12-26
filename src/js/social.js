/**
 * social.js v0.2.6
 * http://zine-inc.github.io/zine-assets/
 * (c) wata, MIT License.
 */

if (typeof jQuery === 'undefined') {
    throw new Error('This JavaScript requires jQuery')
}

(function($) {
    'use strict';

    // SOCIAL CLASS DEFINITION
    // =========================

    var Social = function(el, opts) {
        this.$el = typeof el !== 'undefined' ? $(el) : undefined,
        this.opts = opts;

        this.getSocialCount();
    };

    Social.VERSION = '0.2.6';

    Social.DEFAULTS = {
        protocol : undefined,
        permalink: undefined,
        social   : undefined,
        timeout  : undefined,
        comma    : true,
        emptyText: '',
        done     : function() {},
        fail     : function() {}
    };

    Social.prototype.getSocialCount = function() {
        this[this.opts.social] && this[this.opts.social].call(this, this.opts.permalink);
    };

    Social.prototype.output = function(count) {
        if (typeof count === 'undefined') count = this.opts.emptyText;
        this.$el && this.$el.text(this.opts.comma ? separate(count) : count);
    };

    Social.prototype.fire = function(type, count, props) {
        switch (type) {
            case 'social:done':
                this.opts.done.call(this, count, this.opts.social, this.opts.permalink);
                break;
            case 'social:fail':
                this.opts.fail.call();
                break;
            default:
                break;
        }

        if (!props) props = {};
        var e = $.Event(type, props), $target = this.$el || $(window);
        $target.trigger(e, [count, this.opts.social, this.opts.permalink]);
        return !e.isDefaultPrevented();
    };

    Social.prototype.fetchYQL = function(url) {
        var that = this, d = $.Deferred(), ajaxOpts = {};

        ajaxOpts.url      = '//query.yahooapis.com/v1/public/yql';
        ajaxOpts.cache    = false;
        ajaxOpts.dataType = 'json';

        ajaxOpts.data        = {};
        ajaxOpts.data.q      = "SELECT content FROM data.headers WHERE url='" + url + "'";
        ajaxOpts.data.format = 'json';
        ajaxOpts.data.env    = 'store://datatables.org/alltableswithkeys';

        if (typeof that.opts.protocol !== 'undefined') ajaxOpts.url = that.opts.protocol + ':' + ajaxOpts.url;
        if (typeof that.opts.timeout !== 'undefined') ajaxOpts.timeout = that.opts.timeout;

        $.ajax(ajaxOpts)
            .done(function(data, status, xhr) {
                d.resolve(data['query']['results']['resources']['content']);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                d.reject();
            });

        return d.promise();
    };

    Social.prototype.facebook = function(url) {
        var that = this, ajaxOpts = {};

        ajaxOpts.url      = '//graph.facebook.com/';
        ajaxOpts.cache    = false;
        ajaxOpts.dataType = 'json';
        ajaxOpts.data     = { id: url };

        if (typeof that.opts.protocol !== 'undefined') ajaxOpts.url = that.opts.protocol + ':' + ajaxOpts.url;

        var req = $.ajax(ajaxOpts);

        req.done(function(data, status, xhr) {
            var count = data['shares'] || 0;
            that.fire('social:done', count);
            that.output(count);
        });

        req.fail(function(xhr, textStatus, errorThrown) {
            that.fire('social:fail');
            that.output();
        });
    };

    Social.prototype.twitter = function(url) {
        var that = this, req = that.fetchYQL('http://jsoon.digitiminimi.com/twitter/count.json?url=' + url)

        req.done(function(content) {
            var count = 0;
            if (content !== null) {
                var m = content.match(/"count":([\d]+)/);
                count = parseInt(m !== null ? m[1] : 0);
            }
            that.fire('social:done', count);
            that.output(count);
        });

        req.fail(function() {
            that.fire('social:fail');
            that.output();
        })
    };

    Social.prototype.hatena = function(url) {
        var that = this, req = that.fetchYQL('http://api.b.st-hatena.com/entry.count?url=' + url)

        req.done(function(content) {
            var count = content !== null ? content : 0;
            that.fire('social:done', count);
            that.output(count);
        });

        req.fail(function() {
            that.fire('social:fail');
            that.output();
        });
    };

    Social.prototype.google = function(url) {
        var that = this, req = that.fetchYQL('https://plusone.google.com/_/+1/fastbutton?hl=ja&url=' + url)

        req.done(function(content) {
            var count = 0;
            if (content !== null) {
                var m = content.match(/window\.__SSR = {c: ([\d]+)/);
                count = parseInt(m !== null ? m[1] : 0);
            }
            that.fire('social:done', count);
            that.output(count);
        });

        req.fail(function() {
            that.fire('social:fail');
            that.output();
        });
    };

    Social.prototype.pocket = function(url) {
        var that = this, req = that.fetchYQL('https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=' + url)

        req.done(function(content) {
            var count = 0;
            if (content !== null) {
                var m = content.match(/<em id="cnt">(\d+)<\/em>/);
                count = parseInt(m !== null ? m[1] : 0);
            }
            that.fire('social:done', count);
            that.output(count);
        });

        req.fail(function() {
            that.fire('social:fail');
            that.output();
        });
    };

    function separate(num) {
        return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }

    // SOCIAL PLUGIN DEFINITION
    // ===========================

    function Plugin(opt) {
        return this.each(function() {
            var opts = $.extend({}, Social.DEFAULTS, typeof opt === 'object' && opt);
            new Social(this, opts);
        });
    }

    var old = $.fn.social;

    $.fn.social             = Plugin;
    $.fn.social.Constructor = Social;

    $.social = function(opt) {
        var opts = $.extend({}, Social.DEFAULTS, typeof opt === 'object' && opt);
        new Social(undefined, opts);
    };

    // SOCIAL NO CONFLICT
    // ====================

    $.fn.social.noConflict = function() {
        $.fn.social = old;
        return this;
    };

    // SOCIAL DATA-API
    // ===========================

    $(window).on('load', function() {
        $('.js-social').each(function() {
            var $el = $(this);
            $el.social($el.data());
        })
    });

})(jQuery);
