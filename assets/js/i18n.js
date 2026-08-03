// Language switching. Both languages are rendered into the page; the active
// `lang-active-*` class on <html> decides which one is visible (see global.css).
// This file must be loaded in <head>, before the body renders, so the page never
// flashes the wrong language.
(function () {
    var STORAGE_KEY = 'site-lang';
    // Language shown to a first-time visitor. Change to 'zh' to default to Chinese.
    var DEFAULT_LANG = 'en';

    function applyLang(lang) {
        var html = document.documentElement;
        html.className = html.className.replace(/\s*lang-active-\w+/g, '').trim();
        html.className = (html.className + ' lang-active-' + lang).trim();
        html.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    }

    function currentLang() {
        var stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'zh' || stored === 'en' ? stored : DEFAULT_LANG;
    }

    // Apply immediately to prevent a flash of the wrong language.
    applyLang(currentLang());

    // The navbar renders the toggle twice (mobile + desktop), so update every copy.
    function updateToggle() {
        var lang = currentLang();
        var buttons = document.querySelectorAll('.lang-toggle-label[data-lang]');
        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            var isActive = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('lang-toggle-active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        }
    }

    window.toggleLanguage = function (targetLang) {
        if (targetLang !== 'en' && targetLang !== 'zh') return;
        localStorage.setItem(STORAGE_KEY, targetLang);

        // Blog posts that exist as a pair of single-language files declare their own
        // language and the URL of their counterpart; switching navigates across.
        var body = document.body;
        if (body) {
            var pageLang = body.getAttribute('data-page-lang');
            var langPair = body.getAttribute('data-lang-pair');
            if (pageLang && langPair && targetLang !== pageLang) {
                window.location.href = langPair;
                return;
            }
        }

        applyLang(targetLang);
        updateToggle();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateToggle);
    } else {
        updateToggle();
    }
})();
