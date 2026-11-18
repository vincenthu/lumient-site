"use strict";

document.documentElement.classList.add("enhanced");

const nav = document.querySelector("#primary-nav");
const navToggle = document.querySelector(".nav-toggle");
const solutions = nav.querySelector("details");
function closeNav() {
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  solutions.open = false;
}
navToggle.addEventListener("click", () => {
  if (nav.classList.contains("open")) closeNav();
  else {
    nav.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
  }
});
document.addEventListener("click", event => {
  if (!event.target.closest(".nav")) closeNav();
  if (!event.target.closest("details")) solutions.open = false;
});
nav.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link) return;
  closeNav();
  const target = document.querySelector(link.hash);
  target.tabIndex = -1;
  target.focus({preventScroll: true});
});
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (solutions.open) {
    solutions.open = false;
    solutions.querySelector("summary").focus();
  } else if (nav.classList.contains("open")) {
    closeNav();
    navToggle.focus();
  }
});
nav.addEventListener("focusout", event => {
  if (!nav.contains(event.relatedTarget) && event.relatedTarget !== navToggle) closeNav();
});
matchMedia("(max-width: 680px)").addEventListener("change", closeNav);

const desktop = matchMedia("(min-width: 801px)");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const film = document.querySelector(".hero-film");
const motionButton = document.querySelector(".motion-switch");
const groups = Array.from(document.querySelectorAll(".workflow-group"), section => ({
  section,
  stage: section.querySelector(".media-stage"),
  steps: Array.from(section.querySelectorAll(".workflow-step"), step => ({
    step,
    link: step.querySelector("h4 a"),
    slot: step.querySelector(".clip-slot"),
    video: step.querySelector("video")
  }))
}));
let userPaused = false;
let frame = 0;

// Move the same players between their inline slots and sticky stage on resize.
function arrangeClips() {
  for (const group of groups) {
    for (const {slot, video, link, step} of group.steps) {
      // A desktop heading selects a clip. On mobile its clip is already inline.
      if (desktop.matches) link.href = "#" + step.id;
      else {
        link.removeAttribute("href");
        video.removeAttribute("aria-hidden");
      }
      (desktop.matches ? group.stage : slot).append(video);
      delete video.dataset.playing;
    }
  }
  scheduleMediaUpdate();
}

function playback(video, visible) {
  const playing = visible && !reduced.matches && !userPaused && !document.hidden;
  if (video.dataset.playing === String(playing)) return;
  video.dataset.playing = String(playing);
  if (!playing) {
    video.pause();
    return;
  }
  if (!video.hasAttribute("src")) video.src = video.dataset.src;
  video.play().catch(() => {});
}
function inViewport(bounds) {
  return bounds.bottom > 0 && bounds.top < window.innerHeight;
}
let filmInView = false;
let filmPausedByUser = false;
film.addEventListener("pause", () => {
  if (filmInView && !reduced.matches && film.paused) filmPausedByUser = true;
});
film.addEventListener("play", () => { filmPausedByUser = false; });

function updateFilm() {
  const visible = !document.hidden && inViewport(film.getBoundingClientRect());
  if (visible === filmInView) return;
  filmInView = visible;
  if (!visible) {
    film.pause();
    return;
  }
  if (!film.hasAttribute("src")) film.src = film.dataset.src;
  if (!reduced.matches && !filmPausedByUser) film.play().catch(() => {});
}

function updateMedia() {
  frame = 0;
  updateFilm();
  for (const group of groups) {
    const area = group.section.getBoundingClientRect();
    const visible = inViewport(area);
    if (!desktop.matches) {
      for (const {slot, video, link} of group.steps) {
        link.removeAttribute("aria-current");
        playback(video, visible && inViewport(slot.getBoundingClientRect()));
      }
      continue;
    }
    const middle = window.innerHeight / 2;
    let active = group.steps[0];
    if (area.bottom <= 0) active = group.steps[group.steps.length - 1];
    else if (visible) {
      let nearest = Infinity;
      for (const item of group.steps) {
        const bounds = item.step.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height / 2 - middle);
        if (distance < nearest) {
          active = item;
          nearest = distance;
        }
      }
    }
    const stageVisible = visible && inViewport(group.stage.getBoundingClientRect());
    for (const item of group.steps) {
      const selected = item === active;
      item.step.classList.toggle("active", selected);
      item.video.classList.toggle("show", selected);
      item.video.setAttribute("aria-hidden", String(!selected));
      if (selected) item.link.setAttribute("aria-current", "step");
      else item.link.removeAttribute("aria-current");
      playback(item.video, selected && stageVisible);
    }
  }
}
function scheduleMediaUpdate() {
  if (!frame) frame = requestAnimationFrame(updateMedia);
}
function syncMotion() {
  // Reset the native video element so a newly requested reduced-motion view
  // displays the meaningful poster even if the video had already started.
  if (reduced.matches) {
    for (const video of document.querySelectorAll("video[data-playing][src]")) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  }
  motionButton.hidden = reduced.matches;
  motionButton.textContent = userPaused ? "Play animations" : "Pause animations";
  updateMedia();
}
motionButton.addEventListener("click", () => {
  userPaused = !userPaused;
  syncMotion();
});
window.addEventListener("scroll", scheduleMediaUpdate, {passive: true});
window.addEventListener("resize", scheduleMediaUpdate);
desktop.addEventListener("change", arrangeClips);
reduced.addEventListener("change", () => {
  filmInView = false;
  if (reduced.matches && film.hasAttribute("src")) film.load();
  syncMotion();
});
document.addEventListener("visibilitychange", updateMedia);
document.fonts.ready.then(scheduleMediaUpdate);
arrangeClips();
syncMotion();

if (new URLSearchParams(location.search).get("sent") === "1") {
  document.getElementById("df-sent").hidden = false;
}
