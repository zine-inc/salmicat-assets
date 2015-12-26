(function($, woothee, FastClick) {
    'use strict';

    var ua = woothee.parse(navigator.userAgent);

    window.addEventListener('load', function() { FastClick.attach(document.body); }, false);

    // RESPONSIVE VIDEOS
    // ===============================

    (function() {
        'use strict';

        var $all_videos = $('.entry-content').find('iframe[src*="player.vimeo.com"], iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"], iframe[src*="dailymotion.com"],iframe[src*="kickstarter.com"][src*="video.html"], object, embed'),
    		$window     = $(window),
    		$more_site  = $('#more-site'),
    		$card       = $('.title-card'),
    		window_height,
            window_width,
    		is_rtl = ($('body').hasClass('rtl')) ? false : true;

    	$all_videos.not('object object').each(function() {
    		var $video = $(this);

    		if ($video.parents( 'object').length) return;

    		if (!$video.prop('id')) $video.attr('id', 'rvw' + Math.floor(Math.random() * 999999));

    		$video
    			.wrap('<div class="responsive-video-wrapper" style="padding-top: ' + ($video.attr('height') / $video.attr('width') * 100) + '%" />')
    			.removeAttr('height')
    			.removeAttr('width');
    	});
    })();

    // OFF SCREEN NAV
    // ===============================

    $(document)
        .on('click', '.off-screen-nav-button', function() {
            $('.effeckt-off-screen-nav').addClass('effeckt-show');
            $('.js-modal-backdrop').height($(document).height()).show();
        })
        .on('click', '.effeckt-off-screen-nav-close, .js-modal-backdrop', function() {
            $('.effeckt-off-screen-nav').removeClass('effeckt-show');
            $('.js-modal-backdrop').hide();
        });

    // SMOOTH SCROLL
    // ===============================

    $(document).on('click', '[data-page-top]', function() {
        $('html, body').animate({
            scrollTop: ($($(this)[0].hash || document.body).offset().top) - 120
        }, 'slow');
        return false;
    });

    // 固定サイドバー
    // ===============================

    (function() {
        'use strict';

        var opts = { top: 80 };

        $(window).load(function() {
            if (ua.category !== 'pc') return;
            if ($('.js-sidebar-fixbox').length === 0) return;

            var $main        = $('.js-main'),
                $sidebar     = $('.js-sidebar'),
                $fixbox      = $('.js-sidebar-fixbox'),
                boxWidth     = $fixbox.outerWidth(true),
                boxHeight    = $fixbox.outerHeight(true),
                boxTop       = $fixbox.offset().top,
                boxMargin    = opts['top'],
                borderHeight = boxHeight + boxMargin,
                borderLine   = boxTop - boxMargin;

            if ($main.height() < $sidebar.height()) return;

            $fixbox.css({ width: boxWidth, top: opts['top'] });

            $(window).scroll(function() {
                var windowHeight = window.innerHeight,
                    windowTop = $(window).scrollTop();

                if (windowTop > borderLine) {
                    borderHeight < windowHeight && $fixbox.css('position', 'fixed');
                } else {
                    $fixbox.css('position', 'static');
                }
            });
        });
    })();

    // ナビゲーション
    // ===============================

    (function() {
        'use strict';

        $(window).on('scroll', { previousTop: 0 }, function() {
            var currentTop = $(window).scrollTop(),
            headerHeight = $('.site-header').height();

            // check if user is scrolling up
            if (currentTop < this.previousTop ) {
                // if scrolling up...
                if (currentTop > 0 && $('.site-header').hasClass('is-fixed')) {
                    $('.site-header').addClass('is-visible');
                } else {
                    $('.site-header').removeClass('is-visible is-fixed');
                }
            } else {
                // if scrolling down...
                $('.site-header').removeClass('is-visible');
                if (currentTop > headerHeight && !$('.site-header').hasClass('is-fixed')) {
                    $('.site-header').addClass('is-fixed');
                }
            }

            this.previousTop = currentTop;
        });
    })();

})(jQuery, woothee, FastClick);
