// Jobs.fun final update — modal company pages, location filter, hot jobs, X logo is an SVG
const JOBS_KEY = 'jobsfun:favorites';
const HOT_KEY = 'jobsfun:clicks';

// Job dataset — added location field & short description
const JOBS = [
  { id: 'mcd', name: "McDonald's", category: 'Food', url: 'https://careers.mcdonalds.com/', dateAdded: '2025-09-10', location: 'in-person', desc: 'Global fast food leader known for burgers, fries, and quick service.' },
  { id: 'starb', name: 'Starbucks', category: 'Food', url: 'https://careers.starbucks.com/', dateAdded: '2025-09-12', location: 'in-person', desc: 'Coffeehouse chain offering specialty drinks, food, and customer-focused culture.' },
  { id: 'walmart', name: 'Walmart', category: 'Retail', url: 'https://careers.walmart.com/', dateAdded: '2025-09-04', location: 'in-person', desc: "World’s largest retailer with stores, online shopping, and logistics jobs." },
  { id: 'amazon', name: 'Amazon', category: 'Tech', url: 'https://www.amazon.jobs/', dateAdded: '2025-09-16', location: 'hybrid', desc: 'E-commerce giant with roles in logistics, tech, and operations.' },
  { id: 'target', name: 'Target', category: 'Retail', url: 'https://www.target.com/careers', dateAdded: '2025-09-02', location: 'in-person', desc: 'Retail chain offering jobs in customer service, logistics, and management.' },
  { id: 'chick', name: "Chick-fil-A", category: 'Food', url: 'https://careers-chickfila.icims.com/jobs/intro', dateAdded: '2025-09-20', location: 'in-person', desc: 'Fast food chain specializing in chicken sandwiches and hospitality.' },
  { id: 'homedepot', name: 'Home Depot', category: 'Retail', url: 'https://careers.homedepot.com/', dateAdded: '2025-09-14', location: 'in-person', desc: 'Hardware and home improvement retailer with warehouse and store jobs.' },
  { id: 'ups', name: 'UPS', category: 'Logistics', url: 'https://www.jobs-ups.com/us/en/', dateAdded: '2025-09-06', location: 'in-person', desc: 'Logistics company offering delivery, warehouse, and driver careers.' },
  { id: 'fedex', name: 'FedEx', category: 'Logistics', url: 'https://careers.fedex.com/', dateAdded: '2025-09-13', location: 'in-person', desc: 'Global courier service with roles in shipping, logistics, and customer service.' },
  { id: 'kroger', name: 'Kroger', category: 'Retail', url: 'https://www.kroger.com/careers' , dateAdded: '2025-08-20', location: 'in-person', desc: 'Grocery store chain with retail, distribution, and pharmacy positions.' },
  { id: 'cvs', name: 'CVS Health', category: 'Healthcare', url: 'https://jobs.cvshealth.com/', dateAdded: '2025-09-11', location: 'in-person', desc: 'Pharmacy chain and healthcare company with retail and medical roles.' },
  { id: 'walgreens', name: 'Walgreens', category: 'Healthcare', url: 'https://jobs.walgreens.com/', dateAdded: '2025-09-08', location: 'in-person', desc: 'Pharmacy and retail chain with healthcare, tech, and store jobs.' },
  { id: 'subway', name: 'Subway', category: 'Food', url: 'https://www.subway.com/en-us/careers', dateAdded: '2025-08-30', location: 'in-person', desc: 'Sandwich restaurant chain with thousands of food service opportunities.' },
  { id: 'bk', name: 'Burger King', category: 'Food', url: 'https://careers.bk.com/', dateAdded: '2025-08-25', location: 'in-person', desc: 'Fast food brand offering restaurant, management, and crew jobs.' },
  { id: 'pizzahut', name: 'Pizza Hut', category: 'Food', url: 'https://careers.pizzahut.com/', dateAdded: '2025-08-22', location: 'in-person', desc: 'Pizza chain with opportunities in restaurants, delivery, and management.' },
  { id: 'netflix', name: 'Netflix', category: 'Entertainment', url: 'https://jobs.netflix.com/', dateAdded: '2025-09-03', location: 'remote', desc: 'Entertainment streaming platform with jobs in tech, creative, and content.' },
  { id: 'nike', name: 'Nike', category: 'Sportswear', url: 'https://jobs.nike.com/', dateAdded: '2025-09-15', location: 'hybrid', desc: 'Global sportswear company offering retail, design, and marketing careers.' },
  { id: 'adidas', name: 'Adidas', category: 'Sportswear', url: 'https://careers.adidas-group.com/', dateAdded: '2025-09-17', location: 'hybrid', desc: 'Sportswear brand with roles in retail, supply chain, and design.' },
  { id: 'tesla', name: 'Tesla', category: 'Automotive', url: 'https://www.tesla.com/careers', dateAdded: '2025-09-07', location: 'in-person', desc: 'Innovative automotive and energy company with tech and manufacturing roles.' },
  { id: 'apple', name: 'Apple', category: 'Tech', url: 'https://jobs.apple.com/', dateAdded: '2025-08-28', location: 'hybrid', desc: 'Technology company offering roles in hardware, software, and retail.' }
];

// icon mapping
const ICON_MAP = {
  'Food': 'icon-burger',
  'Retail': 'icon-cart',
  'Tech': 'icon-laptop',
  'Logistics': 'icon-truck',
  'Healthcare': 'icon-pill',
  'Entertainment': 'icon-play',
  'Sportswear': 'icon-shoe',
  'Automotive': 'icon-car',
  'default': 'icon-briefcase'
};

// simple utilities
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const daysBetween = (d1, d2) => Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
const isNew = (isoDate, days=14) => {
  try { return daysBetween(new Date(isoDate), new Date()) <= days; } catch { return false; }
};

function loadFavorites(){ try { const raw = localStorage.getItem(JOBS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
function saveFavorites(list){ localStorage.setItem(JOBS_KEY, JSON.stringify(list)); }
function loadClicks(){ try { const raw = localStorage.getItem(HOT_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; } }
function saveClicks(obj){ localStorage.setItem(HOT_KEY, JSON.stringify(obj)); }

// render grid
function renderGrid({search='', category='all', location='all', favorites=[]} = {}) {
  const grid = $('#grid');
  grid.innerHTML = '';
  const query = search.trim().toLowerCase();

  const filtered = JOBS.filter(j => {
    if (category !== 'all' && j.category !== category) return false;
    if (location !== 'all' && j.location !== location) return false;
    if (!query) return true;
    return j.name.toLowerCase().includes(query) || j.category.toLowerCase().includes(query);
  });

  $('#jobCount').textContent = `${filtered.length} job${filtered.length === 1 ? '' : 's'}`;

  filtered.forEach((job, i) => {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = job.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('data-id', job.id);
    a.setAttribute('data-location', job.location);
    a.setAttribute('aria-label', `${job.name} — open details`);
    a.style.animationDelay = `${i * 60}ms`;

    if (isNew(job.dateAdded, 14)) {
      const nb = document.createElement('div');
      nb.className = 'new-badge';
      nb.textContent = 'NEW';
      a.appendChild(nb);
    }

    const favBtn = document.createElement('button');
    favBtn.className = 'favorite';
    favBtn.type = 'button';
    favBtn.title = 'Save for later';
    favBtn.innerHTML = '<svg class="icon" width="18" height="18"><use href="#icon-star"></use></svg>';
    a.appendChild(favBtn);

    const wrap = document.createElement('div');
    wrap.className = 'icon-wrap';
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','icon');
    svg.setAttribute('width','30');
    svg.setAttribute('height','30');
    const iconId = ICON_MAP[job.category] || ICON_MAP['default'];
    svg.innerHTML = `<use href="#${iconId}"></use>`;
    wrap.appendChild(svg);
    a.appendChild(wrap);

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = job.name;
    a.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${job.category} • ${job.location}`;
    a.appendChild(meta);

    const favs = favorites || loadFavorites();
    if (favs.includes(job.id)) favBtn.classList.add('active');

    // favorite click handler (prevent anchor)
    favBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const id = job.id;
      let favs = loadFavorites();
      if (favs.includes(id)) favs = favs.filter(x => x !== id);
      else favs.push(id);
      saveFavorites(favs);
      favBtn.classList.toggle('active');
      favBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 250 });
      // update modal favorite if open
      const modalFav = $('#modalFav');
      if (modalFav && modalFav.dataset.jobId === id) {
        modalFav.classList.toggle('active', favs.includes(id));
      }
      refreshHotBar(); // small UX update
    });

    // open modal on click (instead of immediate redirect)
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      openModal(job.id);
    });

    // pointer pop animation
    a.addEventListener('pointerdown', () => {
      a.classList.add('pop');
      setTimeout(()=>a.classList.remove('pop'), 420);
    });

    grid.appendChild(a);
  });

  if (filtered.length === 0) {
    const empt = document.createElement('div');
    empt.style.textAlign = 'center';
    empt.style.padding = '28px';
    empt.style.color = 'var(--muted)';
    empt.textContent = 'No jobs match your search. Try another keyword or category.';
    grid.appendChild(empt);
  }
}

// modal logic
const modal = $('#modal');
const modalTitle = $('#modalTitle');
const modalDesc = $('#modalDesc');
const modalIcon = $('#modalIcon');
const modalCat = $('#modalCat');
const modalLoc = $('#modalLoc');
const modalApply = $('#modalApply');
const modalFav = $('#modalFav');

function openModal(id) {
  const job = JOBS.find(j => j.id === id);
  if (!job) return;
  modalTitle.textContent = job.name;
  modalDesc.textContent = job.desc;
  modalCat.textContent = job.category;
  modalLoc.textContent = job.location;
  // icon
  modalIcon.innerHTML = `<svg class="icon" width="36" height="36"><use href="#${ICON_MAP[job.category] || ICON_MAP['default']}"></use></svg>`;
  modalApply.href = job.url;
  modalApply.onclick = () => {
    // increment click count for hot jobs
    incrementClick(job.id);
  };
  // favorite button state
  modalFav.dataset.jobId = job.id;
  const favs = loadFavorites();
  modalFav.classList.toggle('active', favs.includes(job.id));
  // show modal
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  setTimeout(()=> {
    $('#modal').focus();
  }, 120);
}

function closeModal() {
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// favorite inside modal
modalFav.addEventListener('click', (e) => {
  e.preventDefault();
  const id = modalFav.dataset.jobId;
  if (!id) return;
  let favs = loadFavorites();
  if (favs.includes(id)) favs = favs.filter(x => x !== id);
  else favs.push(id);
  saveFavorites(favs);
  modalFav.classList.toggle('active', favs.includes(id));
  renderGrid({ // refresh grid state to reflect favorite change
    search: $('#searchInput').value,
    category: $$('.tab.active')[0]?.dataset.cat || 'all',
    location: $('#locationSelect').value,
    favorites: favs
  });
});

// increment click count
function incrementClick(id) {
  const clicks = loadClicks();
  clicks[id] = (clicks[id] || 0) + 1;
  saveClicks(clicks);
  refreshHotBar();
}

// hot bar
function refreshHotBar() {
  const clicks = loadClicks();
  const entries = Object.entries(clicks);
  if (entries.length === 0) {
    $('#hotBar').hidden = true;
    return;
  }
  // sort by count desc, map to job name
