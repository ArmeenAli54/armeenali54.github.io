/* ============================================================
   Armeen Ali Soomro — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    try {
      localStorage.setItem("aa-theme", theme);
    } catch (e) {}
  }

  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem("aa-theme");
  } catch (e) {}

  var initialTheme = savedTheme || "dark";
  applyTheme(initialTheme);

  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
  });

  /* ---------- Header scroll state + progress ---------- */
  var header = document.getElementById("siteHeader");
  var progress = document.getElementById("scrollProgress");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 10);

    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (y / max) * 100 : 0;
    progress.style.setProperty("--p", pct + "%");
    progress.style.width = pct + "%";

    backToTop.classList.toggle("is-visible", y > 600);
  }
  onScroll();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var mobileClose = document.getElementById("mobileClose");

  function openMenu() {
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", openMenu);
  mobileClose.addEventListener("click", closeMenu);

  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav__link");

  var spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + id
            );
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach(function (s) {
    spy.observe(s);
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  function revealNow(el, delay) {
    setTimeout(function () {
      el.classList.add("is-visible");
    }, delay || 0);
  }

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight - 40 && r.bottom > 0;
  }

  if (prefersReduced) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealNow(entry.target, (entry.target.dataset.delay || 0) * 90);
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      revealObs.observe(el);
    });

    // Fallback: anything already inside the viewport on load reveals immediately.
    setTimeout(function () {
      revealEls.forEach(function (el) {
        if (!el.classList.contains("is-visible") && inViewport(el)) {
          revealNow(el, el.dataset.delay || 0);
        }
      });
    }, 250);
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".count");

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    if (prefersReduced) {
      el.textContent = target;
      return;
    }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counterObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(function (c) {
    counterObs.observe(c);
  });

  /* ---------- Typing effect in hero ---------- */
  var typedEl = document.getElementById("typedText");
  var phrases = [
    "Java & desktop applications.",
    "modern, responsive web experiences.",
    "interactive 3D & data visualizations.",
    "Generative AI & prompt engineering.",
    "software, one line at a time.",
  ];
  var pi = 0;
  var ci = 0;
  var deleting = false;

  function typeLoop() {
    var phrase = phrases[pi];
    if (!deleting) {
      ci++;
      typedEl.textContent = phrase.slice(0, ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(typeLoop, 2200);
        return;
      }
      setTimeout(typeLoop, 55);
    } else {
      ci--;
      typedEl.textContent = phrase.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(typeLoop, 350);
        return;
      }
      setTimeout(typeLoop, 28);
    }
  }

  if (!prefersReduced) {
    setTimeout(typeLoop, 900);
  } else {
    typedEl.textContent = phrases[0];
  }

  /* ---------- Back to top ---------- */
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth scroll for same-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.pageYOffset - 66;
      window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  /* ---------- Modals (certificate lightbox + resume viewer) ---------- */
  var certModal = document.getElementById("certModal");
  var certModalImg = document.getElementById("certModalImg");
  var certModalDownload = document.getElementById("certModalDownload");
  var resumeModal = document.getElementById("resumeModal");
  var resumeFrame = document.getElementById("resumeFrame");
  var resumeUrl = resumeFrame ? resumeFrame.getAttribute("src") : "";

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (modal === certModal && certModalImg) certModalImg.src = "";
    if (modal === resumeModal && resumeFrame) resumeFrame.src = "about:blank";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-modal-close]").forEach(function (el) {
    el.addEventListener("click", function () {
      closeModal(el.closest(".modal"));
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal(certModal);
      closeModal(resumeModal);
    }
  });

  certModal.addEventListener("click", function (e) {
    if (e.target === certModal) closeModal(certModal);
  });
  resumeModal.addEventListener("click", function (e) {
    if (e.target === resumeModal) closeModal(resumeModal);
  });

  document.querySelectorAll(".cert").forEach(function (card) {
    var img = card.querySelector(".cert__img");
    if (!img) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cert__view";
    btn.setAttribute("aria-label", "View certificate");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> View';
    card.appendChild(btn);

    function openCertLightbox() {
      certModalImg.src = img.getAttribute("src");
      certModalImg.alt = img.getAttribute("alt") || "Certificate";
      certModalDownload.href = img.getAttribute("src");
      certModalDownload.setAttribute("download", "");
      openModal(certModal);
    }

    btn.addEventListener("click", openCertLightbox);
    img.addEventListener("click", openCertLightbox);
    img.style.cursor = "zoom-in";
  });

  document.querySelectorAll("[data-resume-view]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (resumeFrame) resumeFrame.src = resumeUrl;
      openModal(resumeModal);
    });
  });

  /* ---------- Contact form (AJAX via FormSubmit) ---------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("formStatus");
      var submitBtn = contactForm.querySelector(".message__submit");

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      status.textContent = "Sending...";
      status.className = "message__status";

      var formData = new FormData(contactForm);
      formData.append("_ajax", "true");

      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            status.textContent = "Message sent! Thanks for reaching out — I'll get back to you soon.";
            status.classList.add("is-success");
            contactForm.reset();
          } else {
            status.textContent = "Something went wrong. Please try again or email me directly.";
            status.classList.add("is-error");
          }
        })
        .catch(function () {
          status.textContent = "Something went wrong. Please try again or email me directly.";
          status.classList.add("is-error");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  /* ---------- Intro splash: animated name ---------- */
  var intro = document.getElementById("intro");
  if (intro) {
    var introName = document.getElementById("introName");
    var introStr = (introName && introName.getAttribute("data-name")) || "Armeen Ali";
    var letterCount = 0;
    introStr.split("").forEach(function (ch) {
      var span = document.createElement("span");
      span.className = "intro__letter" + (ch === " " ? " intro__space" : "");
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.animationDelay = (0.15 + letterCount * 0.055).toFixed(3) + "s";
      letterCount++;
      if (introName) introName.appendChild(span);
    });

    function dismissIntro() {
      if (intro.classList.contains("is-done")) return;
      intro.classList.add("is-done");
      intro.setAttribute("aria-hidden", "true");
      setTimeout(function () {
        if (intro.parentNode) intro.parentNode.removeChild(intro);
      }, 700);
    }

    var introEnter = document.getElementById("introEnter");
    if (introEnter) introEnter.addEventListener("click", dismissIntro);
    intro.addEventListener("click", function (e) {
      if (e.target === intro) dismissIntro();
    });
    intro.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") dismissIntro();
    });

    if (prefersReduced) {
      dismissIntro();
    } else {
      setTimeout(dismissIntro, 2350 + letterCount * 30);
    }
  }

  /* ---------- Subtle starfield background (canvas) ---------- */
  var galaxy = document.getElementById("galaxy");
  if (galaxy && galaxy.getContext) {
    var ctx = galaxy.getContext("2d");
    var gRunning = false;
    var gRaf = null;
    var gStars = [];
    var gTime = 0;
    var gW = 0;
    var gH = 0;
    var gDpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function buildGalaxy() {
      gW = window.innerWidth;
      gH = window.innerHeight;
      galaxy.width = Math.floor(gW * gDpr);
      galaxy.height = Math.floor(gH * gDpr);
      galaxy.style.width = gW + "px";
      galaxy.style.height = gH + "px";
      ctx.setTransform(gDpr, 0, 0, gDpr, 0, 0);

      var count = Math.min(Math.floor((gW * gH) / 6000), 220);
      gStars = [];
      for (var i = 0; i < count; i++) {
        gStars.push({
          x: Math.random() * gW,
          y: Math.random() * gH,
          r: Math.random() * 1.1 + 0.3,
          base: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.15,
          alpha: Math.random() * 0.3 + 0.18,
        });
      }
    }

    function drawGalaxy(now) {
      ctx.clearRect(0, 0, gW, gH);
      var sec = now / 1000;
      for (var i = 0; i < gStars.length; i++) {
        var st = gStars[i];
        var tw = 0.6 + 0.4 * Math.sin(sec * st.speed + st.base);
        ctx.globalAlpha = st.alpha * tw;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = "#eef1f6";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function galaxyTick(now) {
      if (!gRunning) return;
      gTime = now;
      drawGalaxy(now);
      gRaf = requestAnimationFrame(galaxyTick);
    }

    function startGalaxy() {
      if (gRunning) return;
      gRunning = true;
      gRaf = requestAnimationFrame(galaxyTick);
    }
    function stopGalaxy() {
      gRunning = false;
      if (gRaf) cancelAnimationFrame(gRaf);
      gRaf = null;
    }

    buildGalaxy();

    if (prefersReduced) {
      drawGalaxy(0);
    } else {
      startGalaxy();
    }

    var galaxyResizeTimer = null;
    window.addEventListener("resize", function () {
      if (galaxyResizeTimer) clearTimeout(galaxyResizeTimer);
      galaxyResizeTimer = setTimeout(function () {
        buildGalaxy();
        if (prefersReduced) drawGalaxy(0);
      }, 200);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopGalaxy();
      } else if (!prefersReduced) {
        startGalaxy();
      }
    });

    var galaxyThemeWatch = new MutationObserver(function () {
      if (document.hidden || prefersReduced) return;
      var visible = window.getComputedStyle(galaxy).display !== "none";
      if (visible && !gRunning) startGalaxy();
      if (!visible && gRunning) stopGalaxy();
    });
    galaxyThemeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }
})();
