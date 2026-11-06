/* =========================================================
   苏青淮的个人主页 — 交互
   1) 导航滚动进度与压缩  2) 区块进入  3) 数字滚动
   4) 成果筛选  5) 联系方式复制  6) 留言表单转邮件
   ========================================================= */

/* 收件邮箱：上线前改成你自己的邮箱 */
var CONTACT_EMAIL = "430615396@qq.com";

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ---------- 页脚年份 ---------- */
  var years = document.querySelectorAll("[data-year]");
  for (var i = 0; i < years.length; i++) {
    years[i].textContent = String(new Date().getFullYear());
  }

  /* ---------- 导航：进度条与压缩 ---------- */
  var nav = document.querySelector(".nav");
  var navBar = null;

  if (nav) {
    navBar = document.createElement("div");
    navBar.className = "nav__bar";
    nav.appendChild(navBar);
  }

  var ticking = false;

  function onScrollFrame() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var span = document.documentElement.scrollHeight - window.innerHeight;
    var progress = span > 0 ? Math.min(y / span, 1) : 0;

    if (navBar) navBar.style.transform = "scaleX(" + progress + ")";
    if (nav) nav.classList.toggle("is-compact", y > 30);

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScrollFrame);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScrollFrame();

  /* ---------- 区块进入 ---------- */
  var sections = document.querySelectorAll(".section");

  function markIn(el) {
    el.classList.add("is-in");
  }

  if (!reduceMotion && hasIO) {
    var sectionIO = new IntersectionObserver(function (entries) {
      for (var n = 0; n < entries.length; n++) {
        if (entries[n].isIntersecting) {
          markIn(entries[n].target);
          sectionIO.unobserve(entries[n].target);
        }
      }
    }, { threshold: 0.06, rootMargin: "0px 0px -8% 0px" });

    for (var s = 0; s < sections.length; s++) {
      var sec = sections[s];
      if (sec.getBoundingClientRect().top > window.innerHeight * 0.9) {
        sec.classList.add("reveal");
        sectionIO.observe(sec);
      } else {
        markIn(sec);
      }
    }
  } else {
    for (var s2 = 0; s2 < sections.length; s2++) {
      markIn(sections[s2]);
    }
  }

  /* ---------- 读数带数字滚动 ---------- */
  var numbers = document.querySelectorAll("[data-roll]");

  function reserveWidth(el, target) {
    el.style.minWidth = (String(target).length + 0.12) + "ch";
  }

  function rollNumber(el) {
    var target = parseInt(el.getAttribute("data-roll"), 10) || 0;
    reserveWidth(el, target);

    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }

    var duration = 1500;
    var startTime = null;

    function frame(now) {
      if (startTime === null) startTime = now;
      var p = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = String(Math.round(target * eased));

      if (p < 1) {
        window.requestAnimationFrame(frame);
      } else {
        el.textContent = String(target);
      }
    }

    window.requestAnimationFrame(frame);
  }

  if (numbers.length) {
    for (var n0 = 0; n0 < numbers.length; n0++) {
      reserveWidth(numbers[n0], parseInt(numbers[n0].getAttribute("data-roll"), 10) || 0);
      if (!reduceMotion) numbers[n0].textContent = "0";
    }

    if (!reduceMotion && hasIO) {
      var numberIO = new IntersectionObserver(function (entries) {
        for (var m = 0; m < entries.length; m++) {
          if (entries[m].isIntersecting) {
            rollNumber(entries[m].target);
            numberIO.unobserve(entries[m].target);
          }
        }
      }, { threshold: 0.4 });

      for (var n1 = 0; n1 < numbers.length; n1++) {
        numberIO.observe(numbers[n1]);
      }
    } else {
      for (var n2 = 0; n2 < numbers.length; n2++) {
        rollNumber(numbers[n2]);
      }
    }
  }

  /* ---------- 成果筛选 ---------- */
  var filterBar = document.querySelector("[data-filters]");

  if (filterBar) {
    var items = document.querySelectorAll("[data-cat]");
    var counter = document.querySelector("[data-count]");

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;

      var key = btn.getAttribute("data-filter");
      var buttons = filterBar.querySelectorAll("button[data-filter]");

      for (var b = 0; b < buttons.length; b++) {
        buttons[b].setAttribute("aria-pressed", buttons[b] === btn ? "true" : "false");
      }

      var shown = 0;

      for (var k = 0; k < items.length; k++) {
        var hit = key === "all" || items[k].getAttribute("data-cat") === key;
        items[k].hidden = !hit;

        if (hit) {
          if (!reduceMotion) {
            items[k].classList.remove("row-in");
            void items[k].offsetWidth;
            items[k].classList.add("row-in");
          }
          shown++;
        }
      }

      if (counter) counter.textContent = String(shown);
    });
  }

  /* ---------- 复制到剪贴板 ---------- */
  var toast = document.querySelector("[data-toast]");
  var toastTimer = null;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-on");
    }, 1700);
  }

  function legacyCopy(text) {
    try {
      var holder = document.createElement("textarea");
      holder.value = text;
      holder.setAttribute("readonly", "");
      holder.style.position = "fixed";
      holder.style.top = "-200px";
      holder.style.opacity = "0";
      document.body.appendChild(holder);
      holder.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(holder);
      return ok;
    } catch (err) {
      return false;
    }
  }

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        done(true);
      }, function () {
        done(legacyCopy(text));
      });
    } else {
      done(legacyCopy(text));
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;

    var text = btn.getAttribute("data-copy");
    copyText(text, function (ok) {
      showToast(ok ? "已复制：" + text : "复制失败，请手动选中后复制");
    });
  });

  /* ---------- 联系表单 -> mailto ---------- */
  var form = document.querySelector("[data-contact-form]");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (form.elements["name"].value || "").trim();
      var back = (form.elements["back"].value || "").trim();
      var msg = (form.elements["msg"].value || "").trim();

      var subject = "来自个人主页的合作咨询" + (name ? "（" + name + "）" : "");
      var body =
        "称呼：" + (name || "—") +
        "\n联系方式：" + (back || "—") +
        "\n\n" + msg;

      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();
