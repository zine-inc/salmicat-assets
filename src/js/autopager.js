/**
 * autopager.js v0.1.2
 * http://zine-inc.github.io/salmicat-assets/
 * (c) wata, MIT License.
 */

if (typeof jQuery === 'undefined') {
    throw new Error('This JavaScript requires jQuery')
}

(function($) {
    'use strict';

    if (typeof $.pjax === 'undefined') {
        throw new Error('This JavaScript requires jquery-pjax')
    }

    // AUTOPAGER CLASS DEFINITION
    // =========================

    var AutoPager = function(el, opts) {
        var that = this;

        that.$document      = $(document),
        that.$body          = $(document.body),
        that.$scrollElement = $(el).is(document.body) ? $(window) : $(el),
        that.opts           = opts,
        that.initialURL     = parseURL(location.href),
        that.isLoading      = false,
        that.loadedLinks    = [that.initialURL.pathname];

        that.$scrollElement
            .on('scroll', $.proxy(that.process, that))
            .on('autopager:scrollBottom', $.proxy(that.load, that));

        that.$document
            .on('pjax:success' , $.proxy(that.pjaxSuccess , that))
            .on('pjax:error'   , $.proxy(that.pjaxError   , that))
            .on('pjax:complete', $.proxy(that.pjaxComplete, that))
            .on('pjax:end'     , $.proxy(that.pjaxEnd     , that));
    };

    AutoPager.VERSION = '0.1.1';

    AutoPager.DEFAULTS = {
        proximity         : 0.9,
        push              : false,
        replace           : false,
        timeout           : 0,
        scrollTo          : false,
        entryClassName    : '.ct-entry',
        linkClassName     : '.ct-link',
        containerClassName: '.ct-container'
    };

    AutoPager.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
    };

    AutoPager.prototype.process = function() {
        var scrollHeight = this.getScrollHeight(),
            scrollPosition = this.$scrollElement.height() + this.$scrollElement.scrollTop();

        if ((scrollHeight * this.opts.proximity) <= scrollPosition) {
            var e = $.Event('autopager:scrollBottom', {});
            this.$scrollElement.trigger(e);
            if (e.isDefaultPrevented()) return;
        }
    };

    AutoPager.prototype.load = function() {
        if (this.isLoading) return;
        this.isLoading = true;

        var that = this,
            $entry = $(that.opts.entryClassName).filter(':last'),
            $links = $entry.find(that.opts.linkClassName);

        $links.each(function() {
            var $el = $(this),
                url = parseURL($el.attr('href')),
                entryId = $el.data('entry-id');

            if (that.loadedLinks.indexOf(url.pathname) === -1) {
                var pjaxOpts = {};
                pjaxOpts.url = url.href;
                pjaxOpts.container = that.opts.containerClassName + ':last',
                pjaxOpts.fragment = '#' + entryId,
                pjaxOpts.push = that.opts.push,
                pjaxOpts.replace = that.opts.replace,
                pjaxOpts.scrollTo = that.opts.scrollTo,
                pjaxOpts.timeout = that.opts.timeout;

                $.pjax(pjaxOpts);

                that.loadedLinks.push(url.pathname);

                return false;
            }
        });
    };

    AutoPager.prototype.pjaxSuccess = function() {
        this.isLoading = false;

        // pjax:success alias
        var e = $.Event('autopager:success', {});
        this.$scrollElement.trigger(e, arguments);
        if (e.isDefaultPrevented()) return;
    };

    AutoPager.prototype.pjaxError = function() {
        // pjax:error alias
        var e = $.Event('autopager:error', {});
        this.$scrollElement.trigger(e, arguments);
        if (e.isDefaultPrevented()) return;
    };

    AutoPager.prototype.pjaxComplete = function() {
        // pjax:complete alias
        var e = $.Event('autopager:complete', {});
        this.$scrollElement.trigger(e, arguments);
        if (e.isDefaultPrevented()) return;
    };

    AutoPager.prototype.pjaxEnd = function() {
        // pjax:end alias
        var e = $.Event('autopager:end', {});
        this.$scrollElement.trigger(e, arguments);
        if (e.isDefaultPrevented()) return;
    };

    function parseURL(url) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    }

    // AUTOPAGER PLUGIN DEFINITION
    // ===========================

    function Plugin(opt) {
        return this.each(function() {
            var opts = $.extend({}, AutoPager.DEFAULTS, typeof opt === 'object' && opt);
            new AutoPager(this, opts);
        });
    }

    var old = $.fn.autopager;

    $.fn.autopager             = Plugin;
    $.fn.autopager.Constructor = AutoPager;

    // AUTOPAGER NO CONFLICT
    // ====================

    $.fn.autopager.noConflict = function() {
        $.fn.autopager = old;
        return this;
    };

    // AUTOPAGER DATA-API
    // ===========================

    $(window).on('load', function() {
        $('[data-autopager]').each(function() {
            var $el = $(this);
            $el.autopager($el.data());
        })
    });

})(jQuery);
