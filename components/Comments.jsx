'use client';

import { useEffect, useRef } from 'react';

const GISCUS_LIGHT = 'light';
const GISCUS_DARK = 'dark';

function getEffectiveTheme() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark') return GISCUS_DARK;
    if (explicit === 'light') return GISCUS_LIGHT;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? GISCUS_DARK
        : GISCUS_LIGHT;
}

function sendThemeToGiscus(theme) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme } } },
        'https://giscus.app'
    );
}

export default function Comments() {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current || ref.current.childElementCount > 0) return;

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';

        script.setAttribute('data-repo', '0xdya/d1blog');
        script.setAttribute('data-repo-id', 'R_kgDOUYO2QQ');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'DIC_kwDOUYO2Qc4DGgIt');
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '0');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', getEffectiveTheme());
        script.setAttribute('data-lang', 'ar');
        ref.current.appendChild(script);

        const observer = new MutationObserver(() => {
            const iframe = ref.current?.querySelector('iframe.giscus-frame');

            if (iframe) {
                sendThemeToGiscus(getEffectiveTheme());
                observer.disconnect();
            }
        });

        observer.observe(ref.current, {
            childList: true,
            subtree: true,
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            sendThemeToGiscus(getEffectiveTheme());
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            if (!document.documentElement.getAttribute('data-theme')) {
                sendThemeToGiscus(getEffectiveTheme());
            }
        };
        mql.addEventListener('change', handler);
        return () => {
            mql.removeEventListener('change', handler);
        };
    }, []);

    return <div ref={ref} className="giscus-container" />;
}