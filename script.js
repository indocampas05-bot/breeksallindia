
/* =========================================================
   SCHOOL SETTINGS
   ========================================================= */
const CONFIG = {
  whatsapp: "",
  hours: "",
  formEndpoint: "",
  social: {
    facebook: "",
    instagram: "",
    youtube: ""
  }
};

/* =========================================================
   GALLERY SETTINGS
   ========================================================= */
const CATEGORIES = {
  annual: "Annual Day",
  awards: "Awards & Guests",
  sports: "Sports Activities",
  performances: "Performances"
};

const gallery = [
  { n: "g01", cat: "awards", title: "Champions with the trophy" },
  { n: "g06", cat: "awards", title: "Certificates and medals for young winners" },
  { n: "g07", cat: "awards", title: "Prize distribution by guests of honour" },
  { n: "g17", cat: "awards", title: "Guests of honour with the trophies" },
  { n: "g18", cat: "awards", title: "Guests of honour at the sports meet" },
  { n: "g16", cat: "annual", title: "Torch lighting ceremony" },
  { n: "g11", cat: "annual", title: "Kindergarten march past" },
  { n: "g12", cat: "annual", title: "March past in red" },
  { n: "g13", cat: "annual", title: "Yamuna team march past" },
  { n: "g14", cat: "annual", title: "March past in green" },
  { n: "g15", cat: "annual", title: "Teams on the athletics track" },
  { n: "g03", cat: "sports", title: "Sack race" },
  { n: "g08", cat: "sports", title: "Ball collection race for little ones" },
  { n: "g09", cat: "sports", title: "Musical chairs" },
  { n: "g10", cat: "sports", title: "Ready at the starting line" },
  { n: "g02", cat: "performances", title: "The school band in performance" },
  { n: "g04", cat: "performances", title: "Ribbon stick display" },
  { n: "g05", cat: "performances", title: "Martial arts demonstration" }
];

const thumb = g => `assets/images/gallery/thumb/${g.n}.jpg`;
const full = g => `assets/images/gallery/full/${g.n}.jpg`;

/* =========================================================
   NAVBAR – SCROLL STATE, ACTIVE LINK, PROGRESS BAR
   ========================================================= */
const nav = document.getElementById("mainNav");
const hdr = document.getElementById("siteHeader");

const links = [...document.querySelectorAll(".navbar .nav-link")];
const secs = links.map(l => document.querySelector(l.getAttribute("href")));

const bar = document.getElementById("progress");
const toTop = document.getElementById("toTop");

function onScroll() {
  if (nav) nav.classList.toggle("scrolled", scrollY > 30);
  if (hdr) hdr.classList.toggle("scrolled", scrollY > 30);

  const max = document.documentElement.scrollHeight - innerHeight;

  if (bar) {
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
  }

  if (toTop) {
    toTop.classList.toggle("show", scrollY > 600);
  }

  const y = scrollY + 140;
  let cur = 0;

  secs.forEach((s, i) => {
    if (s && s.offsetTop <= y) cur = i;
  });

  links.forEach((l, i) => {
    l.classList.toggle("active", i === cur);
  });
}

addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (toTop) {
  toTop.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.querySelectorAll("#navMenu a").forEach(a => {
  a.addEventListener("click", () => {
    const menu = document.getElementById("navMenu");
    const c = menu && bootstrap.Collapse.getInstance(menu);
    if (c) c.hide();
  });
});

/* =========================================================
   SCROLL REVEAL WITH STAGGER
   ========================================================= */
document.querySelectorAll(".stagger").forEach(group => {
  group.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--d", (i % 4) * 0.1 + "s");
  });
});

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: "0px 0px -40px 0px"
});

document.querySelectorAll(".reveal").forEach(el => {
  io.observe(el);
});

/* =========================================================
   GET IN TOUCH BUTTONS
   ========================================================= */
document.querySelectorAll('a[href="#contactForm"]').forEach(a => {
  a.addEventListener("click", () => {
    setTimeout(() => {
      const parent = document.getElementById("parent");
      if (parent) parent.focus({ preventScroll: true });
    }, 700);
  });
});

/* =========================================================
   GALLERY
   ========================================================= */
const filtersEl = document.getElementById("galleryFilters");
const grid = document.getElementById("galleryGrid");

let visible = [];
let idx = 0;
let activeFilter = "all";

function buildFilters() {
  if (!filtersEl) return;

  const count = c =>
    c === "all"
      ? gallery.length
      : gallery.filter(g => g.cat === c).length;

  filtersEl.innerHTML = [
    ["all", "All Photos"],
    ...Object.entries(CATEGORIES)
  ].map(([k, v]) => `
    <button role="tab"
      data-filter="${k}"
      class="${k === activeFilter ? "active" : ""}">
      ${v}
      <small>${count(k)}</small>
    </button>
  `).join("");
}

function render(filter = "all") {
  if (!grid || !filtersEl) return;

  activeFilter = filter;
  visible = gallery.filter(g =>
    filter === "all" || g.cat === filter
  );

  grid.innerHTML = "";

  visible.forEach((g, i) => {
    const el = document.createElement("div");

    el.className = "g-item";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Open photo: " + g.title);

    el.style.animationDelay = (i * 0.04) + "s";

    el.innerHTML = `
      <img src="${thumb(g)}"
        alt="${g.title}"
        loading="lazy"
        decoding="async">

      <div class="g-over">
        <i class="bi bi-arrows-fullscreen"></i>
        <small>${CATEGORIES[g.cat]}</small>
        <strong>${g.title}</strong>
      </div>
    `;

    el.addEventListener("click", () => openLb(i));

    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLb(i);
      }
    });

    grid.appendChild(el);
  });

  filtersEl.querySelectorAll("button").forEach(b => {
    b.classList.toggle(
      "active",
      b.dataset.filter === filter
    );
  });
}

if (filtersEl) {
  filtersEl.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (b) render(b.dataset.filter);
  });

  buildFilters();
  render();
}

/* Gallery category shortcuts */
document.querySelectorAll("[data-goto]").forEach(a => {
  a.addEventListener("click", () => {
    render(a.dataset.goto);
  });
});

/* =========================================================
   LIGHTBOX – KEYBOARD + SWIPE
   ========================================================= */
const lbEl = document.getElementById("lightbox");
const lbBody = document.getElementById("lbBody");
const lbCount = document.getElementById("lbCount");

const lb = lbEl && window.bootstrap
  ? new bootstrap.Modal(lbEl)
  : null;

function showLb() {
  if (!lbBody || !visible.length) return;

  const g = visible[idx];

  lbBody.style.animation = "none";
  void lbBody.offsetWidth;
  lbBody.style.animation = "";

  lbBody.innerHTML = `
    <img src="${full(g)}" alt="${g.title}">
    <figcaption>
      <small>${CATEGORIES[g.cat]}</small>
      <strong>${g.title}</strong>
    </figcaption>
  `;

  if (lbCount) {
    lbCount.textContent = `${idx + 1} / ${visible.length}`;
  }
}

function openLb(i) {
  if (!lb || !visible.length) return;

  idx = i;
  showLb();
  lb.show();
}

const step = d => {
  if (!visible.length) return;

  idx = (idx + d + visible.length) % visible.length;
  showLb();
};

const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

if (lbPrev) lbPrev.onclick = () => step(-1);
if (lbNext) lbNext.onclick = () => step(1);

if (lbEl) {
  lbEl.addEventListener("hidden.bs.modal", () => {
    if (lbBody) lbBody.innerHTML = "";
  });

  addEventListener("keydown", e => {
    if (lbEl.classList.contains("show")) {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    }
  });

  let tx = 0;

  lbEl.addEventListener("touchstart", e => {
    tx = e.changedTouches[0].clientX;
  }, { passive: true });

  lbEl.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - tx;

    if (Math.abs(dx) > 50) {
      step(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}

/* =========================================================
   CONTACT DETAILS
   ========================================================= */
const show = el => {
  if (el) el.classList.remove("d-none");
};

if (CONFIG.hours) {
  const hoursTxt = document.getElementById("hoursTxt");

  if (hoursTxt) {
    hoursTxt.textContent = CONFIG.hours;
    show(document.querySelector('[data-c="hours"]'));
  }
}

if (CONFIG.whatsapp) {
  const url =
    `https://wa.me/${CONFIG.whatsapp}?text=` +
    encodeURIComponent(
      "Hello, I would like to know more about Breeks All India Secondary School."
    );

  ["waFloat", "waBtn"].forEach(id => {
    const a = document.getElementById(id);

    if (a) {
      a.href = url;
      show(a);
    }
  });
}

const icons = {
  facebook: "bi-facebook",
  instagram: "bi-instagram",
  youtube: "bi-youtube"
};

const socials = Object.entries(CONFIG.social).filter(([, u]) => u);

if (socials.length) {
  const socialLinks = document.getElementById("socialLinks");

  if (socialLinks) {
    socialLinks.innerHTML = socials.map(([k, u]) => `
      <a href="${u}"
        target="_blank"
        rel="noopener"
        aria-label="${k}">
        <i class="bi ${icons[k]}"></i>
      </a>
    `).join("");

    show(document.getElementById("socialCol"));
  }
}

/* =========================================================
   CONTACT FORM
   ========================================================= */
const form = document.getElementById("contactForm");
const phone = document.getElementById("phone");
const email = document.getElementById("email");

function validate() {
  if (!form) return false;

  let ok = true;

  form.querySelectorAll("[required]").forEach(f => {
    let valid = f.value.trim() !== "";

    if (f === phone) {
      valid = /^(\+91[\s-]?)?[6-9]\d{9}$/.test(
        f.value.replace(/\s/g, "")
      );
    }

    if (f === email) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
        f.value.trim()
      );
    }

    if (f.minLength > 0 && f.value.trim().length < f.minLength) {
      valid = false;
    }

    f.classList.toggle("is-invalid", !valid);
    f.classList.toggle("is-valid", valid);

    if (!valid) ok = false;
  });

  return ok;
}

if (form) {
  form.addEventListener("input", e => {
    if (e.target.classList.contains("is-invalid")) {
      validate();
    }
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const box = document.getElementById("formAlert");

    if (box) {
      box.className = "alert mt-4 d-none";
    }

    if (!validate()) {
      const invalid = form.querySelector(".is-invalid");
      if (invalid) invalid.focus();
      return;
    }

    const btn = document.getElementById("submitBtn");

    if (!btn) return;

    const sp = btn.querySelector(".spinner-border");
    const lbl = btn.querySelector(".btn-label");

    btn.disabled = true;

    if (sp) sp.classList.remove("d-none");
    if (lbl) lbl.textContent = "Submitting...";

    const student = form.querySelector('[name="student"]');
    const parent = form.querySelector('[name="parent"]');
    const cls = form.querySelector('[name="subject"]');
    const msg = form.querySelector('[name="message"]');

    const data = {
      student: student ? student.value : "",
      parent: parent ? parent.value : "",
      phone: phone ? phone.value : "",
      email: email ? email.value : "",
      subject: cls ? cls.value : "",
      message: msg ? msg.value : ""
    };

    const done = (cls_, text) => {
      if (box) {
        box.className = "alert mt-4 " + cls_;
        box.textContent = text;
      }

      btn.disabled = false;

      if (sp) sp.classList.add("d-none");
      if (lbl) lbl.textContent = "Send Message";
    };

    const reset = () => {
      form.reset();

      form.querySelectorAll(".is-valid").forEach(f => {
        f.classList.remove("is-valid");
      });
    };

    if (CONFIG.formEndpoint) {
      try {
        const r = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data)
        });

        if (!r.ok) throw new Error();

        done(
          "alert-success",
          "Thank you! Your message has been sent. The school will get back to you soon."
        );

        reset();

      } catch {
        done(
          "alert-danger",
          "Sorry, we could not send your message. Please try again or contact the school directly."
        );
      }

    } else {
      setTimeout(() => {
        done(
          "alert-info",
          "Demo mode: your details are valid, but no form service is connected yet, so this message has not been sent to the school."
        );

        reset();
      }, 1000);
    }
  });
}

/* =========================================================
   FACULTY / OUR TEACHING TEAM
   AUTOMATIC SLIDER – EVERY 5 SECONDS
   ========================================================= */
(function () {

  const t = document.getElementById("tTrack");

  if (!t) return;

  const prev = document.getElementById("tPrev");
  const next = document.getElementById("tNext");
  const prog = document.getElementById("tProg");

  const AUTO_SLIDE_INTERVAL = 2000;

  let autoSlide = null;
  let down = false;
  let sx = 0;
  let sl = 0;

  /* Calculate one card width */
  const step = () => {
    const card = t.querySelector(".tcard");

    if (!card) return 300;

    const gap = parseFloat(
      getComputedStyle(t).gap
    ) || 18;

    return card.offsetWidth + gap;
  };

  /* Update arrows and progress */
  function upd() {
    const max = t.scrollWidth - t.clientWidth;

    if (prev) {
      prev.disabled = t.scrollLeft <= 2;
    }

    if (next) {
      next.disabled = max <= 2;
    }

    if (prog) {
      const w = Math.max(
        12,
        t.clientWidth / t.scrollWidth * 100
      );

      prog.style.width = w + "%";

      prog.style.marginLeft =
        (max > 0
          ? t.scrollLeft / max * (100 - w)
          : 0) + "%";
    }
  }

  /* Move to next teaching card */
  function moveNext() {
    const max = t.scrollWidth - t.clientWidth;

    if (max <= 2) return;

    if (t.scrollLeft >= max - 2) {

      // Last card → First card
      t.scrollTo({
        left: 0,
        behavior: "smooth"
      });

    } else {

      // Move to next card
      t.scrollBy({
        left: step(),
        behavior: "smooth"
      });

    }
  }

  /* Move to previous card */
  function movePrev() {
    const current = t.scrollLeft;

    if (current <= 2) {
      t.scrollTo({
        left: t.scrollWidth,
        behavior: "smooth"
      });
    } else {
      t.scrollBy({
        left: -step(),
        behavior: "smooth"
      });
    }
  }

  /* Stop automatic sliding */
  function stopAutoSlide() {
    if (autoSlide) {
      clearInterval(autoSlide);
      autoSlide = null;
    }
  }

  /* Start automatic sliding */
  function startAutoSlide() {
    stopAutoSlide();

    autoSlide = setInterval(() => {
      moveNext();
    }, AUTO_SLIDE_INTERVAL);
  }

  /* Previous button */
  if (prev) {
    prev.addEventListener("click", () => {
      movePrev();
      startAutoSlide();
    });
  }

  /* Next button */
  if (next) {
    next.addEventListener("click", () => {
      moveNext();
      startAutoSlide();
    });
  }

  /* Update progress while scrolling */
  t.addEventListener("scroll", upd, {
    passive: true
  });

  window.addEventListener("resize", upd);

  /* Pause when mouse enters */
  t.addEventListener("mouseenter", () => {
    stopAutoSlide();
  });

  /* Resume when mouse leaves */
  t.addEventListener("mouseleave", () => {
    if (!down) startAutoSlide();
  });

  /* Pause during mobile touch */
  t.addEventListener("touchstart", () => {
    stopAutoSlide();
  }, { passive: true });

  t.addEventListener("touchend", () => {
    startAutoSlide();
  }, { passive: true });

  /* Mouse drag */
  t.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse") return;

    down = true;
    sx = e.clientX;
    sl = t.scrollLeft;

    stopAutoSlide();
    t.classList.add("dragging");
  });

  window.addEventListener("pointermove", e => {
    if (!down) return;

    const dx = e.clientX - sx;

    t.scrollLeft = sl - dx;
  });

  window.addEventListener("pointerup", () => {
    if (!down) return;

    down = false;
    t.classList.remove("dragging");

    startAutoSlide();
  });

  /* Initialize */
  upd();
  startAutoSlide();

})();
