(function () {
    "use strict";

    var FLAVORS = [
        { color: "#FFEAA1", logo: "images/ic_logo_fruit_half.png" },
        { color: "#E6A0A0", logo: "images/ic_logo_vegetable_half.png" },
        { color: "#E2BA8B", logo: "images/ic_logo_mammal_side.png" },
        { color: "#B1DBE7", logo: "images/ic_logo_bird_side.png" }
    ];

    var CROSSHATCH =
        "repeating-linear-gradient(45deg, white 0px, white 4px, transparent 4px, transparent 11px)," +
        "repeating-linear-gradient(-45deg, white 0px, white 4px, transparent 4px, transparent 11px),";

    var bgMusic, flipSound;
    var musicPlaying = true;
    var audioUnlocked = false;

    // --- Bootstrap ---

    document.addEventListener("DOMContentLoaded", function () {
        initI18n();
        initCards();
        initFloatingCards();
        initAudio();
        initFocusHandling();

        document.addEventListener("contextmenu", function (e) {
            if (e.target.tagName === "IMG") e.preventDefault();
        });
    });

    // --- Cards ---

    function initCards() {
        document.querySelectorAll(".app-card").forEach(function (card, i) {
            card.style.animationDelay = (0.4 + i * 0.12) + "s";
            card.classList.add("app-card--visible");

            card.addEventListener("animationend", function () {
                card.classList.remove("app-card--visible");
                card.classList.add("app-card--settled");
            });

            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width * 100;
                var y = (e.clientY - rect.top) / rect.height * 100;
                card.style.setProperty("--mouse-x", x + "%");
                card.style.setProperty("--mouse-y", y + "%");
            });
        });
    }

    // --- Floating cards ---

    function initFloatingCards() {
        var container = document.querySelector(".floating-cards");
        if (!container) return;

        for (var i = 0; i < 12; i++) {
            container.appendChild(createFloatingCard(FLAVORS[i % FLAVORS.length]));
        }
    }

    function createFloatingCard(flavor) {
        var card = document.createElement("div");
        card.classList.add("floating-card");

        var inner = document.createElement("div");
        inner.classList.add("floating-card__inner");

        var back = document.createElement("div");
        back.classList.add("floating-card__back");
        back.style.background = CROSSHATCH + flavor.color;

        var front = document.createElement("div");
        front.classList.add("floating-card__front");
        front.style.backgroundColor = flavor.color;

        var img = document.createElement("img");
        img.src = flavor.logo;
        img.alt = "";
        front.appendChild(img);

        inner.appendChild(back);
        inner.appendChild(front);
        card.appendChild(inner);

        var duration = 14 + Math.random() * 12;
        card.style.left = (Math.random() * 100) + "%";
        card.style.transform = "scale(" + (0.6 + Math.random() * 0.6) + ")";
        card.style.animationDuration = duration + "s";
        card.style.animationDelay = "-" + (Math.random() * duration) + "s";

        card.addEventListener("click", function (e) {
            var c = e.currentTarget;
            if (c.classList.contains("floating-card--flipped")) return;
            tryPlaySound(flipSound);
            tryUnlockMusic();
            c.classList.add("floating-card--flipped");
            setTimeout(function () { c.classList.remove("floating-card--flipped"); }, 1200);
        });

        return card;
    }

    // --- Audio ---

    function initAudio() {
        bgMusic = new Audio("audio/music_background.mp3");
        bgMusic.loop = true;
        bgMusic.volume = 0.05;

        flipSound = new Audio("audio/sound_card_flip_1.mp3");
        flipSound.volume = 0.1;

        var toggle = document.getElementById("music-toggle");
        if (!toggle) return;

        var iconOff = toggle.querySelector(".music-toggle__icon--off");
        var iconOn = toggle.querySelector(".music-toggle__icon--on");
        toggle.style.opacity = "0.4";

        function updateIcon() {
            iconOff.style.display = musicPlaying ? "none" : "block";
            iconOn.style.display = musicPlaying ? "block" : "none";
        }
        updateIcon();

        document.body.addEventListener("touchend", tryUnlockMusic);
        document.body.addEventListener("click", tryUnlockMusic);

        toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            if (!audioUnlocked) {
                tryUnlockMusic();
                return;
            }
            musicPlaying = !musicPlaying;
            musicPlaying ? bgMusic.play() : bgMusic.pause();
            updateIcon();
        });

        window.onAudioUnlocked = function () {
            toggle.style.opacity = "";
        };
    }

    function tryUnlockMusic() {
        if (audioUnlocked || !musicPlaying) return;
        bgMusic.play().then(function () {
            audioUnlocked = true;
            if (window.onAudioUnlocked) window.onAudioUnlocked();
        }).catch(function () {});
    }

    function tryPlaySound(sound) {
        if (!sound) return;
        sound.currentTime = 0;
        sound.play().catch(function () {});
    }

    // --- Focus handling (pause/resume music) ---

    function initFocusHandling() {
        document.addEventListener("visibilitychange", function () {
            document.hidden ? pauseMusic() : resumeMusic();
        });
        window.addEventListener("pagehide", pauseMusic);
        window.addEventListener("pageshow", function (e) {
            if (e.persisted) resumeMusic();
        });
        window.addEventListener("blur", pauseMusic);
        window.addEventListener("focus", resumeMusic);
    }

    function pauseMusic() {
        if (!bgMusic || !audioUnlocked) return;
        bgMusic.pause();
    }

    function resumeMusic() {
        if (!bgMusic || !audioUnlocked || !musicPlaying) return;
        bgMusic.play().catch(function () {});
    }
})();
