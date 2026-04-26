const axios = require('axios');
const fs = require('fs');

// Evita reinicializar tudo várias vezes
let initialized = false;

module.exports = function initHome(options = {}) {
    if (initialized) return;
    initialized = true;

    const prefix = options.prefix || "[HOME]";

    // ===== LOG =====
    global.log = (...args) => {
        console.log(prefix, ...args);
    };

    // ===== TIME =====
    global.time = {
        now: new Date(),
        timestamp: Date.now(),
        format: (locale = "pt-BR") => new Date().toLocaleString(locale)
    };

    // ===== SLEEP =====
    global.sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // ===== API =====
    global.api = {
        translate: async (text, to = "pt") => {
            try {
                const res = await axios.post("https://libretranslate.de/translate", {
                    q: text,
                    source: "auto",
                    target: to,
                    format: "text"
                });
                return res.data.translatedText;
            } catch (e) {
                console.error(prefix, "Erro na tradução:", e.message);
                return text;
            }
        }
    };

    // ===== FS SIMPLIFICADO =====
    global.fsPlus = {
        read: (path) => fs.readFileSync(path, 'utf-8'),
        write: (path, content) => fs.writeFileSync(path, content),
        exists: (path) => fs.existsSync(path)
    };

    // ===== MATH EXTRA =====
    global.math = {
        random: (min, max) => Math.random() * (max - min) + min,
        clamp: (v, min, max) => Math.max(min, Math.min(max, v))
    };

    // ===== ENV =====
    global.env = process.env;

    // ===== DEBUG =====
    log("Ghost Home carregado.");
};
