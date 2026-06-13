
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
    /* Noto Sans JP の動的定義 */
    @font-face {
      font-family: 'Noto Sans JP Custom';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      /* まずローカルに挑戦、なければ最軽量のWOFF2を直接ダウンロード */
      src: local('Noto Sans JP'), 
           local('NotoSansJP-Regular'),
           url('https://fonts.gstatic.com/s/notosansjp/v52/-nd47OgZ05eKE68As4w_cXA6b6-v.woff2') format('woff2');
    }

    /* Poppins の動的定義 */
    @font-face {
      font-family: 'Poppins Custom';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      /* まずローカルに挑戦、なければ最軽量のWOFF2を直接ダウンロード */
      src: local('Poppins'), 
           local('Poppins-Regular'),
           url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJbecmNE.woff2') format('woff2');
    }

    /* 3. 即席適用：bodyとhtmlの優先度を上書き */
    body, html {
      font-family: 'Poppins Custom', 'Noto Sans JP Custom', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }
  `;

  // 生成したStyleタグを即座にheadにブチ込む
  document.head.appendChild(fontStyle);
  console.log("Font Loader: Dynamic fonts styling injected successfully.");
})();


let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  slides.forEach((slide) => {
    slide.classList.remove('fade');
  });
  
  slides[index].classList.add('fade');
}

function plusSlides(n) {
  slideIndex += n;
  if (slideIndex >= slides.length) {
    slideIndex = 0;
  } else if (slideIndex < 0) {
    slideIndex = slides.length - 1;
  }
  showSlide(slideIndex);
}

function currentSlide(n) {
  slideIndex = n;
  showSlide(slideIndex);
}

document.addEventListener('DOMContentLoaded', () => {
  showSlide(slideIndex);
  setInterval(() => {
    plusSlides(1);
  }, 6000);
});

// --- MENU TOGGLE (jQueryなし) ---
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

// --- RESIZE FUNCTION (jQueryなし) ---
// 初回実行
rsi();
// イベントリスナーには関数名のみを渡します（()をつけると、その場で実行されてしまいます）
window.addEventListener('resize', rsi);

function rsi(){
  const mlb1 = document.getElementById('mlb1');
  const mlb2 = document.getElementById('mlb2');
  const mlb3 = document.getElementById('mlb3');

  // jQuery(window).width() を window.innerWidth に変更
  if (window.innerWidth < 768) {
    if (mlb1) mlb1.classList.remove("mlpc");
    if (mlb2) mlb2.classList.remove("mlpc");
    if (mlb3) mlb3.classList.remove("mlpc");
  } else {
    if (mlb1) {
      mlb1.classList.add("mlpc");
      mlb1.setAttribute("open", "open");
    }
    if (mlb2) {
      mlb2.classList.add("mlpc");
      mlb2.setAttribute("open", "open");
    }
    if (mlb3) {
      mlb3.classList.add("mlpc");
      mlb3.setAttribute("open", "open");
    }
  }
}

// --- ニュース読み込み (jQueryなし) ---
var li1;
var lang1;

// ※修正: indexOf("news") !== -1 に変更（元のコードだと見つからない時-1になり、true判定されてしまいます）
if (location.href.indexOf("news") !== -1) {
  li1 = 30;
} else {
  li1 = 10;
}

if (location.href.indexOf("/en/") !== -1) {
  lang1 = "EN";
  console.log(lang1);
} else {
  lang1 = "JA";
  console.log(lang1);
}

// Fetch API を使用して非同期でデータ取得（元の async: false は非推奨なため通常の非同期処理にしています）
const url = new URL("https://c.haruharutv.jp/news.php");
url.searchParams.append("pid", "haruharutvgroup-press");
url.searchParams.append("li", li1);

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // サーバーがJSONを返す想定
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
      
      // catg() の戻り値が false の場合の対策を追加
      var categoryClass = catg(item.category) ? catg(item.category) : "";

      listItem.innerHTML = `<a href="https://www.htvgr.com/article/?/${aid[1]}"><div class="newsbox">${escapeHTML(upd.toLocaleDateString('ja-JP', updop))}  <catg class="${categoryClass}"></catg><br><b style="display:block;margin:5px;">${escapeHTML(item.title)}</b></div></a>`;

      resultList.appendChild(listItem);
    }
  });
}

function catg(e) {
  if (e == "プレス") {
    return "presi";
  } else if (e == "コンテンツ") {
    return "conti";
  } else {
    return false;
  }
}

function escapeHTML(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

  
const targets = document.getElementsByClassName('fdb');

// 【フェイルオーバー】要素が存在しない、または取得できなかった場合はここで処理を終了する
if (!targets || targets.length === 0) {// 必要に応じてコンソールに警告を出します（消してもOK）
} else {
  // 要素が存在する場合のみ、以下の監視処理を実行
  for (let i = targets.length; i--;) {
    let observer = new IntersectionObserver((entries, observer) => {
      for (let j = entries.length; j--;) {
        if (entries[j].isIntersecting) {
          entries[j].target.classList.add('show');
        } else {
          entries[j].target.classList.remove('show');
        }
      }
    });
    observer.observe(targets[i]);
  }
}

