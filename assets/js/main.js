(function ($) {
    "use strict";

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs (skipped when the visitor prefers reduced motion)
    if (typeof WOW !== 'undefined' && !reduceMotion) {
        new WOW().init();
    }


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('position-fixed bg-dark shadow-sm');
        } else {
            $('.navbar').removeClass('position-fixed bg-dark shadow-sm');
        }
    });


    // Back to top button with Circular Progress & Live Percentage
    var initBackToTopProgress = function () {
        var $btn = $('.back-to-top');
        if (!$btn.length) {
            return;
        }

        // Auto-inject circular SVG progress ring and percentage markup if not already present
        if (!$btn.find('.progress-circle').length) {
            $btn.html(
                '<svg class="progress-circle" width="56" height="56" viewBox="0 0 56 56">' +
                    '<circle class="progress-bg" cx="28" cy="28" r="24"></circle>' +
                    '<circle class="progress-bar" cx="28" cy="28" r="24"></circle>' +
                '</svg>' +
                '<div class="back-to-top-inner">' +
                    '<i class="fa fa-arrow-up" aria-hidden="true"></i>' +
                    '<span class="scroll-percent">0%</span>' +
                '</div>'
            );
        }

        var $circle = $btn.find('.progress-bar');
        var $pctText = $btn.find('.scroll-percent');
        var circumference = 2 * Math.PI * 24; // ~150.796

        var ticking = false;
        var updateProgress = function () {
            var scroll = $(window).scrollTop();
            var docHeight = $(document).height() - $(window).height();
            var percent = 0;

            if (docHeight > 0) {
                percent = Math.round((scroll / docHeight) * 100);
                percent = Math.max(0, Math.min(100, percent));
            }

            var offset = circumference - (percent / 100) * circumference;
            $circle.css('stroke-dashoffset', offset);
            $pctText.text(percent + '%');

            if (scroll > 180) {
                $btn.addClass('show');
            } else {
                $btn.removeClass('show');
            }

            ticking = false;
        };

        var requestTick = function () {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        $(window).on('scroll resize', requestTick);

        $btn.on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, 600);
            return false;
        });

        updateProgress();
    };
    initBackToTopProgress();


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: !reduceMotion,
        autoplayHoverPause: true,
        smartSpeed: 900,
        loop: true,
        margin: 24,
        nav: false,
        dots: true,
        responsive: {
            0: {items: 1},
            768: {items: 2},
            1200: {items: 3}
        }
    });


    // Testimonials: Read More / Read Less for reviews longer than the clamp
    var $testimonials = $('.testimonial-carousel');
    var addReadToggles = function () {
        $('.testimonial-card').each(function () {
            var $card = $(this);
            var text = $card.find('.testimonial-text')[0];
            if ($card.find('.read-toggle').length || $card.hasClass('expanded')) {
                return;
            }
            if (text.scrollHeight > text.clientHeight + 2) {
                $('<button type="button" class="read-toggle" aria-expanded="false">Read More</button>').insertAfter(text);
            }
        });
    };
    addReadToggles();
    $(window).on('load resize', addReadToggles);
    $(document).on('click', '.read-toggle', function () {
        var $card = $(this).closest('.testimonial-card');
        var open = !$card.hasClass('expanded');
        $card.toggleClass('expanded', open);
        $(this).text(open ? 'Read Less' : 'Read More').attr('aria-expanded', open);
        // Hold the slide still while someone is reading a full review
        if (!reduceMotion) {
            $testimonials.trigger(open ? 'stop.owl.autoplay' : 'play.owl.autoplay');
        }
    });


    // Photo lightbox (What Sets Us Apart gallery)
    var $lightbox = $('#lightbox');
    if ($lightbox.length) {
        var $items = $('.bento-item');
        var $lbImg = $lightbox.find('.lb-img');
        var current = 0;
        var lastFocus = null;
        var show = function (i) {
            current = (i + $items.length) % $items.length;
            var src = $items.eq(current).find('img').attr('src');
            $lbImg.removeAttr('style').attr('src', src);
            $lbImg[0].style.animation = 'none';
            void $lbImg[0].offsetWidth; // restart the zoom-in animation
            $lbImg[0].style.animation = '';
            $lightbox.find('.lb-count').text((current + 1) + ' / ' + $items.length);
        };
        var open = function (i) {
            lastFocus = document.activeElement;
            show(i);
            $lightbox.prop('hidden', false);
            $('body').addClass('lb-open');
            $lightbox.find('.lb-close').trigger('focus');
        };
        var close = function () {
            $lightbox.prop('hidden', true);
            $('body').removeClass('lb-open');
            if (lastFocus) {
                lastFocus.focus();
            }
        };
        $items.on('click', function () {
            open($(this).data('index'));
        });
        $lightbox.find('.lb-close').on('click', close);
        $lightbox.find('.lb-prev').on('click', function () { show(current - 1); });
        $lightbox.find('.lb-next').on('click', function () { show(current + 1); });
        $lightbox.on('click', function (e) {
            if (e.target === this || $(e.target).hasClass('lb-stage')) {
                close();
            }
        });
        $(document).on('keydown', function (e) {
            if ($lightbox.prop('hidden')) {
                return;
            }
            if (e.key === 'Escape') { close(); }
            if (e.key === 'ArrowLeft') { show(current - 1); }
            if (e.key === 'ArrowRight') { show(current + 1); }
        });
        var touchX = null;
        $lightbox.on('touchstart', function (e) {
            touchX = e.originalEvent.touches[0].clientX;
        }).on('touchend', function (e) {
            if (touchX === null) {
                return;
            }
            var dx = e.originalEvent.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) {
                show(current + (dx < 0 ? 1 : -1));
            }
            touchX = null;
        });
    }


    // Counters: count up once when scrolled into view
    var runCounter = function (el) {
        var $el = $(el);
        var target = parseInt($el.data('to'), 10) || 0;
        if (reduceMotion) {
            $el.text(target);
            return;
        }
        $({value: 0}).animate({value: target}, {
            duration: 2000,
            easing: 'swing',
            step: function () {
                $el.text(Math.floor(this.value));
            },
            complete: function () {
                $el.text(target);
            }
        });
    };
    if ('IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {threshold: 0.4});
        $('.counter-number').each(function () {
            if (!reduceMotion) {
                $(this).text('0'); // the HTML holds the final value for no-JS visitors
            }
            counterObserver.observe(this);
        });
    } else {
        $('.counter-number').each(function () {
            runCounter(this);
        });
    }


    // Contact form: the static site has no mail server, so the message is
    // handed to the visitor's email app, pre-filled and addressed to the academy.
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        var form = this;
        if (form.website && form.website.value) {
            return; // honeypot filled in: ignore bots
        }
        var to = $(form).data('mailto');
        var field = function (name) {
            return $.trim(form[name].value);
        };
        var body = [
            'Name: ' + field('name'),
            'Email: ' + field('email'),
            'Phone no: ' + field('phone'),
            '',
            field('message')
        ].join('\n');
        var subject = field('subject') || 'Website enquiry';
        window.location.href = 'mailto:' + to +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
        $('#formStatus').addClass('show');
    });


    // Dynamic Timeline Scroll Line Animation & Node Activation
    var initTimelineScrollProgress = function () {
        var $track = $('.journey-timeline-track');
        if (!$track.length) {
            return;
        }

        // Prepend dynamic progress line if not present
        var $progress = $track.find('.journey-timeline-progress');
        if (!$progress.length) {
            $progress = $('<div class="journey-timeline-progress" aria-hidden="true"></div>');
            $track.prepend($progress);
        }

        var $milestones = $track.find('.journey-milestone-item');
        var $stepperDots = $('.journey-step-node');

        // Smooth click-to-scroll on stepper nodes
        $stepperDots.each(function (index) {
            $(this).css('cursor', 'pointer').attr('tabindex', '0').on('click keydown', function (e) {
                if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var $target = $milestones.eq(index);
                    if ($target.length) {
                        $('html, body').animate({
                            scrollTop: $target.offset().top - 90
                        }, 500);
                    }
                }
            });
        });

        var ticking = false;
        var updateTimeline = function () {
            var trackOffset = $track.offset().top;
            var trackHeight = $track.outerHeight();
            var windowScroll = $(window).scrollTop();
            var windowHeight = $(window).height();

            // Progress trigger line is at 55% of the viewport height
            var triggerPoint = windowScroll + (windowHeight * 0.55);

            var startOffset = trackOffset + 30;
            var totalAvailableHeight = trackHeight - 60;

            if (totalAvailableHeight <= 0) {
                ticking = false;
                return;
            }

            var currentDrawnPx = triggerPoint - startOffset;
            var progressPercent = (currentDrawnPx / totalAvailableHeight) * 100;
            progressPercent = Math.max(0, Math.min(100, progressPercent));

            $progress.css('height', progressPercent + '%');

            // Activate nodes, cards, and stepper nodes as line reaches them
            $milestones.each(function (index) {
                var $item = $(this);
                var itemTop = $item.offset().top;
                var $node = $item.find('.journey-spine-node');
                var $card = $item.find('.journey-card');
                var $stepper = $stepperDots.eq(index);

                if (triggerPoint >= itemTop + 10) {
                    $node.addClass('active');
                    $card.addClass('active');
                    $stepper.addClass('active');
                } else {
                    $node.removeClass('active');
                    $card.removeClass('active');
                    $stepper.removeClass('active');
                }
            });

            ticking = false;
        };

        var requestUpdate = function () {
            if (!ticking) {
                requestAnimationFrame(updateTimeline);
                ticking = true;
            }
        };

        $(window).on('scroll resize', requestUpdate);
        setTimeout(updateTimeline, 200);
    };
    initTimelineScrollProgress();


    // Footer attribution & copyright
    var renderFooterAttribution = function () {
        var $copyright = $('.footer .copyright');
        if ($copyright.length) {
            var currentYear = new Date().getFullYear();
            $copyright.html(
                '<p class="mb-1">Copyright &copy; ' + currentYear + ' <a class="border-bottom" href="index.html">jarismabeautyacademy.com</a></p>' +
                '<p class="mb-0">Proudly designed by <a class="border-bottom" href="https://www.getitmediasolutions.com/" target="_blank" rel="noopener">Getitmedia Solutions</a></p>'
            );
        }
    };
    renderFooterAttribution();

})(jQuery);

