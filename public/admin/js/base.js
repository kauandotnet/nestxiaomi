$(function() {

  app.init();

});

var app = {
  init: function() {
    this.slideToggle();
    this.resizeIframe();

    this.confirmDelete();

  },
  resizeIframe: function() {
    $('#rightMain').height($(window).height() - 80);
  },
  slideToggle: function() {
    $('.aside>li:nth-child(1) ul,.aside>li:nth-child(2) ul').hide();
    $('.aside h4').click(function() {
      $(this).siblings('ul').slideToggle();
    });
  },
  // 提示是否删除
  confirmDelete() {
    $('.delete').click(function() {
      var flag = confirm('Are you sure?');
      return flag;
    });
  },
  changeStatus(el, model, fields, id) {

    $.get('/admin/main/changeStatus', { id: id, model: model, fields: fields }, function(data) {
      if (data.success) {
        if (el.src.indexOf('yes') != -1) {
          el.src = '/admin/images/no.gif';
        } else {
          el.src = '/admin/images/yes.gif';
        }
      }
    });
  },
  editNum(el, model, fields, id) {
    var val = $(el).html();
    var input = $('<input value=\'\' />');
    $(el).html(input);
    $(input).trigger('focus').val(val);
    $(input).click(function() {
      return false;
    });

    $(input).blur(function() {
      var num = $(this).val();
      $(el).html(num);
      $.get('/admin/main/editNum', { id: id, model: model, fields: fields, num: num }, function(data) {
        console.log(data);
      });
    });
  },
};

window.onresize = function() {
  app.resizeIframe();
};
