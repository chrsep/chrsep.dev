<svelte:head>
  <title>Vibe Coding Demo | Chrisando E. Pramudhita</title>
  <meta
    name="description"
    content="A live vibe coding demo: from an audience idea to a deployed inventory app using Codex, GitHub, Vercel, and Neon."
  />
  <meta property="og:title" content="Vibe Coding Demo" />
  <meta
    property="og:description"
    content="Dari ide di ruangan sampai aplikasi inventory yang benar-benar live."
  />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://chrsep.dev/resources/vibecoding-demo" />
  <meta
    property="og:url"
    content="https://chrsep.dev/resources/vibecoding-demo"
  />
</svelte:head>

<div class="demo-page" lang="id">
  <section class="hero">
    <div class="page-shell hero-grid">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> Vibe coding · live demo</p>
        <h1>
          Satu ide dari ruangan.
          <em>Satu aplikasi yang benar-benar live.</em>
        </h1>
        <p class="hero-lead">
          Dalam demo ini, kami mengarahkan Codex untuk membuat aplikasi
          inventory dan peminjaman—dari folder kosong, data contoh, database
          Neon, sampai deploy ke Vercel.
        </p>

        <div class="hero-actions">
          <a
            class="action action-primary"
            href="https://inventory-wine-five.vercel.app"
            target="_blank"
            rel="noreferrer"
          >
            Buka demo <span aria-hidden="true">↗</span>
          </a>
          <a
            class="action action-secondary"
            href="https://github.com/chrsep/inventory"
            target="_blank"
            rel="noreferrer"
          >
            Lihat source code <span aria-hidden="true">↗</span>
          </a>
        </div>

        <ul class="hero-facts" aria-label="Demo details">
          <li>18 Juli 2026</li>
          <li>Ide dari peserta</li>
          <li>Build &amp; deploy live</li>
        </ul>
      </div>

      <div
        class="app-window-wrap"
        role="img"
        aria-label="Preview of the inventory and borrowing application built during the demo"
      >
        <div class="sketch-note note-top">built live!</div>
        <div class="app-window">
          <div class="window-bar">
            <div class="window-dots" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <span class="window-address">inventory-wine-five.vercel.app</span>
          </div>

          <div class="app-shell">
            <aside class="app-sidebar">
              <div class="app-logo">inventory<span>.</span></div>
              <div class="sidebar-nav">
                <span class="active">Overview</span>
                <span>Inventory</span>
                <span>Peminjaman</span>
                <span>History</span>
              </div>
              <div class="profile-dot">A</div>
            </aside>

            <div class="app-content">
              <div class="app-heading">
                <div>
                  <span class="app-kicker">OVERVIEW</span>
                  <strong>Selamat pagi, Andi</strong>
                </div>
                <span class="mini-button">+ Peminjaman baru</span>
              </div>

              <div class="metric-grid">
                <div class="metric-card">
                  <span>Jenis barang</span>
                  <strong>8</strong>
                  <small>Siap dipinjam</small>
                </div>
                <div class="metric-card metric-purple">
                  <span>Peminjam</span>
                  <strong>6</strong>
                  <small>Data dari Neon</small>
                </div>
                <div class="metric-card">
                  <span>Database</span>
                  <strong class="synced"><i></i> Live</strong>
                  <small>Stock tersinkron</small>
                </div>
              </div>

              <div class="inventory-panel">
                <div class="panel-title">
                  <strong>Peminjaman terbaru</strong>
                  <span>Lihat semua</span>
                </div>
                <div class="loan-row">
                  <div class="product-icon purple">MB</div>
                  <div class="loan-name">
                    <strong>MacBook Pro 14 inch</strong>
                    <span>Nadia Pratama</span>
                  </div>
                  <span class="status active-status">Aktif</span>
                </div>
                <div class="loan-row">
                  <div class="product-icon orange">CA</div>
                  <div class="loan-name">
                    <strong>Sony A7 IV Camera</strong>
                    <span>Rizky Maulana</span>
                  </div>
                  <span class="status late-status">Terlambat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sketch-note note-bottom">prompt → produk</div>
      </div>
    </div>
  </section>

  <section class="outcome-section">
    <div class="page-shell">
      <div class="section-heading">
        <p class="eyebrow"><span></span> Hasil demo</p>
        <h2>Bukan mockup. Bukan sekadar “hello world.”</h2>
        <p>
          Demo-nya berakhir dengan aplikasi yang bisa dipakai, data yang tetap
          ada setelah refresh, dan URL publik yang bisa dibuka dari HP peserta.
        </p>
      </div>

      <div class="outcome-grid">
        <article>
          <span class="outcome-number">01</span>
          <h3>Lihat stok</h3>
          <p>
            Dashboard, pencarian barang, filter kategori, dan penanda stok
            menipis.
          </p>
        </article>
        <article>
          <span class="outcome-number">02</span>
          <h3>Catat peminjaman</h3>
          <p>
            Simpan siapa yang meminjam, barangnya, jumlah, tanggal, dan status
            pengembalian.
          </p>
        </article>
        <article>
          <span class="outcome-number">03</span>
          <h3>Data yang nyata</h3>
          <p>
            Prisma dan Neon menjaga transaksi peminjaman, history, dan jumlah
            stok tetap konsisten.
          </p>
        </article>
        <article>
          <span class="outcome-number">04</span>
          <h3>Ship ke internet</h3>
          <p>
            Source code disimpan di GitHub lalu dijalankan sebagai aplikasi
            publik di Vercel.
          </p>
        </article>
      </div>
    </div>
  </section>

  <section class="architecture-section">
    <div class="page-shell architecture-grid">
      <div class="architecture-copy">
        <p class="eyebrow eyebrow-light"><span></span> Arsitektur sederhana</p>
        <h2>Empat tools. Satu mesin.</h2>
        <p>
          Vibe coding bukan berarti code-nya hilang. Kita tetap merakit aplikasi
          nyata—hanya cara kita membuatnya yang berubah.
        </p>
        <div class="agent-note">
          <span class="agent-mark">✦</span>
          <div>
            <strong>Codex · AI agent</strong>
            <p>Kita yang mengarahkan. Codex yang mengerjakan.</p>
          </div>
        </div>
      </div>

      <div class="architecture-flow" aria-label="Application architecture">
        <article class="tool-card">
          <span class="tool-index">01</span>
          <div>
            <small>CODE</small>
            <h3>GitHub</h3>
            <p>Rumah code dan semua riwayat perubahannya.</p>
          </div>
        </article>
        <span class="flow-arrow" aria-hidden="true">↓</span>
        <article class="tool-card">
          <span class="tool-index">02</span>
          <div>
            <small>SERVER</small>
            <h3>Vercel</h3>
            <p>Menjalankan aplikasi dan mengirimkannya ke user.</p>
          </div>
        </article>
        <span class="flow-arrow split-arrow" aria-hidden="true">↓</span>
        <article class="tool-card database-card">
          <span class="tool-index">03</span>
          <div>
            <small>DATABASE</small>
            <h3>Neon</h3>
            <p>Ingatan aplikasi untuk stok dan peminjaman.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="process-section">
    <div class="page-shell">
      <div class="section-heading narrow-heading">
        <p class="eyebrow"><span></span> Dari prompt ke produk</p>
        <h2>Yang berubah bukan kebutuhannya. Yang berubah cara membuatnya.</h2>
      </div>

      <div class="prompt-card">
        <div class="prompt-label">
          <span class="prompt-spark">✦</span>
          <span>Inti prompt pembuka</span>
        </div>
        <blockquote>
          “Buat aplikasi inventory untuk melacak stok dan peminjaman. Simpan
          siapa yang meminjam, kapan meminjam, dan history-nya. Pakai data
          contoh supaya aplikasinya langsung bisa dilihat.”
        </blockquote>
        <div class="prompt-tags" aria-label="Requested technology stack">
          <span>Next.js</span>
          <span>Prisma</span>
          <span>Neon</span>
          <span>Tailwind CSS</span>
        </div>
      </div>

      <ol class="process-list">
        <li>
          <span>1</span>
          <div>
            <strong>Jelaskan masalahnya</strong>
            <p>Pakai bahasa sehari-hari. Mulai dari user dan alurnya.</p>
          </div>
        </li>
        <li>
          <span>2</span>
          <div>
            <strong>Lihat, coba, koreksi</strong>
            <p>
              Buka preview lokal, uji flow, lalu beri feedback yang spesifik.
            </p>
          </div>
        </li>
        <li>
          <span>3</span>
          <div>
            <strong>Hubungkan data nyata</strong>
            <p>Ganti mock data dengan database dan cek bahwa state bertahan.</p>
          </div>
        </li>
        <li>
          <span>4</span>
          <div>
            <strong>Ship, lalu iterasi</strong>
            <p>Deploy ke public URL. Baru setelah itu tambah kompleksitas.</p>
          </div>
        </li>
      </ol>
    </div>
  </section>

  <section class="resource-section">
    <div class="page-shell resource-card">
      <div>
        <p class="eyebrow eyebrow-light"><span></span> Coba sendiri</p>
        <h2>Buka hasilnya. Bongkar code-nya.</h2>
        <p>
          Cara paling cepat untuk memahami demo ini adalah dengan mencoba
          aplikasinya, lalu melihat bagaimana setiap flow dibuat di repository.
        </p>
      </div>

      <div class="resource-links">
        <a
          href="https://inventory-wine-five.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          <span>
            <small>LIVE APP</small>
            <strong>inventory.</strong>
          </span>
          <b aria-hidden="true">↗</b>
        </a>
        <a
          href="https://github.com/chrsep/inventory"
          target="_blank"
          rel="noreferrer"
        >
          <span>
            <small>SOURCE CODE</small>
            <strong>chrsep/inventory</strong>
          </span>
          <b aria-hidden="true">↗</b>
        </a>
      </div>
    </div>
  </section>
</div>

<style>
  :global(body) {
    background: #181818;
  }

  .demo-page {
    --paper: #f5f0e4;
    --paper-deep: #e8dfcf;
    --ink: #302b25;
    --ink-soft: #71685d;
    --terracotta: #c45f3d;
    --terracotta-dark: #96432b;
    --green: #27715a;
    --purple: #7056d8;
    color: var(--ink);
    overflow: hidden;
  }

  .page-shell {
    width: min(1180px, calc(100% - 3rem));
    margin-inline: auto;
  }

  .hero {
    position: relative;
    padding: 5.5rem 0 6rem;
    background-color: var(--paper);
    background-image: radial-gradient(#8a8072 0.8px, transparent 0.8px);
    background-size: 22px 22px;
  }

  .hero::before {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      rgba(245, 240, 228, 0.25),
      rgba(245, 240, 228, 0.94) 45%,
      rgba(245, 240, 228, 0.2)
    );
    content: "";
    pointer-events: none;
  }

  .hero-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(30rem, 1.1fr);
    gap: 5rem;
    align-items: center;
  }

  .eyebrow {
    display: flex;
    gap: 0.65rem;
    align-items: center;
    margin: 0 0 1.4rem;
    color: var(--terracotta-dark);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .eyebrow span {
    display: block;
    width: 2.25rem;
    height: 2px;
    background: currentColor;
    transform: rotate(-3deg);
  }

  .hero h1,
  .section-heading h2,
  .architecture-copy h2,
  .resource-card h2 {
    margin: 0;
    font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif;
    font-weight: 600;
    letter-spacing: -0.045em;
  }

  .hero h1 {
    max-width: 45rem;
    font-size: clamp(3.35rem, 6.2vw, 6.2rem);
    line-height: 0.95;
  }

  .hero h1 em {
    display: block;
    margin-top: 0.16em;
    color: var(--terracotta);
    font-weight: 500;
  }

  .hero-lead {
    max-width: 40rem;
    margin: 2rem 0 0;
    color: var(--ink-soft);
    font-size: 1.08rem;
    line-height: 1.75;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 2rem;
  }

  .action {
    display: inline-flex;
    gap: 1.8rem;
    align-items: center;
    justify-content: space-between;
    min-width: 10rem;
    padding: 0.9rem 1.05rem;
    border: 2px solid var(--ink);
    border-radius: 0.25rem;
    font-size: 0.9rem;
    font-weight: 800;
    box-shadow: 3px 3px 0 var(--ink);
    transition:
      transform 150ms ease,
      box-shadow 150ms ease,
      background 150ms ease;
  }

  .action:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 var(--ink);
  }

  .action:focus-visible,
  .resource-links a:focus-visible {
    outline: 3px solid var(--terracotta);
    outline-offset: 4px;
  }

  .action-primary {
    background: var(--ink);
    color: white;
  }

  .action-secondary {
    background: var(--paper);
    color: var(--ink);
  }

  .hero-facts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
    margin: 1.75rem 0 0;
    padding: 0;
    color: var(--ink-soft);
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    list-style: none;
  }

  .hero-facts li:not(:first-child)::before {
    margin-right: 1.5rem;
    color: var(--terracotta);
    content: "•";
  }

  .app-window-wrap {
    position: relative;
    transform: rotate(1.25deg);
  }

  .app-window-wrap::before {
    position: absolute;
    z-index: -1;
    inset: 1.2rem -1.2rem -1.2rem 1.2rem;
    border: 2px solid rgba(48, 43, 37, 0.25);
    background: var(--paper-deep);
    content: "";
    transform: rotate(-2.5deg);
  }

  .app-window {
    overflow: hidden;
    border: 2px solid var(--ink);
    border-radius: 0.55rem;
    background: #f9f9fb;
    box-shadow: 0 1.5rem 4rem rgba(62, 48, 34, 0.18);
  }

  .window-bar {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 2.5rem;
    padding: 0 0.85rem;
    border-bottom: 1px solid #c8c7cc;
    background: #ececef;
  }

  .window-dots {
    display: flex;
    gap: 0.35rem;
  }

  .window-dots span {
    width: 0.56rem;
    height: 0.56rem;
    border: 1px solid #76747d;
    border-radius: 50%;
    background: #d6d5da;
  }

  .window-address {
    position: absolute;
    left: 50%;
    padding: 0.22rem 1.6rem;
    border-radius: 0.3rem;
    background: #fafafa;
    color: #77747d;
    font-size: 0.56rem;
    transform: translateX(-50%);
  }

  .app-shell {
    display: grid;
    grid-template-columns: 7.2rem 1fr;
    min-height: 25.5rem;
  }

  .app-sidebar {
    display: flex;
    flex-direction: column;
    padding: 1.2rem 0.8rem;
    background: #161518;
    color: #d5d3dc;
  }

  .app-logo {
    color: white;
    font-size: 0.9rem;
    font-weight: 900;
  }

  .app-logo span {
    color: #9c7cff;
  }

  .sidebar-nav {
    display: grid;
    gap: 0.35rem;
    margin-top: 2rem;
    font-size: 0.53rem;
    font-weight: 600;
  }

  .sidebar-nav span {
    padding: 0.55rem;
    border-radius: 0.25rem;
  }

  .sidebar-nav .active {
    background: #6d52cf;
    color: white;
  }

  .profile-dot {
    display: grid;
    width: 1.5rem;
    height: 1.5rem;
    margin-top: auto;
    border-radius: 50%;
    background: #3b3843;
    place-items: center;
    font-size: 0.55rem;
    font-weight: 800;
  }

  .app-content {
    padding: 1.7rem 1.5rem;
    color: #25232a;
  }

  .app-heading,
  .panel-title,
  .loan-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .app-heading > div {
    display: grid;
    gap: 0.2rem;
  }

  .app-heading strong {
    font-size: 0.9rem;
  }

  .app-kicker {
    color: #918e98;
    font-size: 0.42rem;
    font-weight: 800;
    letter-spacing: 0.1em;
  }

  .mini-button {
    padding: 0.48rem 0.65rem;
    border-radius: 0.25rem;
    background: #7056d8;
    color: white;
    font-size: 0.48rem;
    font-weight: 800;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
    margin-top: 1.3rem;
  }

  .metric-card {
    display: grid;
    gap: 0.35rem;
    padding: 0.75rem;
    border: 1px solid #e4e1e9;
    border-radius: 0.45rem;
    background: white;
  }

  .metric-card > span {
    color: #7e7a85;
    font-size: 0.48rem;
    font-weight: 700;
  }

  .metric-card strong {
    font-size: 1.1rem;
  }

  .metric-card small {
    color: #a19ea6;
    font-size: 0.4rem;
  }

  .metric-purple {
    border-color: #e1dafa;
    background: #f5f1ff;
  }

  .metric-card .synced {
    display: flex;
    gap: 0.35rem;
    align-items: center;
    color: #27715a;
    font-size: 0.8rem;
  }

  .synced i {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: #3ba17f;
    box-shadow: 0 0 0 3px #d8f1e8;
  }

  .inventory-panel {
    margin-top: 1rem;
    padding: 0.85rem;
    border: 1px solid #e4e1e9;
    border-radius: 0.45rem;
    background: white;
  }

  .panel-title {
    margin-bottom: 0.5rem;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid #eeecef;
    font-size: 0.52rem;
  }

  .panel-title span {
    color: #6d52cf;
    font-size: 0.44rem;
    font-weight: 700;
  }

  .loan-row {
    gap: 0.6rem;
    padding: 0.55rem 0;
  }

  .loan-row + .loan-row {
    border-top: 1px solid #f0eef2;
  }

  .product-icon {
    display: grid;
    flex: 0 0 auto;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 0.35rem;
    place-items: center;
    color: white;
    font-size: 0.42rem;
    font-weight: 900;
  }

  .product-icon.purple {
    background: #765bdc;
  }

  .product-icon.orange {
    background: #dc815b;
  }

  .loan-name {
    display: grid;
    flex: 1;
    gap: 0.15rem;
    font-size: 0.48rem;
  }

  .loan-name span {
    color: #92909a;
    font-size: 0.4rem;
  }

  .status {
    padding: 0.25rem 0.4rem;
    border-radius: 999px;
    font-size: 0.38rem;
    font-weight: 800;
  }

  .active-status {
    background: #e1f3eb;
    color: #27715a;
  }

  .late-status {
    background: #fce4df;
    color: #a04432;
  }

  .sketch-note {
    position: absolute;
    z-index: 2;
    color: var(--terracotta-dark);
    font-family: ui-serif, Georgia, serif;
    font-size: 1.05rem;
    font-style: italic;
    font-weight: 700;
  }

  .note-top {
    top: -2.5rem;
    right: 1rem;
    transform: rotate(5deg);
  }

  .note-top::after {
    display: block;
    width: 3.5rem;
    height: 1.3rem;
    margin: 0.1rem 0 0 -1.2rem;
    border-bottom: 2px solid var(--terracotta);
    border-radius: 50%;
    content: "";
    transform: rotate(7deg);
  }

  .note-bottom {
    right: -0.5rem;
    bottom: -2.8rem;
    transform: rotate(-5deg);
  }

  .outcome-section,
  .process-section {
    padding: 7rem 0;
    background: var(--paper);
  }

  .section-heading {
    max-width: 47rem;
  }

  .section-heading h2,
  .architecture-copy h2,
  .resource-card h2 {
    font-size: clamp(2.6rem, 5vw, 4.6rem);
    line-height: 1.02;
  }

  .section-heading > p:last-child,
  .architecture-copy > p,
  .resource-card > div:first-child > p:last-child {
    max-width: 42rem;
    margin: 1.5rem 0 0;
    color: var(--ink-soft);
    font-size: 1.02rem;
    line-height: 1.7;
  }

  .outcome-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-top: 4rem;
    border-top: 2px solid var(--ink);
    border-bottom: 2px solid var(--ink);
  }

  .outcome-grid article {
    position: relative;
    min-height: 17rem;
    padding: 1.3rem 1.4rem 2rem;
  }

  .outcome-grid article + article {
    border-left: 1px solid rgba(48, 43, 37, 0.35);
  }

  .outcome-number {
    color: var(--terracotta);
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.08em;
  }

  .outcome-grid h3 {
    margin: 4rem 0 0.8rem;
    font-family: ui-serif, Georgia, serif;
    font-size: 1.6rem;
    line-height: 1.1;
  }

  .outcome-grid p {
    margin: 0;
    color: var(--ink-soft);
    font-size: 0.88rem;
    line-height: 1.65;
  }

  .architecture-section {
    padding: 7.5rem 0;
    background: #24211e;
    color: #fffaf0;
  }

  .architecture-grid {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(28rem, 1fr);
    gap: 7rem;
    align-items: start;
  }

  .eyebrow-light {
    color: #e78a67;
  }

  .architecture-copy > p,
  .resource-card > div:first-child > p:last-child {
    color: #bdb4aa;
  }

  .agent-note {
    display: flex;
    gap: 1rem;
    align-items: center;
    max-width: 27rem;
    margin-top: 3rem;
    padding: 1.2rem;
    border: 1px solid rgba(255, 250, 240, 0.25);
    border-radius: 0.4rem;
    background: rgba(255, 255, 255, 0.04);
  }

  .agent-mark {
    display: grid;
    flex: 0 0 auto;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--terracotta);
    place-items: center;
    font-size: 1.3rem;
  }

  .agent-note strong {
    font-family: ui-serif, Georgia, serif;
    font-size: 1.1rem;
  }

  .agent-note p {
    margin: 0.3rem 0 0;
    color: #bdb4aa;
    font-size: 0.78rem;
  }

  .architecture-flow {
    display: grid;
  }

  .tool-card {
    display: grid;
    grid-template-columns: 3rem 1fr;
    gap: 1rem;
    min-height: 8.8rem;
    padding: 1.4rem;
    border: 1px solid rgba(255, 250, 240, 0.38);
    border-radius: 0.35rem;
    background: #2d2925;
    box-shadow: 5px 5px 0 rgba(255, 250, 240, 0.08);
  }

  .tool-index {
    color: #e78a67;
    font-size: 0.72rem;
    font-weight: 900;
  }

  .tool-card small {
    color: #e78a67;
    font-size: 0.6rem;
    font-weight: 900;
    letter-spacing: 0.14em;
  }

  .tool-card h3 {
    margin: 0.25rem 0 0.35rem;
    font-family: ui-serif, Georgia, serif;
    font-size: 1.65rem;
  }

  .tool-card p {
    margin: 0;
    color: #bdb4aa;
    font-size: 0.82rem;
  }

  .database-card {
    border-color: rgba(85, 189, 145, 0.65);
    background: #24352e;
  }

  .database-card .tool-index,
  .database-card small {
    color: #77d4ad;
  }

  .flow-arrow {
    height: 2.1rem;
    padding-left: 3rem;
    color: #e78a67;
    font-size: 1.25rem;
    line-height: 1.7;
  }

  .split-arrow {
    color: #77d4ad;
  }

  .narrow-heading {
    max-width: 55rem;
  }

  .prompt-card {
    display: grid;
    grid-template-columns: 10rem minmax(0, 1fr);
    gap: 1rem 2.5rem;
    margin-top: 4rem;
    padding: 2rem;
    border: 2px solid var(--ink);
    border-radius: 0.35rem;
    background: #fffaf0;
    box-shadow: 7px 7px 0 var(--paper-deep);
  }

  .prompt-label {
    display: flex;
    gap: 0.7rem;
    align-items: flex-start;
    color: var(--terracotta-dark);
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .prompt-spark {
    font-size: 1rem;
    line-height: 0.8;
  }

  blockquote {
    margin: 0;
    font-family: ui-serif, Georgia, serif;
    font-size: clamp(1.5rem, 3vw, 2.4rem);
    font-style: italic;
    line-height: 1.32;
  }

  .prompt-tags {
    display: flex;
    grid-column: 2;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .prompt-tags span {
    padding: 0.35rem 0.55rem;
    border: 1px solid rgba(48, 43, 37, 0.35);
    border-radius: 999px;
    color: var(--ink-soft);
    font-size: 0.68rem;
    font-weight: 700;
  }

  .process-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin: 5rem 0 0;
    padding: 0;
    list-style: none;
  }

  .process-list li {
    display: grid;
    gap: 1.2rem;
  }

  .process-list li > span {
    display: grid;
    width: 2.4rem;
    height: 2.4rem;
    border: 2px solid var(--ink);
    border-radius: 50%;
    place-items: center;
    color: var(--terracotta-dark);
    font-family: ui-serif, Georgia, serif;
    font-weight: 800;
  }

  .process-list strong {
    font-family: ui-serif, Georgia, serif;
    font-size: 1.2rem;
  }

  .process-list p {
    margin: 0.7rem 0 0;
    color: var(--ink-soft);
    font-size: 0.84rem;
    line-height: 1.6;
  }

  .resource-section {
    padding: 3rem 0 0;
    background: var(--paper);
  }

  .resource-card {
    display: grid;
    grid-template-columns: 1fr 0.85fr;
    gap: 5rem;
    padding: 4.5rem;
    border-radius: 0.5rem;
    background: var(--terracotta-dark);
    color: #fffaf0;
  }

  .resource-links {
    display: grid;
    gap: 0.8rem;
  }

  .resource-links a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.3rem 1.5rem;
    border: 1px solid rgba(255, 250, 240, 0.5);
    border-radius: 0.35rem;
    background: rgba(255, 255, 255, 0.06);
    color: white;
    transition:
      background 150ms ease,
      transform 150ms ease;
  }

  .resource-links a:hover {
    background: rgba(255, 255, 255, 0.13);
    transform: translateX(3px);
  }

  .resource-links a > span {
    display: grid;
    gap: 0.35rem;
  }

  .resource-links small {
    color: #f5b69d;
    font-size: 0.58rem;
    font-weight: 900;
    letter-spacing: 0.12em;
  }

  .resource-links strong {
    font-family: ui-serif, Georgia, serif;
    font-size: 1.15rem;
  }

  .resource-links b {
    font-size: 1.3rem;
  }

  @media (max-width: 980px) {
    .hero-grid,
    .architecture-grid,
    .resource-card {
      grid-template-columns: 1fr;
    }

    .hero-grid {
      gap: 5rem;
    }

    .hero-copy {
      max-width: 46rem;
    }

    .app-window-wrap {
      width: min(100%, 42rem);
      margin-inline: auto;
    }

    .outcome-grid,
    .process-list {
      grid-template-columns: repeat(2, 1fr);
    }

    .outcome-grid article:nth-child(3) {
      border-left: 0;
    }

    .outcome-grid article:nth-child(n + 3) {
      border-top: 1px solid rgba(48, 43, 37, 0.35);
    }

    .architecture-grid {
      gap: 4rem;
    }

    .architecture-flow {
      max-width: 38rem;
    }

    .resource-card {
      gap: 3rem;
      padding: 3.5rem;
    }
  }

  @media (max-width: 640px) {
    .page-shell {
      width: min(100% - 2rem, 38rem);
    }

    .hero {
      padding: 3.75rem 0 4.5rem;
      background-size: 18px 18px;
    }

    .hero-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 4.5rem;
    }

    .hero h1 {
      font-size: clamp(3.05rem, 15vw, 4.4rem);
    }

    .hero-lead {
      font-size: 0.98rem;
    }

    .hero-actions {
      display: grid;
    }

    .action {
      width: 100%;
    }

    .hero-facts {
      display: grid;
      gap: 0.4rem;
    }

    .hero-facts li:not(:first-child)::before {
      margin-right: 0.6rem;
    }

    .app-window-wrap {
      width: calc(100% - 0.8rem);
      transform: rotate(0.5deg);
    }

    .window-address {
      display: none;
    }

    .app-shell {
      grid-template-columns: 4.3rem 1fr;
      min-height: 20rem;
    }

    .app-sidebar {
      padding: 0.9rem 0.45rem;
    }

    .app-logo {
      font-size: 0.62rem;
    }

    .sidebar-nav {
      font-size: 0.4rem;
    }

    .sidebar-nav span {
      padding: 0.45rem 0.3rem;
    }

    .app-content {
      padding: 1rem 0.75rem;
    }

    .app-heading strong {
      font-size: 0.68rem;
    }

    .mini-button {
      padding: 0.4rem;
      font-size: 0.36rem;
    }

    .metric-grid {
      gap: 0.35rem;
    }

    .metric-card {
      padding: 0.5rem;
    }

    .metric-card > span,
    .metric-card small {
      font-size: 0.34rem;
    }

    .metric-card strong {
      font-size: 0.8rem;
    }

    .metric-card .synced {
      font-size: 0.6rem;
    }

    .inventory-panel {
      padding: 0.6rem;
    }

    .outcome-section,
    .process-section,
    .architecture-section {
      padding: 5rem 0;
    }

    .section-heading h2,
    .architecture-copy h2,
    .resource-card h2 {
      font-size: 2.65rem;
    }

    .outcome-grid,
    .process-list {
      grid-template-columns: 1fr;
    }

    .outcome-grid article {
      min-height: auto;
      padding: 1.3rem 0.4rem 2rem;
    }

    .outcome-grid article + article {
      border-top: 1px solid rgba(48, 43, 37, 0.35);
      border-left: 0;
    }

    .outcome-grid h3 {
      margin-top: 2.2rem;
    }

    .architecture-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .prompt-card {
      grid-template-columns: 1fr;
      padding: 1.4rem;
    }

    .prompt-tags {
      grid-column: 1;
    }

    .process-list {
      gap: 2.5rem;
      margin-top: 4rem;
    }

    .process-list li {
      grid-template-columns: 2.4rem 1fr;
    }

    .resource-section {
      padding-top: 1rem;
    }

    .resource-card {
      width: 100%;
      padding: 3rem 1rem;
      border-radius: 0;
    }

    .resource-links strong {
      font-size: 1rem;
    }

    .note-bottom {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .action,
    .resource-links a {
      transition: none;
    }
  }
</style>
