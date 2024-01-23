import { Command } from "commander";

const program = new Command()

program
    .option("-p <option>", "Puerto del servicio", String)

program.parse()

export let options = program.opts()
