"use strict";

document.documentElement.classList.add("enhanced");

const nav = document.querySelector("#primary-nav");
const navBar = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");

function setMenu(open) {
  nav.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}
navToggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
document.addEventListener("click", event => {
  if (event.target.closest("a") || !navBar.contains(event.target)) setMenu(false);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    setMenu(false);
    navToggle.focus();
  }
});
navBar.addEventListener("focusout", event => {
  if (!navBar.contains(event.relatedTarget)) setMenu(false);
});
matchMedia("(max-width: 680px)").addEventListener("change", () => setMenu(false));

const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const film = document.querySelector(".hero-film");
let filmInView = false;
let filmPausedByUser = false;
film.addEventListener("pause", () => {
  if (filmInView && !reduced.matches && film.paused) filmPausedByUser = true;
});
film.addEventListener("play", () => { filmPausedByUser = false; });

function updateFilm() {
  const bounds = film.getBoundingClientRect();
  const visible = !document.hidden && bounds.bottom > 0 && bounds.top < window.innerHeight;
  if (visible === filmInView) return;
  filmInView = visible;
  if (!visible) {
    film.pause();
    return;
  }
  if (!film.hasAttribute("src")) film.src = film.dataset.src;
  if (!reduced.matches && !filmPausedByUser) film.play().catch(() => {});
}
new IntersectionObserver(updateFilm).observe(film);
reduced.addEventListener("change", () => {
  filmInView = false;
  if (reduced.matches && film.hasAttribute("src")) film.load();
  updateFilm();
});
document.addEventListener("visibilitychange", updateFilm);

if (new URLSearchParams(location.search).get("sent") === "1") {
  document.getElementById("df-sent").hidden = false;
}
