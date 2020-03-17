$(function () {
  app.init();
});

var app = {
  init: function () {
    this.toggleAside();
    this.resizeIframe();
  },
  resizeIframe: function () {
    $('#rightMain').height($(window).height() - 50);
  },
  toggleAside: function () {
    $('.aside h4').click(function () {
      // $(this).toggleClass('active');
      $(this).siblings('ul').slideToggle();
    });
  }
}

window.onresize = function () {
  app.resizeIframe();
}