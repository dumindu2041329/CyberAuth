(function(){
  if (window.__sfxInitialized) return; // idempotent
  window.__sfxInitialized = true;

  const cache = new Map();
  let defaults = { clickSrc: null, navSrc: null, volume: 1.0 };
  const supportsPointer = 'onpointerdown' in window;
  let suppressUntil = 0; // suppress global SFX until timestamp (ms)

  function preload(src){
    if (!src || cache.has(src)) return cache.get(src);
    const a = new Audio(src);
    a.preload = 'auto';
    cache.set(src, a);
    return a;
  }

  function playSrc(src, vol){
    if (!src) return;
    const base = preload(src) || new Audio(src);
    try {
      const a = base.cloneNode(true);
      a.volume = typeof vol === 'number' ? Math.max(0, Math.min(1, vol)) : defaults.volume;
      a.play().catch(()=>{});
    } catch(_) {}
  }

  function resolveSound(el, type){
    if (!el) return null;
    if (el.dataset && el.dataset.sfx === 'off') return null;
    const override = el.dataset && (type === 'nav' ? el.dataset.sfxNav : el.dataset.sfxClick);
    return override || (type === 'nav' ? defaults.navSrc : defaults.clickSrc);
  }

  function resolveVolume(el){
    if (!el || !el.dataset || !el.dataset.sfxVolume) return defaults.volume;
    const v = parseFloat(el.dataset.sfxVolume);
    return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : defaults.volume;
  }

  function isButtonLike(el){
    return !!el && (
      el.tagName === 'BUTTON' ||
      el.getAttribute('role') === 'button' ||
      (el.tagName === 'INPUT' && ['button','submit'].includes((el.type||'').toLowerCase()))
    );
  }

  function isLink(el){
    return !!el && el.tagName === 'A' && el.hasAttribute('href');
  }

  function onPointerDown(e){
    if (Date.now() < suppressUntil) return;
    const el = e.target.closest('button, [role="button"], input[type="button"], input[type="submit"], a[href]');
    if (!el) return;
    let type = isLink(el) ? 'nav' : (isButtonLike(el) ? 'click' : null);
    if (!type) return;
    const src = resolveSound(el, type);
    const vol = resolveVolume(el);
    playSrc(src, vol);
  }

  function onSubmit(e){
    const el = e.target;
    const src = resolveSound(el, 'click');
    const vol = resolveVolume(el);
    playSrc(src, vol);
  }

  function onClick(e){
    // Fallback for browsers without Pointer Events
    if (supportsPointer) return;
    if (Date.now() < suppressUntil) return;
    onPointerDown(e);
  }

  function initSfx(opts){
    defaults = Object.assign({}, defaults, opts || {});
    // Preload defaults
    preload(defaults.clickSrc);
    preload(defaults.navSrc);
    // Global listeners
    if (supportsPointer) {
      window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    } else {
      window.addEventListener('click', onClick, { capture: true });
    }
    window.addEventListener('submit', onSubmit, { capture: true });
  }

  function enable(){
    if (supportsPointer) {
      window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    } else {
      window.addEventListener('click', onClick, { capture: true });
    }
    window.addEventListener('submit', onSubmit, { capture: true });
  }

  function disable(){
    if (supportsPointer) {
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
    } else {
      window.removeEventListener('click', onClick, { capture: true });
    }
    window.removeEventListener('submit', onSubmit, { capture: true });
  }

  window.initSfx = initSfx;
  window.sfx = {
    enable,
    disable,
    preload,
    play: function(src, vol){ playSrc(src, vol); },
    suppress: function(ms){ suppressUntil = Date.now() + (ms||0); }
  };
})();
