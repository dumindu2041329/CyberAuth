(function(){
  function $(sel){ return document.querySelector(sel); }
  function text(el, msg){ if(!el) return; el.textContent = msg || ''; el.style.display = msg ? 'block' : 'none'; }

  function playSuccess(){
    var form = $('#loginForm');
    var src = (form && form.dataset && form.dataset.sfxSuccess) || 'assets/sounds/login-success.mp3';
    if (window.sfx) { if (typeof window.sfx.suppress === 'function') window.sfx.suppress(800); }
    if (window.sfx && typeof window.sfx.play === 'function') {
      window.sfx.play(src, 1.0);
    } else {
      try { new Audio(src).play().catch(function(){}); } catch(_){ }
    }
  }

  function handleSubmit(e){
    e.preventDefault();
    var form = e.target;
    var email = $('#loginEmail') && $('#loginEmail').value.trim();
    var password = $('#loginPassword') && $('#loginPassword').value;
    var err = $('#loginError');
    text(err, '');

    if (!email || !password) {
      text(err, 'Email and password are required.');
      return;
    }

    fetch('api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    }).then(function(res){
      return res.json().then(function(data){ return { status: res.status, data: data }; });
    }).then(function(res){
      if (res.status === 200 && res.data && res.data.success) {
        // Mark for cross-page playback and redirect to dashboard
        try { sessionStorage.setItem('play-login-success', (document.querySelector('#loginForm')?.dataset?.sfxSuccess) || 'assets/sounds/login-success.mp3'); } catch(_){ }
        playSuccess();
        setTimeout(function(){ window.location.href = 'dashboard.html'; }, 200);
      } else {
        text(err, (res.data && res.data.message) || 'Login failed');
      }
    }).catch(function(){
      text(err, 'Network error');
    });
  }

  function init(){
    var form = $('#loginForm');
    if (!form) return;
    // Preload success sound if available
    var src = (form && form.dataset && form.dataset.sfxSuccess) || 'assets/sounds/login-success.mp3';
    if (window.sfx && typeof window.sfx.preload === 'function') { window.sfx.preload(src); }
    form.addEventListener('submit', handleSubmit, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
