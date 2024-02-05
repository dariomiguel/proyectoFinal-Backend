import { Command } from "commander";

const program = new Command()

program
    .option("-p <option>", "Puerto del servicio", String)
    .option("-e, --env <env>", "Entorno de ejecución (produccion o desarrollo)", String)

program.parse()

export let options = program.opts()
