$(function () {
  app.init();
});

let app = {
  init: function () {
    this.toggleAside();
    this.resizeIframe();
    this.confirmDelete();
  },
  resizeIframe: function () {
    $('#rightMain').height($(window).height() - 50);
  },
  toggleAside: function () {
    $('.aside h4').click(function () {
      // $(this).toggleClass('active');
      $(this).siblings('ul').slideToggle();
    });
  },
  confirmDelete() {
    $('.delete').click(function () {
      return confirm('Are you sure?');
    });
  }
}

window.onresize = function () {
  app.resizeIframe();
}