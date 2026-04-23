// Tailored AI — shared nav/footer injector + site-wide interactions
(function(){
  const current = (document.body.dataset.page || '').toLowerCase();
  const isDarkNav = document.body.classList.contains('nav-dark');

  const links = [
    ['home', 'Home', 'Home.html'],
    ['how', 'How it works', 'How-It-Works.html'],
    ['industries', 'Industries', 'Industries.html'],
    ['cases', 'Case Studies', 'Case-Studies.html'],
    ['about', 'About', 'About.html'],
  ];

  // NAV
  const navHost = document.querySelector('[data-slot="nav"]');
  if (navHost) {
    navHost.outerHTML = `
      <nav class="nav${isDarkNav ? ' dark' : ''}" data-slot="nav">
        <a class="nav-brand" href="Home.html">
          <img src="assets/logo-mark.png" alt="Tailored AI">
          <span class="wm">Tailored AI</span>
        </a>
        <div class="nav-links">
          ${links.map(([k,l,h]) => `<a href="${h}" class="${k===current?'active':''}">${l}</a>`).join('')}
        </div>
        <a class="nav-cta" href="Contact.html">
          Join waitlist <span class="arrow">→</span>
        </a>
      </nav>
    `;
  }

  // FOOTER
  const footerHost = document.querySelector('[data-slot="footer"]');
  if (footerHost) {
    const year = new Date().getFullYear();
    footerHost.outerHTML = `
      <footer class="footer" data-slot="footer">
        <div class="wrap">
          <div class="footer-top">
            <div class="footer-brand">
              <img src="assets/logo-mark.png" alt="Tailored AI">
              <h3>Save your business money with AI <em>automation.</em></h3>
              <p>One partner. One retainer. Work that pays for itself — from the first month.</p>
            </div>
            <div class="footer-col">
              <h5>Site</h5>
              <ul>
                ${links.map(([k,l,h]) => `<li><a href="${h}">${l}</a></li>`).join('')}
                <li><a href="Contact.html">Contact</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Industries</h5>
              <ul>
                <li><a href="Industries.html#construction">Construction</a></li>
                <li><a href="Industries.html#real-estate">Real Estate</a></li>
                <li><a href="Industries.html#legal">Legal</a></li>
                <li><a href="Industries.html#financial">Financial Advisors</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Contact</h5>
              <ul>
                <li><a href="mailto:ben@tailoredhq.com">ben@tailoredhq.com</a></li>
                <li><a href="tel:+14087101394">(408) 710-1394</a></li>
                <li><a href="https://tailoredhq.com">tailoredhq.com</a></li>
                <li><a href="Contact.html">Join the waitlist →</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bot">
            <div class="glyphs">
              <span><span class="dot"></span> © ${year} Tailored AI, Inc.</span>
              <span>Ben Ledwith &amp; Evan Rose</span>
            </div>
            <div class="glyphs">
              <span>v1.0 — 2026</span>
              <span>Made for SMB owners</span>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();

// Tweak mode (simple in-page; posts up to host if available)
(function(){
  const STORAGE = 'tailored_tweaks_v1';
  const defaults = /*EDITMODE-BEGIN*/{
    "headlineVariant": "save",
    "accent": "forest",
    "heroGround": "dark"
  }/*EDITMODE-END*/;
  const state = Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORAGE)||'{}'));

  function apply(){
    document.documentElement.dataset.accent = state.accent;
    document.documentElement.dataset.ground = state.heroGround;
    document.documentElement.dataset.activeHeadline = state.headlineVariant;

    // accent var
    const accents = {forest:'#0D5C3A', navy:'#0B3D6B', mint:'#00C471'};
    const brights = {forest:'#00C471', navy:'#00C471', mint:'#00C471'};
    document.documentElement.style.setProperty('--accent', accents[state.accent] || accents.forest);
    document.documentElement.style.setProperty('--accent-bright', brights[state.accent] || brights.forest);

    // headline cycler — guard against matching documentElement
    const lines = {
      save:'Save your business money with AI <em>automation.</em>',
      automate:'We automate the work that\u2019s <em>costing you money.</em>',
      pay:'Custom AI automation that <em>pays for itself.</em>',
      partner:'A <em>partner,</em> not a vendor.'
    };
    document.querySelectorAll('h1[data-headline]').forEach(h=>{
      if (h === document.documentElement) return;
      h.innerHTML = lines[state.headlineVariant] || lines.save;
    });

    // hero ground
    document.querySelectorAll('[data-hero-ground]').forEach(el=>{
      el.dataset.heroGround = state.heroGround;
    });
  }

  apply();
  localStorage.setItem(STORAGE, JSON.stringify(state));

  // Build tweaks panel
  const panel = document.createElement('div');
  panel.className = 'tweaks';
  panel.innerHTML = `
    <h6>Tweaks <span class="dot"></span></h6>
    <div class="tweak-row">
      <label>Hero headline</label>
      <div class="tweak-opts" data-key="headlineVariant">
        <button data-v="save">Save money</button>
        <button data-v="automate">Costing you</button>
        <button data-v="pay">Pays for itself</button>
        <button data-v="partner">Partner</button>
      </div>
    </div>
    <div class="tweak-row">
      <label>Accent color</label>
      <div class="tweak-opts" data-key="accent">
        <button data-v="forest">Forest</button>
        <button data-v="navy">Navy</button>
        <button data-v="mint">Mint</button>
      </div>
    </div>
    <div class="tweak-row">
      <label>Hero ground</label>
      <div class="tweak-opts" data-key="heroGround">
        <button data-v="dark">Dark</button>
        <button data-v="light">Light</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  function paintButtons(){
    panel.querySelectorAll('.tweak-opts').forEach(row=>{
      const k = row.dataset.key;
      row.querySelectorAll('button').forEach(b=>{
        b.classList.toggle('on', b.dataset.v === state[k]);
      });
    });
  }
  paintButtons();

  panel.addEventListener('click', (e)=>{
    const b = e.target.closest('button[data-v]');
    if (!b) return;
    const k = b.parentElement.dataset.key;
    state[k] = b.dataset.v;
    apply(); paintButtons();
    localStorage.setItem(STORAGE, JSON.stringify(state));
    try {
      window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[k]:b.dataset.v}}, '*');
    } catch(e){}
  });

  // Protocol
  window.addEventListener('message',(e)=>{
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') panel.classList.add('active');
    if (d.type === '__deactivate_edit_mode') panel.classList.remove('active');
  });
  try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
})();
