// État de l'application
let isRomanToArabic = false;
let conversionHistory = [];

// Fonction de conversion vers chiffres romains
const toRoman = (num) => {
    const numerals = [
        { value: 1000, symbol: "M" },
        { value: 900, symbol: "CM" },
        { value: 500, symbol: "D" },
        { value: 400, symbol: "CD" },
        { value: 100, symbol: "C" },
        { value: 90, symbol: "XC" },
        { value: 50, symbol: "L" },
        { value: 40, symbol: "XL" },
        { value: 10, symbol: "X" },
        { value: 9, symbol: "IX" },
        { value: 5, symbol: "V" },
        { value: 4, symbol: "IV" },
        { value: 1, symbol: "I" },
    ];

    let result = "";
    let steps = [];
    let remaining = num;

    for (let i = 0; i < numerals.length; i++) {
        while (remaining >= numerals[i].value) {
            result += numerals[i].symbol;
            steps.push(`${remaining} - ${numerals[i].value} = ${remaining - numerals[i].value} (+ ${numerals[i].symbol})`);
            remaining -= numerals[i].value;
        }
    }

    return { result, steps };
};

// Fonction de conversion vers nombres arabes
const toArabic = (roman) => {
    const numerals = {
        'M': 1000, 'CM': 900, 'D': 500, 'CD': 400,
        'C': 100, 'XC': 90, 'L': 50, 'XL': 40,
        'X': 10, 'IX': 9, 'V': 5, 'IV': 4, 'I': 1
    };

    let result = 0;
    let steps = [];
    let i = 0;
    const romanUpper = roman.toUpperCase();

    while (i < romanUpper.length) {
        if (i + 1 < romanUpper.length && numerals[romanUpper.substring(i, i + 2)]) {
            const symbol = romanUpper.substring(i, i + 2);
            const value = numerals[symbol];
            result += value;
            steps.push(`${symbol} = ${value} (total: ${result})`);
            i += 2;
        } else if (numerals[romanUpper[i]]) {
            const symbol = romanUpper[i];
            const value = numerals[symbol];
            result += value;
            steps.push(`${symbol} = ${value} (total: ${result})`);
            i++;
        } else {
            return { result: null, steps: [], error: `Caractère invalide: ${romanUpper[i]}` };
        }
    }

    return { result, steps };
};

// Validation des chiffres romains
const isValidRoman = (roman) => {
    const romanRegex = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
    return romanRegex.test(roman.toUpperCase());
};

// Fonction principale de conversion
const convert = () => {
    const input = document.getElementById("number").value.trim();
    const output = document.getElementById("output");
    const explanation = document.getElementById("explanation");
    
    // Effacer les résultats précédents
    output.className = "output";
    explanation.innerHTML = "";

    if (input === "") {
        showResult("Veuillez entrer une valeur", "error");
        return;
    }

    let result, steps, inputValue, outputValue, conversionType;

    if (isRomanToArabic) {
        // Conversion Romain → Arabe
        if (!isValidRoman(input)) {
            showResult("Chiffre romain invalide", "error");
            return;
        }

        const conversion = toArabic(input);
        if (conversion.error) {
            showResult(conversion.error, "error");
            return;
        }

        result = conversion.result;
        steps = conversion.steps;
        inputValue = input.toUpperCase();
        outputValue = result;
        conversionType = "Romain → Arabe";

    } else {
        // Conversion Arabe → Romain
        const number = parseInt(input);

        if (isNaN(number)) {
            showResult("Veuillez entrer un nombre valide", "error");
            return;
        }
        if (number < 1) {
            showResult("Veuillez entrer un nombre ≥ 1", "error");
            return;
        }
        if (number >= 4000) {
            showResult("Veuillez entrer un nombre ≤ 3999", "error");
            return;
        }

        const conversion = toRoman(number);
        result = conversion.result;
        steps = conversion.steps;
        inputValue = number;
        outputValue = result;
        conversionType = "Arabe → Romain";
    }

    // Afficher le résultat avec animation
    showResult(result, "success");
    
    // Afficher l'explication détaillée
    showExplanation(steps, inputValue, outputValue, conversionType);
    
    // Ajouter à l'historique
    addToHistory(inputValue, outputValue, conversionType);
    
    // Afficher un fait historique aléatoire
    showRandomFact();
};

// Conversion en temps réel
const realTimeConvert = () => {
    const input = document.getElementById("number").value.trim();
    
    if (input === "") {
        document.getElementById("output").textContent = "";
        document.getElementById("explanation").innerHTML = "";
        return;
    }

    // Délai pour éviter trop de calculs
    clearTimeout(window.realTimeTimeout);
    window.realTimeTimeout = setTimeout(convert, 300);
};

// Afficher le résultat avec animation
const showResult = (text, type) => {
    const output = document.getElementById("output");
    output.className = `output ${type}`;
    output.textContent = text;
    
    // Animation d'apparition
    output.style.transform = "scale(0.8)";
    output.style.opacity = "0";
    
    setTimeout(() => {
        output.style.transform = "scale(1)";
        output.style.opacity = "1";
    }, 50);
};

// Afficher l'explication détaillée
const showExplanation = (steps, input, output, type) => {
    const explanation = document.getElementById("explanation");
    
    let html = `
        <div class="explanation-header">
            <h4>🔍 Décomposition détaillée (${type})</h4>
            <p><strong>${input}</strong> = <strong>${output}</strong></p>
        </div>
        <div class="steps">
    `;
    
    steps.forEach((step, index) => {
        html += `<div class="step" style="animation-delay: ${index * 0.1}s">${step}</div>`;
    });
    
    html += '</div>';
    explanation.innerHTML = html;
};

// Basculer le mode de conversion
const toggleMode = () => {
    isRomanToArabic = !isRomanToArabic;
    const input = document.getElementById("number");
    const toggleBtn = document.getElementById("toggle-btn");
    const modeIndicator = document.getElementById("mode-indicator");
    
    if (isRomanToArabic) {
        input.placeholder = "Ex: MCMXCIV";
        toggleBtn.innerHTML = "🔄 Mode: Romain → Arabe";
        modeIndicator.textContent = "Entrez un chiffre romain";
        input.type = "text";
    } else {
        input.placeholder = "Ex: 1994";
        toggleBtn.innerHTML = "🔄 Mode: Arabe → Romain";
        modeIndicator.textContent = "Entrez un nombre";
        input.type = "number";
    }
    
    // Vider les champs et reconvertir si nécessaire
    clearFields();
    if (input.value.trim()) {
        realTimeConvert();
    }
};

// Ajouter à l'historique
const addToHistory = (input, output, type) => {
    const historyItem = { input, output, type, timestamp: new Date() };
    conversionHistory.unshift(historyItem);
    
    // Limiter à 10 éléments
    if (conversionHistory.length > 10) {
        conversionHistory = conversionHistory.slice(0, 10);
    }
    
    updateHistoryDisplay();
};

// Mettre à jour l'affichage de l'historique
const updateHistoryDisplay = () => {
    const historyList = document.getElementById("history-list");
    
    if (conversionHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">Aucune conversion effectuée</div>';
        return;
    }
    
    let html = '';
    conversionHistory.forEach((item, index) => {
        html += `
            <div class="history-item" onclick="loadFromHistory(${index})">
                <div class="history-conversion">
                    <span class="history-input">${item.input}</span>
                    <span class="history-arrow">→</span>
                    <span class="history-output">${item.output}</span>
                </div>
                <div class="history-type">${item.type}</div>
            </div>
        `;
    });
    
    historyList.innerHTML = html;
};

// Charger depuis l'historique
const loadFromHistory = (index) => {
    const item = conversionHistory[index];
    const input = document.getElementById("number");
    
    // Ajuster le mode si nécessaire
    const shouldBeRomanToArabic = item.type === "Romain → Arabe";
    if (isRomanToArabic !== shouldBeRomanToArabic) {
        toggleMode();
    }
    
    input.value = item.input;
    convert();
};

// Vider les champs
const clearFields = () => {
    document.getElementById("number").value = "";
    document.getElementById("output").textContent = "";
    document.getElementById("explanation").innerHTML = "";
    document.getElementById("random-fact").innerHTML = "";
};

// Réinitialiser tout
const resetAll = () => {
    clearFields();
    conversionHistory = [];
    updateHistoryDisplay();
    document.getElementById("number").focus();
};

// Afficher un fait historique aléatoire
const showRandomFact = () => {
    const facts = [
        "📚 Les chiffres romains étaient utilisés dans l'Empire romain depuis le VIIIe siècle avant J.-C.",
        "🏛️ Le système de numération romain n'avait pas de symbole pour le zéro.",
        "📜 Les Romains utilisaient IIII au lieu de IV sur les horloges pour des raisons esthétiques.",
        "⚖️ M signifie 'mille' en latin (milia), D signifie 'demi-mille' (500).",
        "🎭 Les chiffres romains sont encore utilisés aujourd'hui pour numéroter les siècles et les actes de théâtre.",
        "🏺 L'année 1666 s'écrit MDCLXVI et contient tous les symboles romains principaux.",
        "👑 Les rois et reines utilisent les chiffres romains pour se distinguer (ex: Louis XIV).",
        "🕰️ Sur les cadrans d'horloge, on trouve souvent IIII au lieu de IV pour l'équilibre visuel."
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    document.getElementById("random-fact").innerHTML = `<div class="fact-content">${randomFact}</div>`;
};

// Gestion des événements clavier
const handleKeyEvents = (e) => {
    // Conversion avec Entrée
    if (e.key === "Enter") {
        e.preventDefault();
        convert();
        return;
    }
    
    // Raccourcis clavier
    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'r':
                e.preventDefault();
                resetAll();
                break;
            case 'm':
                e.preventDefault();
                toggleMode();
                break;
        }
        return;
    }
    
    // Effacer avec Escape
    if (e.key === "Escape") {
        clearFields();
        return;
    }
    
    // Filtrer les caractères selon le mode
    if (!isRomanToArabic) {
        // Mode nombre : bloquer les caractères non numériques
        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
            e.preventDefault();
        }
    } else {
        // Mode romain : autoriser seulement les lettres romaines
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        const romanChars = /^[IVXLCDMivxlcdm]$/;
        
        if (!allowedKeys.includes(e.key) && !romanChars.test(e.key)) {
            e.preventDefault();
        }
    }
};

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    const numberInput = document.getElementById("number");
    
    // Événements principaux
    document.getElementById("convert-btn").addEventListener("click", convert);
    document.getElementById("toggle-btn").addEventListener("click", toggleMode);
    document.getElementById("clear-btn").addEventListener("click", clearFields);
    document.getElementById("reset-btn").addEventListener("click", resetAll);
    
    // Gestion du clavier
    numberInput.addEventListener("keydown", handleKeyEvents);
    
    // Conversion en temps réel
    numberInput.addEventListener("input", realTimeConvert);
    
    // Raccourcis clavier globaux
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'r':
                    e.preventDefault();
                    resetAll();
                    break;
                case 'm':
                    e.preventDefault();
                    toggleMode();
                    break;
            }
        }
    });
    
    // Initialiser l'affichage
    updateHistoryDisplay();
    numberInput.focus();
    
    // Afficher un fait au démarrage
    showRandomFact();
});