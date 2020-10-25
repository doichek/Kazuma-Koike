$(document).ready(function() {
  $('#fullpage').fullpage({
    anchors: ['1', '2', '3', '4', '5'],
    menu: '#menu',
    navigation: true, 
  });
});


$('.showcase__thumbnails').on('click',(e) => { 
  $('.showcase__thumbnails > li').removeClass('active');
  var selectedImgSrc = $(e.target).attr('src');
  $(e.target).closest('li').addClass('active');
  $('.view > a').children('img').attr('src', selectedImgSrc);
  $('.view').children('a').attr('href', selectedImgSrc);
});


//ご意見箱モーダル//
$('#submit-contact').on('click', (e) => {
  
  const user = $('#user').val();
  const adress = $('#adress').val();
  const message_text = $('#message-text').val();

  const data = {
    user: `${user}`,
    adress: `${adress}`,
    message_text: `${message_text}`,
    time: firebase.database.ServerValue.TIMESTAMP,
  };

  firebase
    .database()
    .ref('contact')
    .push(data);

  $('#exampleModal').modal('hide');
  $('#thanksModal').modal('show');
    
});

// アコーディオンメニュー
$('.accordion-title a').on('click', (e) => {
  // hrefにページ遷移しない
  e.preventDefault();

  // 同じsection内の.accordion-contentを選択
  const content = $(e.target)
    .closest('section')
    .find('.accordion-content');

  // .accordion-contentが非表示の場合は
  if (!content.is(':visible')) {
    // 表示中のコンテンツを閉じる
    $('.accordion-content:visible').slideUp();

    // クリックされたコンテンツを表示
    content.slideDown();
  }
});


// 画像ロード中の表示エリアのサイズ（px）
const initialSize = 60;

// 拡大表示をウインドウの端から何px空けるか
const padding = 100;

// 各アニメーションの時間（ミリ秒）
const animDuration = 300;

// img要素を表示する
const showImage = (img) => {
  const $img = $(img);

  // ウインドウの幅と高さを取得
  const windowWidth = $(window).width();
  const windowHeight = $(window).height();

  // ウインドウのアスペクト比を計算
  const windowAspectRatio = windowWidth / windowHeight;
  // 画像のアスペクト比を計算
  const imageAspectRatio = img.width / img.height;

  // ウインドウと画像のどちらが横に長いかによって
  // 表示サイズを決める
  let dispWidth;
  let dispHeight;
  if (windowAspectRatio > imageAspectRatio) {
    // 画像の方が縦に長い場合
    dispHeight = windowHeight - padding;
    dispWidth = dispHeight * imageAspectRatio;
  } else {
    // 画像の方が横に長い場合
    dispWidth = windowWidth - padding;
    dispHeight = dispWidth / imageAspectRatio;
  }

  // 画像の表示サイズをセット
  $img.css({
    width: `${dispWidth}px`,
    height: `${dispHeight}px`,
    display: 'none',
  });

  // img要素を.popup-content内に挿入
  $('.popup-content').html(img);

  // 表示エリアの拡大アニメーション
  $('.popup-content').animate(
    {
      width: `${dispWidth}px`,
      height: `${dispHeight}px`,
      // 下記2つは上下左右中央に置くために必要
      'margin-left': `${-dispWidth / 2}px`,
      'margin-top': `${-dispHeight / 2}px`,
    },
    animDuration,
    'swing',
    () => {
      // 拡大アニメーションが終わったら画像をフェードイン
      $img.fadeIn(animDuration);
    },
  );
};

// imageUrlの画像をポップアップで表示する関数
const showPopup = (imageUrl) => {
  // 前回挿入したimg要素を削除
  $('.popup-content').html('');

  // オーバーレイ（黒背景と画像表示エリア）をフェードイン
  $('.overlay').fadeIn(animDuration);

  // 画像表示エリアを小さな四角にする
  $('.popup-content').css({
    width: `${initialSize}px`,
    height: `${initialSize}px`,
    // 下記2つは上下左右中央に置くために必要
    'margin-left': `${-initialSize / 2}px`,
    'margin-top': `${-initialSize / 2}px`,
  });

  // img要素を作成して拡大画像をロードする
  const img = new Image();
  img.onload = () => {
    // 画像のロードが終わるとここが実行される
    showImage(img);
  };
  img.src = imageUrl;
};

// ポップアップを閉じる
const closePopup = () => {
  $('.overlay').fadeOut(animDuration);
};

// .popup要素がクリックされたらポップアップを表示
$('.popup').on('click', (e) => {
  e.preventDefault();
  const imageUrl = $(e.currentTarget).attr('href');
  showPopup(imageUrl);
});

// オーバーレイがクリックされたらポップアップを閉じる
$('.overlay').on('click', (e) => {
  e.preventDefault();
  closePopup();
});
