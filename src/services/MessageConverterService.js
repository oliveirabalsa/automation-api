const fs = require("fs");
const recovery = require("../files/recoveryState.json");

module.exports = async ({ action }) => {
  const converter = {
    "QUARTO CASAL OFF": "quarto_casal",
    "QUARTO CASAL ON": "quarto_casal",
    "BANHEIRO CASAL OFF": "banheiro_casal",
    "BANHEIRO CASAL ON": "banheiro_casal",
    "SALA ON": "sala",
    "SALA OFF": "sala",
    "QUARTO VISITA OFF": "quarto_visita",
    "QUARTO VISITA ON": "quarto_visita",
    "BANHEIRO VISITA OFF": "banheiro_visita",
    "BANHEIRO VISITA ON": "banheiro_visita",
    "COZINHA OFF": "cozinha",
    "COZINHA ON": "cozinha",
    "LAVANDERIA ON": "lavanderia",
    "LAVANDERIA OFF": "lavanderia",
    "CORREDOR ON": "corredor",
    "CORREDOR OFF": "corredor",
  };

  recovery[converter[action]] = action;

  const updatedRecovery = JSON.stringify(recovery, null, 4);
  
  fs.writeFileSync("src/files/recoveryState.json", updatedRecovery);
};
