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
  },
  changeStatus(el, model, fields, id) {
    $.get('/admin/main/changeStatus', { id, model, fields }, function (data) {
      if (data.success) {
        if (el.src.indexOf('yes') != -1) {
          el.src = '/admin/images/no.gif';
        } else {
          el.src = '/admin/images/yes.gif';
        }
      }
    });
  }
}

window.onresize = function () {
  app.resizeIframe();
}