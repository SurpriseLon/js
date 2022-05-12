function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

__webpack_require__(/*! ../static/style/less/usercard.less */ "./static/style/less/usercard.less");

var Friend = __webpack_require__(/*! ./friend.js */ "./src/friend.js");

var utils = __webpack_require__(/*! ./utils.js */ "./src/utils.js");

var _require = __webpack_require__(/*! ./utils.js */ "./src/utils.js"),
    getImgSrc = _require.getImgSrc;

var MessageBox = __webpack_require__(/*! ./message_box.js */ "./src/message_box.js");

var dataCache = {};
var friend = new Friend();
var isover = false;
var cd = 0;

var _require2 = __webpack_require__(/*! ./constant.js */ "./src/constant.js"),
    levelIconList = _require2.levelIconList;

var verifyIcon = [__webpack_require__(/*! ../static/images/ic_tag_offic_tagial.png */ "./static/images/ic_tag_offic_tagial.png")["default"], __webpack_require__(/*! ../static/images/ic_tag_enterprise.png */ "./static/images/ic_tag_enterprise.png")["default"]];
var sexIcon = {
  'man': __webpack_require__(/*! ../static/images/ic_tag_man_border.png */ "./static/images/ic_tag_man_border.png")["default"],
  'woman': __webpack_require__(/*! ../static/images/ic_tag_woman_border.png */ "./static/images/ic_tag_woman_border.png")["default"]
};

function UserCard(userStatus) {
  if (utils.browser.version.mobile) return;
  var defaultStatus = {
    isLogin: false,
    vipStatus: 0,
    vipType: 0,
    mid: null
  };
  this.userStatus = $.extend(defaultStatus, userStatus);

  if (!utils.browser.version.mobile) {
    this._registerEvent();
  }
}

UserCard.prototype.reset = function (data) {
  this.userStatus = data;
  dataCache = {};
};

UserCard.prototype._renderCard = function (data) {
  $('.user-card').remove();
  $('body').append(this._createCard(data)); //播放页日志上报

  utils.videoReport('playpage_namecard2');
};

UserCard.prototype._renderErrorCard = function () {
  $('.user-card').remove();
  $('body').append(this._createErrorCard());
};

UserCard.prototype._renderLoadingCard = function () {
  $('.user-card').remove();
  $('body').append(this._createLoadingCard());
};

UserCard.prototype._isLikeMe = function (data) {
  if (data.card && data.card.attentions) {
    for (var i = 0, len = data.card.attentions.length; i < len; ++i) {
      if (data.card.attentions[i] === this.userStatus.mid) {
        return true;
      }
    }
  }

  return false;
};

UserCard.prototype._createCard = function (data) {
  var _data$card, _data$card2;

  var bgUrl = data.space.s_img ? data.space.s_img : '//i0.hdslb.com/bfs/static/c9dae917e24b4fc17c4d544caf6b6c0b17f8692b.jpg';
  var nameColor = data.card.vip && data.card.vip.nickname_color ? ' style="color:' + data.card.vip.nickname_color + '"' : '';

  var isLikeMe = this._isLikeMe(data);

  var like = data.following ? '已关注' : '+ 关注';
  var liked = data.following ? 'liked' : '';
  var isVip = data.card.vip && data.card.vip.label && data.card.vip.label.text;
  liked += isLikeMe ? ' liked-me' : ''; // 埋点

  var _ref = data.card || {},
      mid = _ref.mid;

  var _ref2 = data.card.Official || {},
      verifyType = _ref2.type,
      verifyDesc = _ref2.title;

  utils.allCustomReport({
    c: 'up_information_window',
    d: 'o',
    e: 'show',
    type: 'appear'
  }, {
    msg: JSON.stringify({
      up_mid: mid,
      type: verifyType === 0 ? '1' : verifyType === 1 ? '2' : ''
    })
  });
  return "\n    <div class=\"user-card\">\n      <div class=\"bg\" style=\"background-image:url(".concat(getImgSrc(bgUrl, {
    w: 750,
    h: 240
  }), ")\"></div>\n      <a class=\"face\" href=\"//space.bilibili.com/").concat(mid, "\" target=\"_blank\">\n        <img src=\"").concat(getImgSrc(data.card.face, {
    w: 96,
    h: 96
  }), "\"/>\n        ").concat(verifyType === 0 ? "<img title=\"\u4E2A\u4EBA\u8BA4\u8BC1\" class=\"auth\" src=\"".concat(getImgSrc(verifyIcon[0]), "\"></img>") : '', "\n        ").concat(verifyType === 1 ? "<img title=\"\u4F01\u4E1A/\u56E2\u4F53\u8BA4\u8BC1\" class=\"auth\" src=\"".concat(getImgSrc(verifyIcon[1]), "\"></img>") : '', "\n      </a>\n      <div class=\"info\">\n        <p class=\"user\">\n          <a class=\"name\" ").concat(nameColor, " href=\"//space.bilibili.com/").concat(mid, "\" target=\"_blank\">").concat(utils.unhtml(data.card.name), "</a>\n          ").concat(data.card.sex === "保密" ? '' : data.card.sex === "男" ? "<img class=\"sex\" src=\"".concat(getImgSrc(sexIcon.man), "\"></img>") : "<img class=\"sex\" src=\"".concat(getImgSrc(sexIcon.woman), "\"></img>"), "\n          <a href=\"//www.bilibili.com/html/help.html#k_").concat(data.card.level_info.current_level, "\" target=\"_blank\">\n            <img class=\"level ").concat((_data$card = data.card) !== null && _data$card !== void 0 && _data$card.is_senior_member ? 'senior' : '', "\" src=\"").concat(getImgSrc(levelIconList[(_data$card2 = data.card) !== null && _data$card2 !== void 0 && _data$card2.is_senior_member ? 'senior' : data.card.level_info.current_level]), "\">\n          </a>\n          ").concat(isVip ? "<span class=\"vip-icon\" style=\"color: ".concat(data.card.vip.label.text_color, "; background-color:").concat(data.card.vip.label.bg_color, "\"><span class=\"tinyfont\">").concat(data.card.vip.label.text, "</span></span>") : '', "\n        </p>\n        <p class=\"social\">\n          <a href=\"//space.bilibili.com/").concat(mid, "/fans/follow\" target=\"_blank\">\n            <span>").concat(data.card.friend, "</span><span class=\"gray-text\"> \u5173\u6CE8</span>\n          </a>\n          <a href=\"//space.bilibili.com/").concat(mid, "/fans/fans\" target=\"_blank\">\n            <span>").concat(utils.formatNum(data.card.fans), "</span><span class=\"gray-text\"> \u7C89\u4E1D</span>\n          </a>\n          <span>").concat(utils.formatNum(data.like_num), "</span><span class=\"gray-text\"> \u83B7\u8D5E</span>\n        </p>\n        <p class=\"verify\">\n          ").concat(verifyType === 0 ? "<span><img title=\"\u4E2A\u4EBA\u8BA4\u8BC1\" class=\"auth\" src=\"".concat(getImgSrc(verifyIcon[0]), "\"></img>bilibili\u4E2A\u4EBA\u8BA4\u8BC1\uFF1A").concat(verifyDesc, "</span>") : '', "\n          ").concat(verifyType === 1 ? "<span><img title=\"\u4F01\u4E1A/\u56E2\u4F53\u8BA4\u8BC1\" class=\"auth\" src=\"".concat(getImgSrc(verifyIcon[1]), "\"></img>bilibili\u673A\u6784\u8BA4\u8BC1\uFF1A").concat(verifyDesc, "</span>") : '', "\n        </p>\n        ").concat(data.card.sign ? "<p class=\"sign\">".concat(utils.unhtml(data.card.sign), "</p>") : '', "\n      </div>\n      <div class=\"btn-box\">\n        <a class=\"like ").concat(liked, "\" mid=\"").concat(mid, "\" uname=\"").concat(utils.unhtml(data.card.name), "\" ").concat(data.quiet ? quiet = "true" : '', ">\n          <span class=\"default-text\">").concat(like, "</span>\n          <span class=\"hover-text\">\u53D6\u6D88\u5173\u6CE8</span>\n        </a>\n        <a class=\"message\" href=\"//message.bilibili.com/#whisper/mid").concat(mid, "\" target=\"_blank\">\u53D1\u6D88\u606F</a>\n      </div>\n    </div>\n  ");
};

UserCard.prototype._createErrorCard = function () {
  return '<div class="user-card"><p class="error-card">加载失败</p></div>';
};

UserCard.prototype._createLoadingCard = function () {
  return '<div class="user-card"><p class="loading-card">正在加载中...请稍后。</p></div>';
}; //设置坐标


UserCard.prototype._setPosition = function (obj) {
  var dest = 32;
  var tw = 375;
  var x = $(obj).offset().left;
  var y = $(obj).offset().top;
  var w = $(obj).outerWidth();
  var tx = 0; // if($(window).width()-(x+w) > dest+tw || (x-dest) < ($(window).width()-x-w-dest)){
  // 	tx = x + dest + w;
  // }else{
  // 	tx = x - dest - tw;
  // }
  // var h = y-220-$(obj).outerHeight();;

  if ($(obj).offset().top < $(window).scrollTop() + $('.user-card').height() + 32) {
    var h = y + $(obj).outerHeight() + 8;
  } else {
    var h = y - $('.user-card').height() - 32;
  }

  if ($(obj.height)) {}

  $('.user-card').css({
    left: x,
    top: h
  });
};

UserCard.prototype._registerEvent = function () {
  var me = this;
  $('body').off('click.userCardAttention').on('click.userCardAttention', '.user-card .btn-box .like', function () {
    if (me.userStatus.isLogin) {
      var liked = $(this).hasClass('liked');
      var likedMe = $(this).hasClass('liked-me');
      var uid = $(this).attr('mid');
      var uname = $(this).attr('uname');
      var the = this;

      if (liked) {
        //取消关注
        friend.unFollow(uid, function (d) {
          if (d && d.code === 0) {
            $(the).removeClass('liked').text('＋ 关注');
            delete dataCache[uid];
            new MessageBox().show($(the), '取消关注成功!', 1000, 'ok');
          } else if (d) {
            new MessageBox().show($(the), d.message, 1000, 'error');
          }
        }, $(this).attr('quiet')); //播放页日志上报

        utils.videoReport('playpage_unfollow2');
      } else {
        //关注
        friend.follow(uid, function (d) {
          //如果code == -665 提示关注上限
          if (d.code == 22006) {
            $.getScript('//static.hdslb.com/plugins/attentionLimitPopup/attentionLimitPopup.js', function () {
              new attentionLimitPopup();
            });
          } else {
            if (d && d.code === 0) {
              $(the).text('取消关注').addClass('liked');
              delete dataCache[uid];
            } else if (d) {
              new MessageBox().show($(the), d.message, 1000, 'error');
            }
          }
        }); //播放页日志上报

        utils.videoReport('playpage_follow2');
      }
    } else {
      document.location.href = 'https://account.bilibili.com/login';
    }
  });
  $('body').on('mouseenter.data-userCard', '[data-usercard-mid]', function (e) {
    var mid = $(this).attr('data-usercard-mid');
    var the = this;
    clearTimeout(cd);
    cd = setTimeout(function () {
      var $replyItem = $(the).parents('.reply-wrap:eq(0)');
      var rid = +$replyItem.attr('data-id');
      var isFace = $(the).parent().hasClass('user-face');
      var isName = $(the).hasClass('name');

      if (isFace) {
        utils.customReport('replyCardProfileHover', {
          rpid: rid
        });
      }

      if (isName) {
        utils.customReport('replyCardNameHover', {
          rpid: rid
        });
      }

      if (dataCache[mid]) {
        me._renderCard(dataCache[mid]);

        me._setPosition(the);
      } else {
        var _$$ajax;

        me._renderLoadingCard();

        me._setPosition(the);

        $.ajax((_$$ajax = {
          url: '//api.bilibili.com/x/web-interface/card',
          dataType: 'jsonp',
          data: {
            mid: mid,
            photo: 1,
            jsonp: 'jsonp'
          }
        }, _defineProperty(_$$ajax, "dataType", 'jsonp'), _defineProperty(_$$ajax, "cache", true), _defineProperty(_$$ajax, "success", function success(data) {
          if (data && data.code === 0) {
            $.ajax({
              url: '//api.bilibili.com/x/relation',
              data: {
                fid: mid,
                jsonp: 'jsonp'
              },
              dataType: 'jsonp'
            }).done(function (res) {
              if (res && res.code === 0) {
                data.data.following = res.data.attribute === 1 || res.data.attribute === 2 || res.data.attribute === 6;
                data.data.quiet = res.data.attribute === 1;
              } else {
                data.data.following = false;
              }

              me._renderCard(data.data);

              me._setPosition(the);

              dataCache[data.data.card.mid] = data.data;
            }).fail(function () {
              me._renderErrorCard();

              me._setPosition(the);
            });
          }
        }), _defineProperty(_$$ajax, "error", function error() {
          me._renderErrorCard();

          me._setPosition(the);
        }), _$$ajax));
      }
    }, 300);
  });
  $('body').on('mouseleave.data-userCard', '[data-usercard-mid]', function (e) {
    clearTimeout(cd);
    cd = setTimeout(function () {
      $('.user-card').remove();
    }, 100);
  });
  $('body').on('mouseenter.userCard', '.user-card', function (e) {
    clearTimeout(cd);
  });
  $('body').on('mouseleave.userCard', '.user-card', function (e) {
    $('.user-card').remove();
  });
};

module.exports = UserCard;
