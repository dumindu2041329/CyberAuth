(function(){
  function playOnceFromSession(){
    try {
      var key = 'play-login-success';
      var src = sessionStorage.getItem(key);
      if (!src) return;
      sessionStorage.removeItem(key);
      if (window.sfx && typeof window.sfx.suppress === 'function') window.sfx.suppress(800);
      if (window.sfx && typeof window.sfx.play === 'function') {
        window.sfx.play(src, 1.0);
      } else {
        try { new Audio(src).play().catch(function(){}); } catch(_){ }
      }
    } catch(_) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', playOnceFromSession);
  } else {
    playOnceFromSession();
  }
})();
