import './style.css'
import cafes from './cafes.json'

interface Cafe {
  slug: string
  name: string
  location: string
  rating: number
  date: string
  content: string
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

function getSlug(): string {
  const path = window.location.pathname
  const slug = path.replace(/^\//, '').replace(/\/$/, '')
  return slug
}

function updateSEO(title: string, description: string, keywords: string, url: string): void {
  document.title = title
  
  const setMeta = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name'
    let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attr, name)
      document.head.appendChild(meta)
    }
    meta.content = content
  }
  
  setMeta('description', description)
  setMeta('keywords', keywords)
  setMeta('og:title', title, true)
  setMeta('og:description', description, true)
  setMeta('og:url', url, true)
  setMeta('twitter:title', title)
  setMeta('twitter:description', description)
  
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (canonical) canonical.href = url
}

function createCafeListItem(cafe: Cafe): string {
  return `
    <a href="/${cafe.slug}" class="cafe-item">
      <span class="cafe-name">${cafe.name}</span>
      <span class="cafe-rating">${cafe.rating}/10</span>
      <span class="cafe-location">${cafe.location}</span>
    </a>
  `
}

function getCity(location: string): string {
  const parts = location.split(',')
  return parts.length > 1 ? parts[parts.length - 1].trim() : location.trim()
}

function renderHome(): void {
  updateSEO(
    "Baris's Cafe Reviews - Kafe Degerlendirmeleri",
    "Baris'in kafe degerlendirmeleri. Turkiye'deki kafeleri puanliyorum ve deneyimlerimi paylasiyorum.",
    "kafe, cafe, kahve, coffee, review, degerlendirme, Turkiye, Ankara, Istanbul",
    "https://cafe.bayburt.lu"
  )
  
  const allCafes = (cafes as Cafe[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const cities = [...new Set(allCafes.map(c => getCity(c.location)))].sort()
  
  const cityOptions = cities.map(city => `<option value="${city}">${city}</option>`).join('')
  const cafeOptions = allCafes.map(cafe => `<option value="${cafe.slug}">${cafe.name}</option>`).join('')

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="home-container">
      <div class="home-header">
        <div class="home-title">
          <span class="title-star">*</span>
          Baris's Cafe Reviews
          <span class="title-star">*</span>
        </div>
        <div class="home-subtitle">~ Click a cafe to read my review ~</div>
      </div>
      <div class="filter-box">
        <div class="filter-row">
          <label>CITY:</label>
          <select id="city-filter">
            <option value="">-- All Cities --</option>
            ${cityOptions}
          </select>
        </div>
        <div class="filter-row">
          <label>CAFE:</label>
          <select id="cafe-filter">
            <option value="">-- All Cafes --</option>
            ${cafeOptions}
          </select>
        </div>
      </div>
      <div class="cafe-list">
        <div class="list-header">SELECT A CAFE:</div>
        <div id="cafe-list-items">
          ${allCafes.map(createCafeListItem).join('')}
        </div>
      </div>
      <div class="home-footer">
        <marquee scrollamount="2">Welcome to my cafe review page! I rate cafes I visit out of 10!</marquee>
      </div>
    </div>
    <a href="https://github.com/byigitt/cafe.bayburt.lu" target="_blank" class="github-corner" title="View on GitHub">
      <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    </a>
  `

  const cityFilter = document.getElementById('city-filter') as HTMLSelectElement
  const cafeFilter = document.getElementById('cafe-filter') as HTMLSelectElement
  const listContainer = document.getElementById('cafe-list-items')!

  cityFilter.addEventListener('change', () => {
    const selectedCity = cityFilter.value
    const filtered = selectedCity 
      ? allCafes.filter(c => getCity(c.location) === selectedCity)
      : allCafes
    listContainer.innerHTML = filtered.map(createCafeListItem).join('')
    cafeFilter.value = ''
  })

  cafeFilter.addEventListener('change', () => {
    const selectedSlug = cafeFilter.value
    if (selectedSlug) {
      window.location.href = '/' + selectedSlug
    }
  })
}

function renderCafePage(cafe: Cafe): void {
  const city = getCity(cafe.location)
  updateSEO(
    `${cafe.name} - ${cafe.rating}/10 | Baris's Cafe Reviews`,
    `${cafe.name} kafe degerlendirmesi. ${cafe.location} - ${cafe.rating}/10 puan.`,
    `${cafe.name}, ${city}, kafe, cafe, kahve, coffee, review, degerlendirme, ${cafe.rating}/10`,
    `https://cafe.bayburt.lu/${cafe.slug}`
  )
  
  const visitorCount = Math.floor(Math.random() * 9000) + 1000
  const stars = '*'.repeat(cafe.rating) + '-'.repeat(10 - cafe.rating)

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <table class="main-table" cellpadding="0" cellspacing="0">
      <tr>
        <td class="sidebar">
          <div class="nav-box">
            <div class="nav-title">NAVIGATION</div>
            <a href="/" class="nav-link">&lt;&lt; BACK</a>
            <div class="nav-divider">--------</div>
            <div class="nav-info">
              <span class="blink">&gt;</span> Visitor #${visitorCount}
            </div>
          </div>
          <div class="construction-box">
            <div class="construction-text blink">!</div>
            <span>UNDER<br>CONSTRUCTION</span>
            <div class="construction-text blink">!</div>
          </div>
          <div class="guestbook-box">
            <div class="pixel-coffee"></div>
            <span>Sign my<br>guestbook!</span>
          </div>
        </td>
        <td class="main-content">
          <div class="page-title">
            <div class="title-decoration">*~*~*~*~*</div>
            <h1>Baris's Cafe Reviews</h1>
            <div class="title-decoration">*~*~*~*~*</div>
          </div>
          
          <div class="info-table">
            <div class="info-row">
              <span class="info-label">CAFE:</span>
              <span class="info-value cafe-name-value">${cafe.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">RATING:</span>
              <span class="info-value rating-bar">[${stars}] ${cafe.rating}/10</span>
            </div>
            <div class="info-row">
              <span class="info-label">LOCATION:</span>
              <span class="info-value">${cafe.location}</span>
            </div>
            <div class="info-row">
              <span class="info-label">VISITED:</span>
              <span class="info-value">${formatDate(cafe.date)}</span>
            </div>
          </div>

          <div class="divider">=-=-=-=-=-=-=-=-=-=-=-=-=-=</div>

          <div class="review-section">
            <div class="review-header">MY REVIEW:</div>
            <div class="review-content">
              ${cafe.content}
            </div>
          </div>

          <div class="divider">=-=-=-=-=-=-=-=-=-=-=-=-=-=</div>

          <div class="footer-text">
            <marquee behavior="alternate" scrollamount="2">Thanks for reading! Come back soon!</marquee>
          </div>
        </td>
      </tr>
    </table>

    <div class="bottom-bar">
      <span>Best viewed with Netscape Navigator 4.0 @ 800x600</span>
      <span class="blink">|</span>
      <span>(c) ${new Date().getFullYear()} cafe.bayburt.lu</span>
    </div>
    <a href="https://github.com/byigitt/cafe.bayburt.lu" target="_blank" class="github-corner" title="View on GitHub">
      <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    </a>
  `
}

function render404(): void {
  updateSEO(
    "404 - Sayfa Bulunamadi | Baris's Cafe Reviews",
    "Aradiginiz kafe bulunamadi.",
    "404, bulunamadi, not found",
    "https://cafe.bayburt.lu/404"
  )
  
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="error-page">
      <h1>404 - NOT FOUND</h1>
      <p>This cafe does not exist in my database!</p>
      <p><a href="/">&lt;&lt; GO BACK TO HOME &gt;&gt;</a></p>
      <div class="blink">* * *</div>
    </div>
  `
}

function router(): void {
  const slug = getSlug()
  
  if (!slug || slug === 'index.html') {
    renderHome()
    return
  }

  const cafe = (cafes as Cafe[]).find(c => c.slug === slug)
  if (cafe) {
    renderCafePage(cafe)
  } else {
    render404()
  }
}

router()
