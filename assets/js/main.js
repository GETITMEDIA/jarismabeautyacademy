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


    // Back to top button
    $(window).scroll(function () {
        $('.back-to-top').toggleClass('show', $(this).scrollTop() > 300);
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


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

})(jQuery);
