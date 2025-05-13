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
  for (let i = 0; i < numerals.length; i++) {
    while (num >= numerals[i].value) {
      result += numerals[i].symbol;
      num -= numerals[i].value;
    }
  }
  return result;
};

const convertToRoman = () => {
  const input = document.getElementById("number").value;
  const output = document.getElementById("output");
  const number = parseFloat(input); // Pour détecter les décimaux

  if (input === "" || isNaN(number)) {
    output.textContent = "Please enter a valid number";
  } else if (!Number.isInteger(number)) {
    output.textContent = "Please enter a whole number (no decimals)";
  } else if (number < 1) {
    output.textContent = "Please enter a number greater than or equal to 1";
  } else if (number >= 4000) {
    output.textContent = "Please enter a number less than or equal to 3999";
  } else {
    output.textContent = toRoman(number);
  }
};

const numberInput = document.getElementById("number");

// Gérer clic sur bouton
document.getElementById("convert-btn").addEventListener("click", convertToRoman);

// Gérer la touche "Entrée" + empêcher les caractères invalides
numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    convertToRoman();
  }

  // Bloquer les caractères non numériques : "-", "e", "."
  if (["-", "e", "."].includes(e.key)) {
    e.preventDefault();
  }
});
