/* ============================================
   AIRAS - メインJavaScript
   スムーズスクロール、ナビ制御、フェードインアニメーション
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- 要素の取得 ---
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const fadeElements = document.querySelectorAll('.fade-in');

    // --- ナビバーのスクロール制御 ---
    let lastScrollY = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- ハンバーガーメニュー ---
    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleMenu);

    // ナビリンクをクリックしたらメニューを閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // メニュー外（オーバーレイ部分）をクリックしたらメニューを閉じる
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Escキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // --- スムーズスクロール ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- フェードインアニメーション（Intersection Observer） ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // カード等が複数ある場合、順番にアニメーションを遅延
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // フェードイン要素にディレイを設定
    function assignDelays() {
        // グリッド内の子要素に遅延を割り当て
        const grids = document.querySelectorAll('.problems-grid, .reasons-grid, .services-grid');
        grids.forEach(grid => {
            const cards = grid.querySelectorAll('.fade-in');
            cards.forEach((card, i) => {
                card.dataset.delay = i * 100;
            });
        });

        // タイムライン要素に遅延を割り当て
        const flowSteps = document.querySelectorAll('.flow-timeline .fade-in');
        flowSteps.forEach((step, i) => {
            step.dataset.delay = i * 80;
        });
    }

    assignDelays();

    // 全フェードイン要素を観察
    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // --- アクティブナビリンクのハイライト ---
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        const scrollY = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- 初期化 ---
    handleNavScroll();
    highlightNav();

    console.log('AIRAS website loaded successfully.');
});
