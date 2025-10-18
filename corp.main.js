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

$('.btn-menu').on('click', function() {
    $('body').toggleClass('menu-open');
    if(document.body.className =='menu-open'){
      document.getElementById("opse").setAttribute("class","mnop");
      scrollTo(0, 0);
    }else{
        document.getElementById("opse").setAttribute("class","mncl");
    }
});
rsi();
window.onresize = rsi();
function rsi(){
if(768 > jQuery(window).width()){
  $('#mlb1').removeClass("mlpc");
  $('#mlb2').removeClass("mlpc");
  $('#mlb3').removeClass("mlpc");
}else{
  $('#mlb1').addClass("mlpc");
  $('#mlb2').addClass("mlpc");
  $('#mlb3').addClass("mlpc");
  document.getElementById("mlb1").setAttribute("open","open");
  document.getElementById("mlb2").setAttribute("open","open");
  document.getElementById("mlb3").setAttribute("open","open");
}
}

//ニュース読み込み
var li1;
var lang1;
if(location.href.indexOf("news")){
  li1=30;
}else{
  li1=10;
}
if(location.href.indexOf("/en/") !== -1){
  lang1="EN";
  console.log(lang1);
}else{
lang1="JA";
console.log(lang1);
}
$.ajax({
  type: "GET",
  url: "https://c.haruharutv.jp/news.php",
  data: { pid:"haruharutvgroup-press",li:li1 },
  async: false,
}).done(function (u) {
  displayData(u);
  });
function displayData(data) {
var resultList = document.getElementById('newslist');
resultList.innerHTML = '';      
data.forEach(item => {
  if(item.language == lang1){
  var listItem = document.createElement('div');
  var aid=JSON.parse(item.id);
  var upd = new Date(item.updateDate);
  var updop={year: 'numeric', month: '2-digit', day: '2-digit'};
  listItem.innerHTML = `<a href="https://www.htvgr.com/article/?/${aid[1]}"><div class="newsbox">${escapeHTML(upd.toLocaleDateString('ja-JP',updop))}  <catg class="${catg(item.category)}"></catg><br><b style="display:block;margin:5px;">${escapeHTML(item.title)}</b></div></a>`;

  resultList.appendChild(listItem);
  }
});
}
function catg(e){
 if(e == "プレス"){
  return "presi";
 }else if(e == "コンテンツ"){
  return "conti";
 }else{
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