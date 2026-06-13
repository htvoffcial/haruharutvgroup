
// --- 劇軽フォント自動最適化ローダー ---
(function() {
  // 1. すでにHTML側でGoogle Fonts等のリンクタグがあるか、または適用済みかチェック
  const hasGoogleFonts = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]')).length > 0;
  
  // HTML側で読み込まれている場合は、JS側は何もしない（そのままブラウザに任せる）
  if (hasGoogleFonts) {
    console.log("Font Loader: Google Fonts link detected in HTML. Skipping dynamic load.");
    return;
  }

  console.log("Font Loader: No Google Fonts link found. Starting fallback injection...");

  // CSSを動的に生成して、2（ローカル挑戦）と 3（WOFF2適用）を同時に効率よく行う
  // font-display: swap も効かせるため、文字が消える現象（ブロック）も起きません。
  const fontStyle = document.createElement('style');
  fontStyle.textContent = `
    @font-face {
      font-family: 'Noto Sans JP Custom';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Noto Sans JP'), 
           local('NotoSansJP-Regular'),
           url('https://fonts.gstatic.com/s/notosansjp/v52/-nd47OgZ05eKE68As4w_cXA6b6-v.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Poppins Custom';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Poppins'), 
           local('Poppins-Regular'),
           url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJbecmNE.woff2') format('woff2');
    }

    body, html {
      font-family: 'Poppins Custom', 'Noto Sans JP Custom', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }
  `;

  // 生成したStyleタグを即座にheadにブチ込む
  document.head.appendChild(fontStyle);
  console.log("Font Loader: Dynamic fonts styling injected successfully.");
})();


let slideIndex = 0;
// ページの読み込み完了を待ってから処理を開始する
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');

  function showSlide(index) {
    // スライドが存在しないページ（ニュースルームなど）なら何もしない
    if (!slides || slides.length === 0) return; 
    
    slides.forEach((slide) => {
      slide.classList.remove('fade');
    });
    
    if (slides[index]) {
      slides[index].classList.add('fade');
    }
  }

  function plusSlides(n) {
    if (!slides || slides.length === 0) return;
    slideIndex += n;
    if (slideIndex >= slides.length) {
      slideIndex = 0;
    } else if (slideIndex < 0) {
      slideIndex = slides.length - 1;
    }
    showSlide(slideIndex);
  }

  // スライドショーが存在する場合のみタイマーを起動
  if (slides && slides.length > 0) {
    showSlide(slideIndex);
    setInterval(() => {
      plusSlides(1);
    }, 6000);
  }

  // --- MENU TOGGLE ---
  const btnMenu = document.querySelector('.btn-menu');
  if (btnMenu) {
    btnMenu.addEventListener('click', function() {
      document.body.classList.toggle('menu-open');
      const opse = document.getElementById("opse");
      
      if (document.body.classList.contains('menu-open')) {
        if (opse) opse.className = "mnop";
        window.scrollTo(0, 0);
      } else {
        if (opse) opse.className = "mncl";
      }
    });
  }

  // --- RESIZE FUNCTION ---
  rsi();
  window.addEventListener('resize', rsi);

  function rsi(){
    const mlb1 = document.getElementById('mlb1');
    const mlb2 = document.getElementById('mlb2');
    const mlb3 = document.getElementById('mlb3');

    if (window.innerWidth < 768) {
      if (mlb1) mlb1.classList.remove("mlpc");
      if (mlb2) mlb2.classList.remove("mlpc");
      if (mlb3) mlb3.classList.remove("mlpc");
    } else {
      if (mlb1) { mlb1.classList.add("mlpc"); mlb1.setAttribute("open", "open"); }
      if (mlb2) { mlb2.classList.add("mlpc"); mlb2.setAttribute("open", "open"); }
      if (mlb3) { mlb3.classList.add("mlpc"); mlb3.setAttribute("open", "open"); }
    }
  }

  // --- ニュース読み込み ---
  var li1 = location.href.indexOf("news") !== -1 ? 30 : 10;
  var lang1 = location.href.indexOf("/en/") !== -1 ? "EN" : "JA";

  const url = new URL("https://c.haruharutv.jp/news.php");
  url.searchParams.append("pid", "haruharutvgroup-press");
  url.searchParams.append("li", li1);

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(u => {
      displayData(u);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

  function displayData(data) {
    var resultList = document.getElementById('newslist');
    if (!resultList) return;
    resultList.innerHTML = '';      
    
    data.forEach(item => {
      if (item.language == lang1) {
        var listItem = document.createElement('div');
        var aid = JSON.parse(item.id);
        var upd = new Date(item.updateDate);
        var updop = { year: 'numeric', month: '2-digit', day: '2-digit' };
        var categoryClass = catg(item.category) ? catg(item.category) : "";

        listItem.innerHTML = `<a href="https://www.htvgr.com/article/?/${aid[1]}"><div class="newsbox">${escapeHTML(upd.toLocaleDateString('ja-JP', updop))}  <catg class="${categoryClass}"></catg><br><b style="display:block;margin:5px;">${escapeHTML(item.title)}</b></div></a>`;

        resultList.appendChild(listItem);
      }
    });
  }

  function catg(e) {
    if (e == "プレス") return "presi";
    if (e == "コンテンツ") return "conti";
    return false;
  }

  function escapeHTML(text) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  // --- HIGH SENSITIVITY INTERSECTION OBSERVER ---
  const targets = document.querySelectorAll('.fdb');
  if (targets.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 交差判定、またはすでに画面内にある場合は即座に表示クラスを付与
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    }, {
      root: null,
      threshold: 0,
      rootMargin: "200px 0px 200px 0px"
    });

    targets.forEach(target => observer.observe(target));
  }
});