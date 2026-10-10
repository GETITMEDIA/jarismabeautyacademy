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


    // Back to top button with Circular Progress Border (No Percentage Text)
    var initBackToTopProgress = function () {
        var $btn = $('.back-to-top');
        if (!$btn.length) {
            return;
        }

        // Auto-inject circular SVG progress ring markup if not already present
        if (!$btn.find('.progress-circle').length) {
            $btn.html(
                '<svg class="progress-circle" width="56" height="56" viewBox="0 0 56 56">' +
                    '<circle class="progress-bg" cx="28" cy="28" r="24"></circle>' +
                    '<circle class="progress-bar" cx="28" cy="28" r="24"></circle>' +
                '</svg>' +
                '<div class="back-to-top-inner">' +
                    '<i class="fa fa-arrow-up" aria-hidden="true"></i>' +
                '</div>'
            );
        }

        var $circle = $btn.find('.progress-bar');
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


    // Contact form validation & mailto dispatch
    var initContactFormValidation = function () {
        var $form = $('#contactForm');
        if (!$form.length) {
            return;
        }

        var $name = $('#name');
        var $email = $('#email');
        var $phone = $('#phone');
        var $phoneGroup = $phone.closest('.phone-input-group');
        var $subject = $('#subject');
        var $message = $('#message');
        var $status = $('#formStatus');

        var showError = function ($input, $errorEl, message, $container) {
            var $target = $container || $input;
            $target.addClass('is-invalid').removeClass('is-valid');
            $errorEl.text(message).addClass('show');
        };

        var clearError = function ($input, $errorEl, $container) {
            var $target = $container || $input;
            $target.removeClass('is-invalid').addClass('is-valid');
            $errorEl.text('').removeClass('show');
        };

        var validateName = function () {
            var val = $.trim($name.val());
            var $err = $('#nameError');
            if (!val) {
                showError($name, $err, 'Please enter your name.');
                return false;
            }
            if (val.length < 2) {
                showError($name, $err, 'Name must be at least 2 characters.');
                return false;
            }
            if (!/^[a-zA-Z\s'.]+$/.test(val)) {
                showError($name, $err, 'Name should contain letters only.');
                return false;
            }
            clearError($name, $err);
            return true;
        };

        var validateEmail = function () {
            var val = $.trim($email.val());
            var $err = $('#emailError');
            var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!val) {
                showError($email, $err, 'Please enter your email address.');
                return false;
            }
            if (!emailRegex.test(val)) {
                showError($email, $err, 'Please enter a valid email address (e.g. name@example.com).');
                return false;
            }
            clearError($email, $err);
            return true;
        };

        var validatePhone = function () {
            var val = $.trim($phone.val());
            var $err = $('#phoneError');
            if (!val) {
                showError($phone, $err, 'Please enter your 10-digit mobile number.', $phoneGroup);
                return false;
            }
            if (val.length < 10) {
                showError($phone, $err, 'Mobile number must be exactly 10 digits (entered ' + val.length + ').', $phoneGroup);
                return false;
            }
            if (!/^[6-9]\d{9}$/.test(val)) {
                showError($phone, $err, 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.', $phoneGroup);
                return false;
            }
            clearError($phone, $err, $phoneGroup);
            return true;
        };

        var validateSubject = function () {
            var val = $.trim($subject.val());
            var $err = $('#subjectError');
            if (!val) {
                showError($subject, $err, 'Please enter a subject.');
                return false;
            }
            if (val.length < 3) {
                showError($subject, $err, 'Subject must be at least 3 characters.');
                return false;
            }
            clearError($subject, $err);
            return true;
        };

        var validateMessage = function () {
            var val = $.trim($message.val());
            var $err = $('#messageError');
            if (!val) {
                showError($message, $err, 'Please enter your message.');
                return false;
            }
            if (val.length < 10) {
                showError($message, $err, 'Message must be at least 10 characters.');
                return false;
            }
            clearError($message, $err);
            return true;
        };

        // Restrict phone input to numeric digits only and auto-clean pasted +91 / 0
        $phone.on('keydown', function (e) {
            // Allow Backspace, Delete, Tab, Escape, Enter, Arrow keys
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                // Allow Ctrl/Cmd+A, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X
                (e.ctrlKey === true || e.metaKey === true) ||
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                return;
            }
            // Ensure that it is a number and stop the keypress if not
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        $phone.on('input', function () {
            var raw = $(this).val();
            var digits = raw.replace(/\D/g, '');
            // Auto strip prefix 91 or 0 if pasted
            if (digits.length > 10 && digits.indexOf('91') === 0) {
                digits = digits.slice(2);
            } else if (digits.length > 10 && digits.indexOf('0') === 0) {
                digits = digits.slice(1);
            }
            digits = digits.slice(0, 10);
            if (raw !== digits) {
                $(this).val(digits);
            }
            if ($(this).data('touched')) {
                validatePhone();
            }
        });

        // Real-time validations on blur and subsequent input
        $name.on('blur', function () { $(this).data('touched', true); validateName(); })
             .on('input', function () { if ($(this).data('touched')) validateName(); });

        $email.on('blur', function () { $(this).data('touched', true); validateEmail(); })
              .on('input', function () { if ($(this).data('touched')) validateEmail(); });

        $phone.on('blur', function () { $(this).data('touched', true); validatePhone(); })
              .on('input', function () { if ($(this).data('touched')) validatePhone(); });

        $subject.on('blur', function () { $(this).data('touched', true); validateSubject(); })
                .on('input', function () { if ($(this).data('touched')) validateSubject(); });

        $message.on('blur', function () { $(this).data('touched', true); validateMessage(); })
                .on('input', function () { if ($(this).data('touched')) validateMessage(); });

        // Submit handler -> WhatsApp dispatch
        $form.on('submit', function (e) {
            e.preventDefault();
            var form = this;
            if (form.website && form.website.value) {
                return; // honeypot caught a bot
            }

            // Mark all fields touched
            $name.data('touched', true);
            $email.data('touched', true);
            $phone.data('touched', true);
            $subject.data('touched', true);
            $message.data('touched', true);

            var validName = validateName();
            var validEmail = validateEmail();
            var validPhone = validatePhone();
            var validSubject = validateSubject();
            var validMessage = validateMessage();

            if (!validName || !validEmail || !validPhone || !validSubject || !validMessage) {
                $status.removeClass('show');
                var $firstInvalid = $form.find('.is-invalid').first();
                if ($firstInvalid.length) {
                    if ($firstInvalid.is('input, textarea')) {
                        $firstInvalid.focus();
                    } else {
                        $firstInvalid.find('input').focus();
                    }
                    $('html, body').animate({
                        scrollTop: $firstInvalid.offset().top - 140
                    }, 400);
                }
                return false;
            }

            var whatsappNumber = $form.data('whatsapp') || '919994338386';
            var nameVal = $.trim($name.val());
            var emailVal = $.trim($email.val());
            var phoneVal = $.trim($phone.val());
            var subjectVal = $.trim($subject.val());
            var messageVal = $.trim($message.val());

            var whatsappMessage = [
                '✨ *New Enquiry - Jarisma Beauty Academy* ✨',
                '',
                '👤 *Name:* ' + nameVal,
                '📧 *Email:* ' + emailVal,
                '📱 *Phone:* +91 ' + phoneVal,
                '📝 *Subject:* ' + subjectVal,
                '',
                '💬 *Message:*',
                messageVal,
                '',
                '🌐 *Source:* jarismabeautyacademy.com'
            ].join('\n');

            var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(whatsappMessage);

            // Display status message with clickable direct fallback
            $('#whatsappDirectBtn').attr('href', whatsappUrl);
            $('#whatsappDirectLinkContainer').show();
            $status.addClass('show');

            // Open WhatsApp in a new tab/window
            var opened = window.open(whatsappUrl, '_blank');
            if (!opened || opened.closed || typeof opened.closed === 'undefined') {
                // If popup blocker intervened, redirect current window
                window.location.href = whatsappUrl;
            }
        });
    };
    initContactFormValidation();


    // Pure Content Timeline Interaction (Smooth Navigation & Scroll Tracking)
    var initPureTimeline = function () {
        var $track = $('.pure-timeline-track');
        if (!$track.length) {
            return;
        }

        var $nodes = $track.find('.timeline-node-item');
        var $flowSteps = $('.timeline-flow-bar .flow-step');

        $flowSteps.each(function (index) {
            $(this).css('cursor', 'pointer').attr('tabindex', '0').on('click keydown', function (e) {
                if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var $target = $nodes.eq(index);
                    if ($target.length) {
                        $('html, body').animate({
                            scrollTop: $target.offset().top - 100
                        }, 500);
                    }
                }
            });
        });
    };
    initPureTimeline();


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

