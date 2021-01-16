// configuration pour lancer le serveur avec la commande (denon start)
import { DenonConfig } from "https://deno.land/x/denon@2.4.6/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "main.ts",
      desc: "exécute le fichier main.ts avec la commande 'denon start' ",
      unstable: true,
      allow: ["read", "net"]
    },
  },
};



export default config;