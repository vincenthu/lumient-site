"use strict";

const WORKSPACES = Object.freeze({
  "b361cdf5280fae86aa2c68bc0be49e0c7dd608d3f3baa1902bcc419b2c778faf": [
    "CJ4VCtC6MFcjEicG",
    "najs5upM9+cOVZlA2GQ6bHFEGU/3NTA2fubEephqdddvGPmwFxg2RbJeOu5XDpshPNV5O/yNy1A="
  ],
  "27fc9cb7711f96bfd856660362366c2c42f4aea64d4c7fcd4a7e0f713a9b7435": [
    "645LBNch2qobinDJ",
    "Svzvibu/k5poUyxqqERxxuvQz2KNiY/gv4zn1GhACTmRYNUn/PA79aPhrLNCLLEJN3X0so74IVQ="
  ]
});

const LOOKUP_DELAY_MS = 650;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const form = document.querySelector("#signin-form");
const emailInput = document.querySelector("#work-email");
const submitButton = document.querySelector("#signin-submit");
const status = document.querySelector("#signin-status");

function bytesToHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function decryptWorkspace(domain, route) {
  const keyBytes = await sha256(`lumient-workspace:${domain}`);
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(route[0]) },
    key,
    base64ToBytes(route[1])
  );
  return decoder.decode(plaintext);
}

async function findWorkspace(domain) {
  const lookupHash = bytesToHex(await sha256(domain));
  const route = WORKSPACES[lookupHash];

  if (!route) {
    await sha256(`lumient-not-found:${domain}`);
    return null;
  }

  return decryptWorkspace(domain, route);
}

function wait(milliseconds) {
  return new Promise(resolve => window.setTimeout(resolve, Math.max(0, milliseconds)));
}

function showLookingUp() {
  status.classList.remove("is-error");
  status.textContent = "Finding your workspace...";
  status.hidden = false;
}

function showUnknownDomain() {
  const demoLink = document.createElement("a");
  demoLink.href = "/#contact";
  demoLink.textContent = "request a demo";

  status.classList.add("is-error");
  status.replaceChildren(
    "We couldn't find a Lumient workspace for that email. If your company works with us, ask your admin for an invite, or ",
    demoLink,
    "."
  );
  status.hidden = false;
}

function showBrowserError() {
  const demoLink = document.createElement("a");
  demoLink.href = "/#contact";
  demoLink.textContent = "request a demo";

  status.classList.add("is-error");
  status.replaceChildren(
    "We couldn't look up your workspace in this browser. Try an up-to-date browser, or ",
    demoLink,
    "."
  );
  status.hidden = false;
}

function setSubmitting(submitting) {
  emailInput.readOnly = submitting;
  submitButton.disabled = submitting;
  submitButton.textContent = submitting ? "Continuing..." : "Continue";
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const email = emailInput.value.trim().toLowerCase();
  const domain = email.slice(email.lastIndexOf("@") + 1);
  const startedAt = performance.now();

  setSubmitting(true);
  showLookingUp();

  try {
    const workspace = await findWorkspace(domain);
    await wait(LOOKUP_DELAY_MS - (performance.now() - startedAt));

    if (!workspace) {
      showUnknownDomain();
      setSubmitting(false);
      return;
    }

    status.textContent = "Taking you to your workspace...";
    window.location.assign(`${workspace}#login_hint=${encodeURIComponent(email)}`);
  } catch {
    await wait(LOOKUP_DELAY_MS - (performance.now() - startedAt));
    showBrowserError();
    setSubmitting(false);
  }
});

emailInput.addEventListener("input", () => {
  if (submitButton.disabled) return;
  status.hidden = true;
  status.replaceChildren();
  status.classList.remove("is-error");
});
