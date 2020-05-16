

function play() {
  document.getElementById('video').play()
}

function start() {
  document.querySelector('.play').classList.add('off');
  document.querySelector('#video').classList.add('off');
}

function end() {
  document.querySelector('.play').classList.remove('off');
  document.querySelector('#video').classList.remove('off');
}

function stop(e) {
  if (e.currentTarget === e.target) {
    document.getElementById('video').pause();
  }
}

// Подстановка даты
(function () {
  var today = new Date();
  var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
  var monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  var elements = document.querySelectorAll('.js-tomorrow');
  for (var i = 0; i < elements.length; i++) {
    elements[i].innerHTML = tomorrow.getDate() + " " + monthNames[tomorrow.getMonth()] + " " + tomorrow.getFullYear() + " г.";
  }
})();


// Плавная прокрутка
(function () {
  initSmoothScrolling();

  function initSmoothScrolling() {
    var duration = 400;
    var pageUrl = location.hash ? stripHash(location.href) : location.href;
    delegatedLinkHijacking();

    function delegatedLinkHijacking() {
      document.body.addEventListener('click', onClick, false);

      function onClick(e) {
        var t = e.target.tagName.toLowerCase() === 'a' ? e.target : e.target.parentElement;
        if (!isInPageLink(t))
          return;

        e.stopPropagation();
        e.preventDefault();

        jump(t.hash, {
          duration: duration,
          callback: function () {
            setFocus(t.hash);
          }
        });
      }
    }

    function isInPageLink(n) {
      return n.tagName.toLowerCase() === 'a' &&
          n.hash.length > 0 &&
          stripHash(n.href) === pageUrl;
    }

    function stripHash(url) {
      return url.slice(0, url.lastIndexOf('#'));
    }

    function isCssSmoothSCrollSupported() {
      return 'scrollBehavior' in document.documentElement.style;
    }

    function setFocus(hash) {
      var element = document.getElementById(hash.substring(1));

      if (element) {
        if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
          element.tabIndex = -1;
        }

        element.focus();
      }
    }

  }

  function jump(target, options) {
    var scrollPos = window.scrollY || window.scollTop || document.getElementsByTagName("html")[0].scrollTop;
    window.history.replaceState({path: window.location.href, scrollTop: scrollPos}, '', window.location.hash);
    scrollPos = window.scrollY || window.scollTop || document.getElementsByTagName("html")[0].scrollTop;
    window.history.pushState({path: window.location.href, scrollTop: scrollPos}, '', target);
    var
        start = window.pageYOffset,
        opt = {
          duration: options.duration,
          offset: options.offset || 0,
          callback: options.callback,
          easing: options.easing || easeInOutQuad
        },
        distance = typeof target === 'string' ?
            opt.offset + document.querySelector(target).getBoundingClientRect().top :
            target,
        duration = typeof opt.duration === 'function' ?
            opt.duration(distance) :
            opt.duration,
        timeStart, timeElapsed;

    requestAnimationFrame(function (time) {
      timeStart = time;
      loop(time);
    });

    function loop(time) {
      timeElapsed = time - timeStart;

      window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));

      if (timeElapsed < duration)
        requestAnimationFrame(loop);
      else
        end();
    }

    function end() {
      window.scrollTo(0, start + distance);

      if (typeof opt.callback === 'function')
        opt.callback();
    }

    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

  }
})();

