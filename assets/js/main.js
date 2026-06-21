/*
 * TRIET.SYS — Night City Portfolio Interface
 * Author: Truong Minh Triet
 * Progressive enhancement: every section is readable with no JS.
 * JS upgrades the page into an OS-console with one active module at a time.
 */

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SECTIONS = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];

    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('js');

        initClock();
        initYear();
        initMeters();
        initMatrix();
        initConsole();
        initMobileMenu();
        initRoleTyping();
        initContactForm();
        initBoot();
    });

    /* ---------------------------------------------------------------------
     * Subtle katakana rain — a background texture in the negative space.
     * Cyan + low opacity (not Matrix-green), slow, and disabled for
     * reduced-motion. Kept deliberately sparse so it never competes with
     * the content sitting on top of it.
     * ------------------------------------------------------------------- */
    function initMatrix() {
        const canvas = document.getElementById('matrix');
        if (!canvas || reduceMotion) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        const glyphs = 'アァカサタナハマヤラワガザダバパイキシチニヒミリヲギジヂビピウクスツヌフムユルグズブエケセテネヘメレゲゼデベペ0179:/＜＞'.split('');

        let cols, drops, fontSize, dpr;
        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            fontSize = window.innerWidth < 700 ? 14 : 18;
            cols = Math.ceil(window.innerWidth / fontSize);
            const rows = window.innerHeight / fontSize;
            // Seed across the full height so the rain is already falling on arrival
            drops = Array.from({ length: cols }, () => Math.floor(Math.random() * rows));
            ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
            ctx.textBaseline = 'top';
        }
        resize();

        let last = 0;
        const stepMs = 95; // ~10fps: slow, calm fall
        function frame(t) {
            requestAnimationFrame(frame);
            if (t - last < stepMs) return;
            last = t;

            // Fade previous frame toward the page background (leaves short trails)
            ctx.fillStyle = 'rgba(7, 7, 10, 0.20)';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            for (let i = 0; i < cols; i++) {
                const y = drops[i] * fontSize;
                if (y > 0) {
                    const ch = glyphs[(Math.random() * glyphs.length) | 0];
                    // Brighter leading glyph, faint cyan body
                    ctx.fillStyle = Math.random() > 0.92
                        ? 'rgba(120, 245, 255, 0.55)'
                        : 'rgba(41, 230, 255, 0.30)';
                    ctx.fillText(ch, i * fontSize, y);
                }
                if (y > window.innerHeight && Math.random() > 0.97) drops[i] = 0;
                drops[i]++;
            }
        }
        requestAnimationFrame(frame);

        let rt;
        window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
    }

    /* ---------------------------------------------------------------------
     * Skill meters — derive the accessible label from data-level (the one
     * number you edit in the HTML). CSS draws the bar from the same value.
     * ------------------------------------------------------------------- */
    function initMeters() {
        const MAX = 5;
        document.querySelectorAll('.meter[data-level]').forEach((el) => {
            const lv = Math.max(0, Math.min(MAX, parseInt(el.dataset.level, 10) || 0));
            el.setAttribute('role', 'img');
            el.setAttribute('aria-label', `Proficiency ${lv} of ${MAX}`);
        });
    }

    /* ---------------------------------------------------------------------
     * Boot loader (decorative, JS-only — never blocks no-JS users)
     * ------------------------------------------------------------------- */
    function initBoot() {
        const loader = document.querySelector('.loader');
        if (!loader) return;

        // Respect reduced motion + repeat visits: no theatrical boot.
        if (reduceMotion || sessionStorage.getItem('booted')) {
            loader.remove();
            return;
        }
        sessionStorage.setItem('booted', '1');

        document.body.classList.add('booting');
        const log = document.getElementById('boot-log');
        const pct = loader.querySelector('.loader-pct');
        const bar = loader.querySelector('.loader-bar i');

        const lines = [
            'init core ........... <b>ok</b>',
            'mount /firmware ..... <b>ok</b>',
            'load drivers ........ <b>ok</b>',
            'link neural net ..... <b>ok</b>',
            'decrypt profile ..... <b>ok</b>'
        ];

        let i = 0;
        const step = () => {
            if (i < lines.length) {
                const p = document.createElement('p');
                p.innerHTML = lines[i];
                log.appendChild(p);
                const progress = Math.round(((i + 1) / lines.length) * 100);
                pct.textContent = progress + '%';
                bar.style.width = progress + '%';
                i++;
                setTimeout(step, 230);
            } else {
                setTimeout(() => {
                    loader.style.transition = 'opacity .5s ease';
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        document.body.classList.remove('booting');
                        loader.remove();
                    }, 500);
                }, 320);
            }
        };
        step();

        // Safety valve: never trap the user behind a stuck loader.
        setTimeout(() => {
            if (document.body.contains(loader)) {
                document.body.classList.remove('booting');
                loader.remove();
            }
        }, 4000);
    }

    /* ---------------------------------------------------------------------
     * Console module switching
     * ------------------------------------------------------------------- */
    function initConsole() {
        const navLinks = Array.from(document.querySelectorAll('.nav a'));
        const modules = Array.from(document.querySelectorAll('.module'));
        let current = null;

        function activate(id, { focus = false, push = true } = {}) {
            if (!SECTIONS.includes(id)) id = 'home';
            if (id === current) return;
            current = id;

            modules.forEach(m => m.classList.toggle('is-active', m.id === id));
            navLinks.forEach(a => {
                const match = a.getAttribute('href') === '#' + id;
                a.setAttribute('aria-current', match ? 'true' : 'false');
            });

            if (push && ('#' + id) !== window.location.hash) {
                history.pushState(null, '', '#' + id);
            }

            const active = document.getElementById(id);
            if (active) {
                if (focus) active.focus({ preventScroll: true });
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        }

        navLinks.forEach((link, idx) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = link.getAttribute('href').slice(1);
                activate(id, { focus: true });
                closeMenu();
            });

            // Roving arrow-key navigation across the module tabs.
            link.addEventListener('keydown', (e) => {
                let next = null;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = idx + 1;
                else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = idx - 1;
                else if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = navLinks.length - 1;
                if (next === null) return;
                e.preventDefault();
                next = (next + navLinks.length) % navLinks.length;
                navLinks[next].focus();
                activate(navLinks[next].getAttribute('href').slice(1));
            });
        });

        // Any in-page anchor (CTA buttons, logo, footer) drives the console too.
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            if (navLinks.includes(a) || a.classList.contains('skip-link')) return;
            a.addEventListener('click', (e) => {
                const id = a.getAttribute('href').slice(1);
                if (!SECTIONS.includes(id)) return;
                e.preventDefault();
                activate(id, { focus: true });
                closeMenu();
            });
        });

        window.addEventListener('popstate', () => {
            activate((window.location.hash || '#home').slice(1), { push: false });
        });

        // Initial module from hash (deep links keep working).
        activate((window.location.hash || '#home').slice(1), { push: false });
    }

    /* ---------------------------------------------------------------------
     * Live clock in the system bar
     * ------------------------------------------------------------------- */
    function initClock() {
        const el = document.getElementById('sys-clock');
        if (!el) return;
        const tick = () => {
            const d = new Date();
            const p = n => String(n).padStart(2, '0');
            el.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
        };
        tick();
        setInterval(tick, 1000);
    }

    function initYear() {
        const y = document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();
    }

    /* ---------------------------------------------------------------------
     * Rotating role line (degrades to a static role on reduced motion)
     * ------------------------------------------------------------------- */
    function initRoleTyping() {
        const el = document.getElementById('role-typed');
        if (!el) return;

        const roles = [
            'Embedded Systems Engineer',
            'Firmware Developer',
            'Hardware Designer',
            'RTOS Specialist',
            'Robotics Engineer'
        ];

        if (reduceMotion) { el.textContent = roles[0]; return; }

        let r = 0, c = 0, deleting = false;
        function type() {
            const word = roles[r];
            el.textContent = word.substring(0, c);
            let delay = deleting ? 45 : 95;

            if (!deleting && c === word.length) {
                deleting = true;
                delay = 1400;
            } else if (deleting && c === 0) {
                deleting = false;
                r = (r + 1) % roles.length;
                delay = 350;
            } else {
                c += deleting ? -1 : 1;
            }
            setTimeout(type, delay);
        }
        type();
    }

    /* ---------------------------------------------------------------------
     * Mobile menu
     * ------------------------------------------------------------------- */
    let _toggle, _closeOnOutside;
    function initMobileMenu() {
        _toggle = document.getElementById('menu-toggle');
        if (!_toggle) return;

        _toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = document.body.classList.toggle('menu-open');
            _toggle.setAttribute('aria-expanded', String(open));
        });

        const scrim = document.getElementById('scrim');
        if (scrim) scrim.addEventListener('click', closeMenu);

        _closeOnOutside = (e) => {
            if (!document.body.classList.contains('menu-open')) return;
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.contains(e.target) && !_toggle.contains(e.target)) closeMenu();
        };
        document.addEventListener('click', _closeOnOutside);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        let timer;
        window.addEventListener('resize', () => {
            clearTimeout(timer);
            timer = setTimeout(() => { if (window.innerWidth > 980) closeMenu(); }, 200);
        });
    }

    function closeMenu() {
        document.body.classList.remove('menu-open');
        if (_toggle) _toggle.setAttribute('aria-expanded', 'false');
    }

    /* ---------------------------------------------------------------------
     * Contact form → mailto, with inline validation + toast
     * ------------------------------------------------------------------- */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const subject = form.subject.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            if (!subject || !email || !message) {
                toast('All fields are required.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                toast('Enter a valid email address.', 'error');
                form.email.focus();
                return;
            }

            const link = 'mailto:minhtrietwork@gmail.com'
                + '?subject=' + encodeURIComponent(subject)
                + '&body=' + encodeURIComponent('From: ' + email + '\n\n' + message);
            window.location.href = link;
            toast('Opening your email client…', 'success');
            setTimeout(() => form.reset(), 1500);
        });
    }

    /* ---------------------------------------------------------------------
     * Toast notification
     * ------------------------------------------------------------------- */
    let _toastTimer;
    function toast(message, type) {
        let el = document.querySelector('.toast');
        if (!el) {
            el = document.createElement('div');
            el.className = 'toast';
            el.setAttribute('role', 'status');
            el.setAttribute('aria-live', 'polite');
            document.body.appendChild(el);
        }
        el.className = 'toast ' + (type || '');
        el.textContent = message;
        // Reflow so the transition replays.
        void el.offsetWidth;
        el.classList.add('show');

        clearTimeout(_toastTimer);
        _toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
    }
})();
