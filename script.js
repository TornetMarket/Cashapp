/*──────────────────────────────────────────────
  Tornet Market – script.js  (June 2025, v2.4.1)
  • renders Marketplace cards with Info & Request
  • Info modal: picture + ★★★★★
  • Request modal (mailto)
  • filters, section nav, hamburger, slideshow
  • 2-second “Site Updates” popup
──────────────────────────────────────────────*/

/*------------------------------------------------
  0.  PRODUCT CATALOGUE  (add/change images here)
------------------------------------------------*/
const products = [
  /*  SCRIPTS  */
  {
    id: 'script1',
    name: 'Auto Recon Script',
    description:
      'Automates recon with Nmap, Amass, Subfinder, and ASN lookups. Consolidated output for fast target investigation.',
    category: 'scripts',
    topSelling: true,
    image: 'images/script1.jpg',
  },
  {
    id: 'script2',
    name: 'Payload Generator',
    description:
      'Assembles custom Metasploit/Veil payloads; auto-obfuscation and AV-evasion. Compatible with Empire and Cobalt Strike.',
    category: 'scripts',
    topSelling: false,
    image: 'images/script2.jpg',
  },
  {
    id: 'script3',
    name: 'LateralMover',
    description:
      'Automates token impersonation, WMI execution, and pass-the-hash/Kerberos attacks for rapid domain pivoting.',
    category: 'scripts',
    topSelling: false,
    image: 'images/script3.jpg',
  },
  {
    id: 'script4',
    name: 'Privilege Escalation Suite',
    description:
      'Auto-checks for common local misconfigs, weak permissions, and kernel exploits. Linux & Windows support.',
    category: 'scripts',
    topSelling: true,
    image: 'images/script4.jpg',
  },

  /*  FLIPPER ZERO SCRIPTS  */
  {
    id: 'script5',
    name: 'Flipper Zero Traffic Light Controller',
    description:
      'Send crafted RF signals to manipulate vulnerable traffic-light systems via Flipper Zero.',
    category: 'scripts',
    topSelling: false,
    image: 'images/script5.jpg',
  },
  {
    id: 'script6',
    name: 'Flipper Zero 2.4 GHz Jammer',
    description:
      'Jams 2.4 GHz spectrum (Wi-Fi, BLE, Zigbee) using advanced signal floods.',
    category: 'scripts',
    topSelling: false,
    image: 'images/script6.jpg',
  },
  {
    id: 'script7',
    name: 'Flipper Zero Universal Pwner',
    description:
      'Experimental zero-day exploit pack enabling full RF/BLE/IR takeover.',
    category: 'scripts',
    topSelling: true,
    image: 'images/script7.jpg',
  },

  /*  SOFTWARE  */
  {
    id: 'soft1',
    name: 'PhantomScanner Pro',
    description:
      'High-speed scanner with authenticated/unauthenticated testing, SMB/LDAP/WinRM enum, and custom exploit scripting.',
    category: 'software',
    topSelling: true,
    image: 'images/soft1.jpg',
  },
  {
    id: 'soft2',
    name: 'Stealth Encryptor',
    description:
      'AES-GCM/ChaCha20 file encryption with memory-zeroing and plausible deniability.',
    category: 'software',
    topSelling: false,
    image: 'images/soft2.jpg',
  },
  {
    id: 'soft3',
    name: 'ShadowTrace OSINT',
    description:
      'Aggregates Shodan, FOFA, Censys & BreachDirectory APIs with graph visualisation.',
    category: 'software',
    topSelling: true,
    image: 'images/soft3.jpg',
  },
  {
    id: 'soft4',
    name: 'ZeroLogon Exploit Kit',
    description:
      'Full CVE-2020-1472 implementation plus optional domain-controller tooling.',
    category: 'software',
    topSelling: false,
    image: 'images/soft4.jpg',
  },
  {
    id: 'soft5',
    name: 'AnonyMail Dropper',
    description:
      'Tor-enabled ProtonMail client — anonymous comms, zero logs.',
    category: 'software',
    topSelling: false,
    image: 'images/soft5.jpg',
  },

  /*  HACKING TOOLKITS  */
  {
    id: 'hack1',
    name: 'GhostShell Framework',
    description:
      'Post-exploitation / lateral movement; integrates with CS/Empire, supports pivoting, shellcode, persistence.',
    category: 'hacking',
    topSelling: true,
    image: 'images/hack1.jpg',
  },
  {
    id: 'hack2',
    name: 'Nighthawk Stealthsuite',
    description:
      'Signature-less injection, AMSI/ETW bypass, encrypted C2 — built for evasion-first ops.',
    category: 'hacking',
    topSelling: false,
    image: 'images/hack2.jpg',
  },
  {
    id: 'hack3',
    name: 'PacketSniffer X',
    description:
      'Real-time packet capture & protocol dissection with custom filter support.',
    category: 'hacking',
    topSelling: false,
    image: 'images/hack3.jpg',
  },
  {
    id: 'hack4',
    name: 'Kerberoast Commander',
    description:
      'Automated Kerberos ticket extraction, roasting & crack-automation for AD.',
    category: 'hacking',
    topSelling: false,
    image: 'images/hack4.jpg',
  },

  /*  GADGETS / GIZMOS  */
  {
    id: 'giz1',
    name: 'Card Skimmer X',
    description:
      'Covert magnetic-strip reader, instant dump to encrypted storage, USB/Bluetooth exfil.',
    category: 'gizmos',
    topSelling: true,
    image: 'images/giz1.jpg',
  },
  {
    id: 'giz2',
    name: 'Evil Portal Suite',
    description:
      'Raspberry Pi rogue AP with captive-portal credential harvesting & session hijack.',
    category: 'gizmos',
    topSelling: true,
    image: 'images/giz2.jpg',
  },
  {
    id: 'giz3',
    name: 'Credential Harvester',
    description:
      'Automated MITM/phishing rig capturing NTLM & HTTP(S) creds.',
    category: 'gizmos',
    topSelling: false,
    image: 'images/giz3.jpg',
  },
  {
    id: 'giz4',
    name: 'RFID Duplicator',
    description:
      'Hand-held LF/HF RFID cloner with LCD feedback & long-life battery.',
    category: 'gizmos',
    topSelling: false,
    image: 'images/giz4.jpg',
  },
  {
    id: 'giz5',
    name: 'Signal Jammer Pro',
    description:
      'Field-grade SDR jammer covering Wi-Fi 2.4/5 GHz, BLE & GSM. Rechargeable.',
    category: 'gizmos',
    topSelling: false,
    image: 'images/giz5.jpg',
  },
  {
    id: 'giz6',
    name: 'Bluetooth Beacon Spoofer',
    description:
      'Emulates/spoofs BLE/iBeacon/Eddystone beacons for proximity attacks.',
    category: 'gizmos',
    topSelling: false,
    image: 'images/giz6.jpg',
  },
  {
    id: 'giz7',
    name: 'BlackTunnel VPN Router',
    description:
      'OpenWRT + WireGuard/OpenVPN/Tor, kill-switch, USB-powered for field deploys.',
    category: 'gizmos',
    topSelling: true,
    image: 'images/giz7.jpg',
  },
  {
    id: 'giz8',
    name: 'WiFi Deauther Pro',
    description:
      'Fires deauth frames to boot devices from target networks — training & pentest.',
    category: 'gizmos',
    topSelling: false,
    image: 'images/giz8.jpg',
  },
  {
    id: 'giz9',
    name: 'SDR Pocket Analyzer',
    description:
      'Ultra-compact HackRF/RTL-SDR receiver — CTF radio companion.',
    category: 'gizmos',
    topSelling: false,
    image: 'images/giz9.jpg',
  },
  {
    id: 'giz10',
    name: 'Network Tap Nano',
    description:
      'Passive, no-loss Ethernet tap for full-duplex capture. USB-powered.',
    category: 'gizmos',
    topSelling: false,
    image: 'images/giz10.jpg',
  },

  /*  WEBSITES  */
  {
    id: 'web1',
    name: 'VantaFlow Portfolio',
    description:
      'Next.js + Tailwind one-page portfolio, dark mode, secure contact, mobile-first.',
    category: 'websites',
    topSelling: true,
    image: 'images/web1.jpg',
  },
  {
    id: 'web2',
    name: 'HydraNet C2 Dashboard',
    description:
      'Encrypted WebSocket C2 portal, real-time node control, hardened for OPSEC.',
    category: 'websites',
    topSelling: true,
    image: 'images/web2.jpg',
  },
  {
    id: 'web3',
    name: 'ShadowCart Commerce',
    description:
      'Privacy-first crypto e-commerce (BTC, XMR, ETH) with invite-only access.',
    category: 'websites',
    topSelling: true,
    image: 'images/web3.jpg',
  },
];

/*------------------------------------------------
  DOM READY
------------------------------------------------*/
document.addEventListener('DOMContentLoaded',()=>{
  /* ───────────────── NAVBAR / HAMBURGER ───────────────── */
  const hamburger        = document.getElementById('hamburger');
  const navLinksContainer= document.querySelector('.nav-links'); // <<< keep single source of truth
  const navLinks         = document.querySelectorAll('.nav-link');

  hamburger?.addEventListener('click',()=>navLinksContainer.classList.toggle('open'));
  navLinks.forEach(l=>l.addEventListener('click',()=>navLinksContainer.classList.remove('open')));

  /* ───────────────── SECTION NAVIGATION ───────────────── */
  const sections=document.querySelectorAll('.section');
  const showSection=id=>{
    sections.forEach(s=>s.classList.toggle('active',s.id===id));
    navLinks.forEach(l=>l.classList.toggle('active',l.dataset.page===id));
    scrollTo({top:0,behavior:'smooth'});
  };
  navLinks.forEach(l=>l.addEventListener('click',e=>{
    e.preventDefault(); showSection(l.dataset.page);
  }));
  document.querySelectorAll('.btn-primary[data-page]')
    .forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.page)));


    
  /* ───────────────── MARKETPLACE CARDS ───────────────── */
  const grid=document.getElementById('products-grid');
  const renderCards=list=>{
    grid.innerHTML='';
    list.forEach(p=>{
      grid.insertAdjacentHTML('beforeend',`
        <div class="product-card" data-category="${p.category}" data-topselling="${p.topSelling}">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div style="margin-top:auto;display:flex;gap:.5rem;">
            <button class="btn btn-secondary info-btn" data-id="${p.id}">Info</button>
            <button class="btn btn-primary  request-btn" data-id="${p.id}">Request</button>
          </div>
        </div>`);
    });
  };
  renderCards(products);

  /* filter */
  document.getElementById('filter-select').addEventListener('change',e=>{
    const v=e.target.value;
    document.querySelectorAll('.product-card').forEach(c=>{
      const show=v==='all' ? true
        : v==='top-selling' ? c.dataset.topselling==='true'
        : c.dataset.category===v;
      c.style.display=show?'flex':'none';
    });
  });

  /* ───────────────── INFO MODAL (built once) ───────────────── */
  const infoModal=document.createElement('div');
  infoModal.className='modal hidden';
  infoModal.innerHTML=`
    <div class="modal-backdrop"></div>
    <div class="modal-content" style="max-width:420px">
      <button class="modal-close" id="info-close">×</button>
      <img id="info-img"  style="width:100%;border-radius:6px;margin-bottom:.75rem;">
      <h3 id="info-title" style="color:var(--accent);margin-bottom:.4rem;"></h3>
      <div style="color:#f6c343;font-size:1.2rem;margin-bottom:.5rem;">★★★★★</div>
      <p  id="info-desc"  style="font-size:.95rem;line-height:1.5;"></p>
      <button class="btn btn-primary" id="info-request">Request Product</button>
    </div>`;
  document.body.appendChild(infoModal);
  const infoBackdrop=infoModal.querySelector('.modal-backdrop');
  const infoClose   =infoModal.querySelector('#info-close');
  const infoImg     =infoModal.querySelector('#info-img');
  const infoTitle   =infoModal.querySelector('#info-title');
  const infoDesc    =infoModal.querySelector('#info-desc');
  const infoReqBtn  =infoModal.querySelector('#info-request');
  const openInfo=p=>{
    infoImg.src=p.image||'images/placeholder.jpg';
    infoImg.alt=p.name;
    infoTitle.textContent=p.name;
    infoDesc.textContent =p.description;
    infoReqBtn.dataset.id=p.id;
    infoModal.classList.remove('hidden');
  };
  const closeInfo=()=>infoModal.classList.add('hidden');
  infoClose.addEventListener('click',closeInfo);
  infoBackdrop.addEventListener('click',closeInfo);

  /* ───────────────── REQUEST MODAL (already in HTML) ───────────────── */
  const reqModal=document.getElementById('request-modal');
  const reqBackdrop=reqModal.querySelector('.modal-backdrop');
  const reqClose   =document.getElementById('modal-close');
  const reqDisplay =document.getElementById('modal-product-display');
  const reqHidden  =document.getElementById('modal-product-name');
  const reqQty     =document.getElementById('modal-quantity');
  const reqEmail   =document.getElementById('modal-email');
  const reqNotes   =document.getElementById('modal-notes');
  const reqForm    =document.getElementById('request-form');
  const openReq=p=>{
    reqDisplay.value=reqHidden.value=p.name;
    reqQty.value=1; reqEmail.value=''; reqNotes.value='';
    reqModal.classList.remove('hidden');
  };
  const closeReq=()=>reqModal.classList.add('hidden');
  reqClose.addEventListener('click',closeReq);
  reqBackdrop.addEventListener('click',closeReq);
  reqForm.addEventListener('submit',e=>{
    e.preventDefault();
    const subject=`[Product Request] ${reqHidden.value}`;
    let body=`Product: ${reqHidden.value}%0D%0AQuantity: ${reqQty.value}%0D%0AUser Email: ${encodeURIComponent(reqEmail.value)}`;
    if(reqNotes.value.trim()) body+=`%0D%0AAdditional Notes: ${encodeURIComponent(reqNotes.value)}`;
    location.href=`mailto:richiesmarketplace@proton.me?subject=${encodeURIComponent(subject)}&body=${body}`;
    closeReq();
  });
  infoReqBtn.addEventListener('click',()=>openReq(products.find(p=>p.id===infoReqBtn.dataset.id)));

  /* delegated buttons on cards */
  grid.addEventListener('click',e=>{
    const id=e.target.dataset.id;
    if(!id) return;
    const prod=products.find(p=>p.id===id);
    if(!prod) return;
    e.target.classList.contains('info-btn')? openInfo(prod): openReq(prod);
  });

  /*  ★ NEW – handle Request buttons that live in the slideshow ★ */
document.querySelector('.product-showcase').addEventListener('click', e => {
  if (!e.target.classList.contains('request-btn')) return;
  const prod = products.find(p => p.id === e.target.dataset.id);
  if (prod) openReq(prod);
});

  /* ───────────────── SLIDESHOW ───────────────── */
  const slides=document.querySelectorAll('.slide');
  const dots  =document.querySelectorAll('.dot');
  let slideIdx=0;
  const slideMove=i=>{
    slides.forEach((s,n)=>s.classList.toggle('active',n===i));
    dots  .forEach((d,n)=>d.classList.toggle('active',n===i));
    document.querySelector('.slider').style.transform=`translateX(${-(33.3333*i)}%)`;
  };
  dots.forEach((d,i)=>d.addEventListener('click',()=>{slideIdx=i;slideMove(i);}));
  setInterval(()=>{slideIdx=(slideIdx+1)%slides.length;slideMove(slideIdx);},9000);
  slideMove(slideIdx);

  /* ───────────────── SITE-UPDATES POPUP ───────────────── */
  const upBackdrop=document.createElement('div');
  upBackdrop.className='update-backdrop'; upBackdrop.style.display='none';
  const upPopup=document.createElement('div');
  upPopup.className='update-popup'; upPopup.style.display='none';
  upPopup.innerHTML=`
    <button class="popup-close">×</button>
    <h3>Site Updates & Notices</h3>
    <div class="popup-content">
      <p><strong>Latest Version:</strong> 2.4.1 (June 2025)</p>
      <ul>
        <li>Fixed mobile nav clashes.</li>
        <li>Added product Info modals.</li>
        <li>Refined guide section layout.</li>
      </ul>
      <p>For full changelog visit the <a href="#" class="nav-link" data-page="intel" style="color:var(--accent);text-decoration:underline;">Intel</a> page.</p>
    </div>
    <button class="popup-ok btn btn-primary" style="margin-top:.5rem;">OK</button>`;
  document.body.append(upBackdrop,upPopup);

  const hidePopup=()=>{upBackdrop.style.display='none'; upPopup.style.display='none';};
  upBackdrop.addEventListener('click',hidePopup);
  upPopup.querySelector('.popup-close').addEventListener('click',hidePopup);
  upPopup.querySelector('.popup-ok').addEventListener('click',hidePopup);

  setTimeout(()=>{upBackdrop.style.display='block'; upPopup.style.display='block';},1000);
});
