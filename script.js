/* ============================================================
   EDIT HERE — everything you will want to change lives in CONFIG.
   To swap an image: drop a new file in /images and change its path.
   ============================================================ */
const CONFIG = {
  phone: "+977 9864806103",
  whatsapp: "9779864806103",            // digits only, with country code
  address: "Aryal Dairy Juice & Coffee House, Ghorahi, Dang",
  hours: "Open Daily 6:00 AM – 8:00 PM",
  mapLink: "https://maps.app.goo.gl/LQUyQ37Yrz4xbnKy9",
  
  waMessage: "Hello Aryal Dairy! I would like to order:",

  images: {                              // single images used around the page
    hero: "images/hero2.jpeg",
    shop: "images/shop.png"
  },

  products: [                            // used for BOTH the category tiles and featured cards
    { name: "Milk",        tag: "Pure & Fresh",      price: "Rs. 100 / Ltr",  img: "images/milk.png" },
    { name: "Curd",        tag: "Creamy & Healthy",  price: "Rs. 140 / kg",   img: "images/curd.png" },
    { name: "Paneer",      tag: "Fresh & Soft",      price: "Rs. 900 / Kg",   img: "images/paneer.png" },
    { name: "Lassi",       tag: "Cool & Refreshing", price: "Rs. 80 / Glass", img: "images/lassi.png" },
    { name: "Ice Cream",   tag: "Sweet & Creamy",    price: "Rs. 25 / Scoop", img: "images/icecream.png" },
    { name: "Sugarcane Juice", tag: "Natural & Fresh", price: "Rs. 50 / Glass", img: "images/sugarcane.png" },
    { name: "Cake",      tag: "Rich & Aromatic",   price: "",               img: "images/cake.png", categoryOnly: true }
  ],

  reviews: [                             // photo is optional — initials show if missing
    { name: "Sushma Thapa",  stars: 5, photo: "", text: "Best milk and curd in town! Always fresh and the taste is amazing." },
    { name: "Ramesh Pandey", stars: 5, photo: "", text: "Their ice cream is my favorite. Great quality and very reasonable price." },
    { name: "Pratima Gurung", stars: 5, photo: "", text: "Clean, fresh and friendly service. Highly recommended!" }
  ]
};

/* ---------------- build the page from CONFIG ---------------- */
const $ = (s, el = document) => el.querySelector(s);
const waLink = (extra = "") =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(extra ? `${CONFIG.waMessage} ${extra}` : "Hello Aryal Dairy!")}`;

// single images
document.querySelectorAll("[data-img]").forEach(el => {
  const src = CONFIG.images[el.dataset.img];
  if (el.tagName === "IMG") el.src = src; else el.style.backgroundImage = `url('${src}')`;
});

// contact info + links
document.querySelectorAll("[data-wa]").forEach(a => a.href = waLink());
document.querySelectorAll("[data-map]").forEach(a => a.href = CONFIG.mapLink);
$("[data-phone]").textContent = CONFIG.phone;
$("[data-address]").textContent = CONFIG.address;
$("[data-hours]").textContent = CONFIG.hours;
$("#yr").textContent = new Date().getFullYear();

// category tiles
$("#cats").innerHTML = CONFIG.products.map(p => `
  <a href="#products" class="cat reveal">
    <div class="im"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
    <div class="t"><b>${p.name}</b>${p.tag}</div>
  </a>`).join("");

// featured cards
$("#productGrid").innerHTML = CONFIG.products.filter(p => !p.categoryOnly).map(p => `
  <article class="card reveal">
    <div class="im"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
    <div class="bd">
      <h3>${p.name}</h3><small>${p.tag}</small>
      <div class="row"><span>${p.price}</span>
        <a class="add" href="${waLink(p.name)}" target="_blank" rel="noopener" aria-label="Order ${p.name} on WhatsApp">🛒</a>
      </div>
    </div>
  </article>`).join("");

// reviews
const initials = n => n.split(" ").map(w => w[0]).join("").slice(0, 2);
$("#rvTrack").innerHTML = CONFIG.reviews.map(r => `
  <div class="rv">
    ${r.photo ? `<img src="${r.photo}" alt="${r.name}">` : `<span class="av">${initials(r.name)}</span>`}
    <div><b>${r.name}</b><span class="stars">${"★".repeat(r.stars)}</span><p>“${r.text}”</p></div>
  </div>`).join("");

/* ---------------- interactions ---------------- */
// mobile menu
const burger = $("#burger"), menu = $("#menu");
const setMenu = open => { menu.classList.toggle("open", open); burger.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); };
burger.onclick = () => setMenu(!menu.classList.contains("open"));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

// nav shadow + active link
const nav = $("#nav"), links = [...menu.querySelectorAll("a[href^='#']:not(.btn)")];
const sections = ["home", "story", "products", "gallery", "contact"].map(id => document.getElementById(id));
addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", scrollY > 10);
  const y = scrollY + 140;
  const cur = sections.filter(s => s.offsetTop <= y).pop();
  links.forEach(l => l.classList.toggle("active", cur && l.getAttribute("href") === "#" + cur.id && l.textContent !== "Our Story"));
}, { passive: true });

// scroll reveal (staggered inside grids)
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 7) * 70 + "ms";
  io.observe(el);
});

// review slider
const track = $("#rvTrack"), dots = $("#dots");
const perView = () => innerWidth <= 640 ? 1 : innerWidth <= 1000 ? 2 : 3;
const pages = () => Math.max(1, CONFIG.reviews.length - perView() + 1);
let page = 0;
function renderDots() { dots.innerHTML = Array.from({ length: pages() }, (_, i) => `<i class="${i === page ? "on" : ""}"></i>`).join(""); [...dots.children].forEach((d, i) => d.onclick = () => go(i)); }
function go(i) {
  page = (i + pages()) % pages();
  const card = track.children[0];
  track.scrollTo({ left: page * (card.offsetWidth + 19), behavior: "smooth" });
  renderDots();
}
$("#prev").onclick = () => go(page - 1);
$("#next").onclick = () => go(page + 1);
track.addEventListener("scroll", () => {
  const card = track.children[0];
  const p = Math.round(track.scrollLeft / (card.offsetWidth + 19));
  if (p !== page && p < pages()) { page = p; renderDots(); }
}, { passive: true });
addEventListener("resize", renderDots);
renderDots();
setInterval(() => go(page + 1), 6000);
