// Main Script
document.addEventListener('DOMContentLoaded', () => {
    console.log('Crystal Planet scripts loaded');

    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const body = document.body;

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');

            // Prevent scrolling when menu is open
            if (nav.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close menu on link click
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // Scroll Parallax for About Section
    const aboutSection = document.querySelector('.about');
    const parallaxBg = document.querySelector('.about__parallax-bg');

    if (aboutSection && parallaxBg) {
        window.addEventListener('scroll', () => {
            const sectionTop = aboutSection.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;

            // Start animating when section is in view
            if (sectionTop < screenHeight && sectionTop + aboutSection.offsetHeight > 0) {
                const speed = parallaxBg.getAttribute('data-depth') || 0.5;
                const yPos = (sectionTop - screenHeight * 0.5) * speed;
                parallaxBg.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
    });
});



// Swiper Initialization
const proudSlider = new Swiper('.proud-slider', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

// Menu Slider Initialization
const menuSlider = new Swiper('.menu-swiper', {
    loop: true,
    slidesPerView: 1, // Default to 1 slide
    spaceBetween: 20,
    navigation: {
        nextEl: '.menu-swiper-next',
        prevEl: '.menu-swiper-prev',
    },
});

// Branches Logic
const pins = document.querySelectorAll('.branches__pin');
const popups = document.querySelectorAll('.branches__popup');
const closeButtons = document.querySelectorAll('.branches__close');
const mapContainer = document.querySelector('.branches__wrapper');

// Init Branch Swipers
const branchSwipers = document.querySelectorAll('.branch-swiper');
branchSwipers.forEach(swiperEl => {
    new Swiper(swiperEl, {
        loop: true,
        observer: true,
        observeParents: true,
        grabCursor: true,
        nested: true,
        touchMoveStopPropagation: true, // Stop swipe event from bubbling
        touchStartPreventDefault: false, // Better mobile scrolling behavior
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
});

// Stop events inside popup from bubbling to document (prevents accidental closing)
popups.forEach(popup => {
    popup.addEventListener('click', (e) => e.stopPropagation());
    popup.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    popup.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
});

// Pin Click Event
pins.forEach(pin => {
    pin.addEventListener('click', (e) => {
        const id = pin.getAttribute('data-id');
        const targetPopup = document.getElementById('branch-popup-' + id);

        // Close all
        popups.forEach(p => p.classList.remove('active'));
        pins.forEach(p => p.classList.remove('active'));

        // Open target
        if (targetPopup) {
            targetPopup.classList.add('active');
            pin.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock body scroll
            document.documentElement.style.overflow = 'hidden'; // Lock html scroll (for some browsers)
            if (mapContainer) mapContainer.style.overflowX = 'hidden'; // Lock map scroll
        }
    });
});

// Close Button Event
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        popups.forEach(p => p.classList.remove('active'));
        pins.forEach(p => p.classList.remove('active'));
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (mapContainer) mapContainer.style.overflowX = '';
    });
});

// Close on click outside (optional)
document.addEventListener('click', (e) => {
    if (!e.target.closest('.branches__popup') && !e.target.closest('.branches__pin')) {
        popups.forEach(p => p.classList.remove('active'));
        pins.forEach(p => p.classList.remove('active'));
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (mapContainer) mapContainer.style.overflowX = '';
    }
});

const initRetailSlider = () => {
    const swiperContainer = document.querySelector('.retail-swiper');
    if (!swiperContainer) return;

    // 1. Функция анимации (теперь чистая и без потери данных)
    const animateCounter = (el) => {
        const target = +el.dataset.target || 0; // Берем из атрибута!
        const duration = 1000; // мс
        const start = 0;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing (опционально, для плавности)
            // const ease = 1 - Math.pow(1 - progress, 3); 
            
            const current = Math.floor(progress * target);
            el.textContent = `${current} +`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = `${target} +`; // Фиксация финала
            }
        };

        requestAnimationFrame(step);
    };

    // 2. Функция запуска анимации на активном слайде
    const runActiveCounters = (swiper) => {
        // Ищем счетчики только внутри активных слайдов
        const activeSlides = swiper.slides[swiper.activeIndex]; 
        // Если slidesPerView: 'auto', возможно нужно искать в swiper.visibleSlides (если есть такой массив в твоей версии)
        // Для простоты берем активный:
        const counters = activeSlides.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            // Сброс перед запуском не обязателен, если мы перезаписываем,
            // но для визуала можно обнулить
            counter.textContent = '0 +';
            animateCounter(counter);
        });
    };

    // 3. Инициализация Swiper
    const retailSwiper = new Swiper('.retail-swiper', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: 20,
        centeredSlides: true,
        speed: 500,
        
        mousewheel: {
            enabled: true,
            forceToAxis: true, 
            releaseOnEdges: true,
        },

        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true, 
            snapOnRelease: false, 
            hide: false, 
        },

        breakpoints: {
            320: { spaceBetween: 15 },
            768: { spaceBetween: 20 }
        },

        on: {
            init: function (swiper) {
                runActiveCounters(swiper);
            },
            slideChange: function (swiper) {
                runActiveCounters(swiper);
            }
        }
    });
};

// Вызов
document.addEventListener('DOMContentLoaded', initRetailSlider);


document.addEventListener('DOMContentLoaded', function() {
    const pins = document.querySelectorAll('.map-pin');
    const overlay = document.getElementById('popup-overlay');
    const closeButtons = document.querySelectorAll('.close-popup');
    
    // Функция закрытия всего
    const closeAll = () => {
        document.querySelectorAll('.branches__popup').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Возвращаем скролл сайта
    };

    // Клик по пину
    pins.forEach(pin => {
        pin.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = pin.getAttribute('data-id');
            const popup = document.getElementById(`branch-popup-${id}`);
            
            if (popup) {
                closeAll(); // Закрываем старое
                
                popup.classList.add('active');
                overlay.classList.add('active');
                pin.classList.add('active');
                
                // Блокируем скролл сайта, чтобы не елозил фон пока читаешь попап
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Закрытие по клику на оверлей
    overlay.addEventListener('click', closeAll);

    // Закрытие по крестику
    closeButtons.forEach(btn => btn.addEventListener('click', closeAll));
});

document.addEventListener('DOMContentLoaded', function() {
    const teamSwiper = new Swiper('.team-swiper', {
        slidesPerView: 'auto', 
        spaceBetween: 20,   
        grabCursor: true,   
        
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true, 
            snapOnRelease: true, 
            dragSize: 'auto',
        },

       
        mousewheel: {
            enabled: true,
            forceToAxis: true, 
            releaseOnEdges: true, 
        },
    });
});
// Lenis Smooth Scroll
document.addEventListener('DOMContentLoaded', () => {
    // Check if Lenis is defined
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Connect AOS to Lenis (optional optimization)
        // AOS usually works fine, but refreshing on scroll helps sync
        /* 
        lenis.on('scroll', () => {
             AOS.refresh(); 
        }); 
        */
        
        console.log('Lenis initialized');

        // Smooth Scroll for Anchor Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        lenis.scrollTo(targetElement);
                    }
                }
            });
        });
    }
});
