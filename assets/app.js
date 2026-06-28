/* HoloTeam 從零開始 線上課程網站 互動邏輯 */
(function () {
  'use strict';

  var DATA = window.COURSE_DATA || [];
  var CHAPTER_ORDER = ['序章', '第一部・SKILL 版', '轉折', '第二部・單機版', '第三部・持續進化'];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function groupByChapter(items) {
    var map = {};
    items.forEach(function (u) { (map[u.chapter] = map[u.chapter] || []).push(u); });
    return CHAPTER_ORDER
      .filter(function (c) { return map[c]; })
      .map(function (c) { return { chapter: c, units: map[c] }; });
  }

  function byId(id) {
    for (var i = 0; i < DATA.length; i++) { if (DATA[i].id === id) return DATA[i]; }
    return null;
  }
  function indexOfId(id) {
    for (var i = 0; i < DATA.length; i++) { if (DATA[i].id === id) return i; }
    return -1;
  }

  function renderMarkdown(md) {
    var stripped = md.replace(/^\s*#\s+.*\r?\n/, ''); // 去掉首行 H1，避免與標題重複
    var raw = window.marked ? window.marked.parse(stripped) : stripped;
    return window.DOMPurify ? window.DOMPurify.sanitize(raw) : raw;
  }

  function buildToc(filter) {
    var toc = document.getElementById('toc');
    if (!toc) return;
    toc.innerHTML = '';
    var q = (filter || '').trim().toLowerCase();
    var groups = groupByChapter(DATA);

    groups.forEach(function (g) {
      var units = g.units.filter(function (u) {
        if (!q) return true;
        return u.title.toLowerCase().indexOf(q) >= 0 ||
               u.num.indexOf(q) >= 0 ||
               u.markdown.toLowerCase().indexOf(q) >= 0;
      });
      if (!units.length) return;

      var sec = document.createElement('section');
      sec.className = 'toc-group';

      var head = document.createElement('button');
      head.className = 'toc-group-head';
      head.innerHTML = '<span class="caret">&#9662;</span><span>' + escapeHtml(g.chapter) + '</span>';
      head.addEventListener('click', function () { sec.classList.toggle('collapsed'); });
      sec.appendChild(head);

      var ul = document.createElement('ul');
      ul.className = 'toc-list';
      units.forEach(function (u) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + u.id;
        a.className = 'toc-item';
        a.setAttribute('data-id', u.id);
        a.innerHTML =
          '<span class="toc-num">' + escapeHtml(u.num) + '</span>' +
          '<span class="toc-title">' + escapeHtml(u.title) + '</span>' +
          '<span class="toc-min">' + u.minutes + ' 分</span>';
        li.appendChild(a);
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      toc.appendChild(sec);
    });
    highlightActive();
  }

  function renderHero() {
    var total = DATA.length;
    var mins = DATA.reduce(function (a, u) { return a + u.minutes; }, 0);
    var content = document.getElementById('content');
    content.innerHTML =
      '<div class="hero">' +
        ((DATA[0] && DATA[0].image) ? '<img class="hero-cover" src="' + DATA[0].image + '" alt="">' : '') +
        '<p class="hero-kicker">自主運營虛擬團隊 AI　・　開發全紀錄</p>' +
        '<h1 class="hero-title">HoloTeam 從零開始</h1>' +
        '<p class="hero-lead">從一堆 Markdown 規則，到能獨立安裝的桌面軟體。這套文件帶你一站一站看懂：一個人怎麼用 AI 長出一支會自己找事做、自己接力、自己記得事情的虛擬團隊，以及它走過哪些彎路、放棄過哪些方案。</p>' +
        '<div class="hero-stats">' +
          '<div><strong>' + total + '</strong><span>個單元</span></div>' +
          '<div><strong>' + mins + '</strong><span>分鐘閱讀</span></div>' +
          '<div><strong>2</strong><span>大演化階段</span></div>' +
        '</div>' +
        '<button class="hero-cta" id="startBtn">開始閱讀第一篇</button>' +
      '</div>';
    var b = document.getElementById('startBtn');
    if (b) b.addEventListener('click', function () { location.hash = '#' + DATA[0].id; });
    document.title = 'HoloTeam 從零開始';
  }

  function renderUnit(u) {
    var idx = indexOfId(u.id);
    var prev = idx > 0 ? DATA[idx - 1] : null;
    var next = idx < DATA.length - 1 ? DATA[idx + 1] : null;
    var content = document.getElementById('content');

    content.innerHTML =
      '<article class="unit">' +
        (u.image ? '<img class="unit-hero" src="' + u.image + '" alt="">' : '') +
        '<div class="unit-head">' +
          '<span class="unit-chapter">' + escapeHtml(u.chapter) + '</span>' +
          '<h1 class="unit-title">' + escapeHtml(u.title) + '</h1>' +
          '<p class="unit-meta">單元 ' + escapeHtml(u.num) + '　・　預估閱讀 ' + u.minutes + ' 分鐘</p>' +
        '</div>' +
        '<div class="md">' + renderMarkdown(u.markdown) + '</div>' +
        (!next
          ? '<div class="course-end">' +
              '<p class="course-end-kicker">課程到這裡告一段落</p>' +
              '<p class="course-end-text">想看單機版實際長什麼樣子、親自體驗 HoloTeam 嗎？歡迎前往官方網站進一步了解。</p>' +
              '<a class="course-end-btn" href="https://holoteam.cattravelworld.com/" target="_blank" rel="noopener">前往 HoloTeam 官方網站 ↗</a>' +
            '</div>'
          : '') +
        '<nav class="unit-nav">' +
          (prev
            ? '<a class="navbtn prev" href="#' + prev.id + '"><span>上一篇</span><strong>' + escapeHtml(prev.title) + '</strong></a>'
            : '<span></span>') +
          (next
            ? '<a class="navbtn next" href="#' + next.id + '"><span>下一篇</span><strong>' + escapeHtml(next.title) + '</strong></a>'
            : '<span></span>') +
        '</nav>' +
      '</article>';

    document.title = u.title + '｜HoloTeam 從零開始';
    content.scrollTop = 0;
    closeSidebar();
  }

  function highlightActive() {
    var id = (location.hash || '').replace('#', '');
    var items = document.querySelectorAll('.toc-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('active', items[i].getAttribute('data-id') === id);
    }
  }

  function route() {
    var id = (location.hash || '').replace('#', '');
    var u = id ? byId(id) : null;
    if (u) renderUnit(u); else renderHero();
    highlightActive();
  }

  function closeSidebar() { document.body.classList.remove('sidebar-open'); }

  function setup() {
    var meta = document.getElementById('courseMeta');
    if (meta) meta.textContent = '共 ' + DATA.length + ' 個單元';

    buildToc('');
    route();

    window.addEventListener('hashchange', route);

    var search = document.getElementById('search');
    if (search) search.addEventListener('input', function () { buildToc(search.value); });

    var toggle = document.getElementById('sidebarToggle');
    if (toggle) toggle.addEventListener('click', function () { document.body.classList.toggle('sidebar-open'); });

    var overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeSidebar);

    var home = document.getElementById('homeLink');
    if (home) home.addEventListener('click', function (e) {
      e.preventDefault();
      if (location.hash) { location.hash = ''; } else { route(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
