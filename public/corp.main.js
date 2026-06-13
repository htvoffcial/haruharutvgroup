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