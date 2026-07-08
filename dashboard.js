import { db } from "./firebase.js";

import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const pages = document.querySelectorAll(".page");

window.showPage = function(pageId) {
    pages.forEach(page => page.style.display = "none");

    const page = document.getElementById(pageId);

    if (page) {
        page.style.display = "block";
    }
};

showPage("dashboard");

const addGameBtn = document.getElementById("addGame");
const saveTelegramBtn = document.getElementById("saveTelegram");
// Add Game
if (addGameBtn) {

addGameBtn.addEventListener("click", async () => {

const gameName = document.getElementById("gameName").value;
const gameImage = document.getElementById("gameImage").value;
const gameLink = document.getElementById("gameLink").value;
const gameRating = document.getElementById("gameRating").value;

if (!gameName || !gameImage || !gameLink || !gameRating) {
alert("Please fill all fields");
return;
}

await setDoc(doc(db, "games", gameName), {

name: gameName,
image: gameImage,
link: gameLink,
rating: Number(gameRating),
views: 0,
downloads: 0

});

alert("Game Added Successfully");

document.getElementById("gameName").value = "";
document.getElementById("gameImage").value = "";
document.getElementById("gameLink").value = "";
document.getElementById("gameRating").value = "";

});

}
// Save Telegram Link
if (saveTelegramBtn) {

saveTelegramBtn.addEventListener("click", async () => {

const link = document.getElementById("telegramLink").value;

if (!link) {
alert("Please Enter Telegram Link");
return;
}

await setDoc(doc(db, "settings", "telegram"), {
link: link
});

alert("Telegram Link Saved Successfully");

});

}

// Load Dashboard Counts
async function loadDashboard() {

const gamesSnap = await getDocs(collection(db, "games"));

document.getElementById("totalGames").innerText = gamesSnap.size;

let totalViews = 0;
let totalDownloads = 0;

gamesSnap.forEach(doc => {

const data = doc.data();

totalViews += data.views || 0;
totalDownloads += data.downloads || 0;

});

document.getElementById("totalViews").innerText = totalViews;
document.getElementById("totalDownloads").innerText = totalDownloads;

}

loadDashboard();
// Load Telegram Link
async function loadTelegram() {

const telegramDoc = await getDoc(doc(db, "settings", "telegram"));

if (telegramDoc.exists()) {
document.getElementById("telegramLink").value = telegramDoc.data().link || "";
}

}

loadTelegram();

// Auto Refresh Dashboard
setInterval(() => {
loadDashboard();
}, 5000);

// Default Page
showPage("dashboard");
// Sidebar Toggle
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}

// Close Sidebar After Menu Click
document.querySelectorAll(".menu a").forEach(item => {
    item.addEventListener("click", () => {
        sidebar.classList.remove("active");
    });
});

// Initialize
loadDashboard();
loadTelegram();
showPage("dashboard");