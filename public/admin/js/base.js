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
    $('.aside>li:nth-child(1) ul,.aside>li:nth-child(2) ul').hide();
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
  },
  editNum(el, model, fields, id) {
    // 获取el里面的值
    let val = $(el).html();
    // 创建一个input的dom节点
    let input = $('<input value="">');
    // 点击input的时候阻止冒泡 为了点击时不执行任何操作
    $(input).click(function () {
      return false;
    });
    // 把input放在el里面
    $(el).html(input);
    // 让input获取焦点 给input赋值
    $(input).trigger('focus').val(val);
    // 鼠标离开的时候给span赋值 并触发ajax请求
    $(input).blur(function () {
      var num = $(this).val();
      $(el).html(num);
      // 触发ajax请求
      $.get('/admin/main/editNum', { id, model, fields, num });
    });
  }
}

window.onresize = function () {
  app.resizeIframe();
}