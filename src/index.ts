import * as core from "@actions/core";
import { context } from "@actions/github";
import * as exec from "@actions/exec"; 
import { exit } from "process";

type GithubContext = typeof context;

async function run(): Promise<void> {
    try {
        const version: string = core.getInput("genezio-version", { required: false });
        const token: string  = core.getInput("token", {required: false});
        core.setSecret(token);

        // Check if npm is installed
        exec.exec("npm -v").catch((error: any) => {
            console.log("Error: ", error.message)
            exit(1)
        });

        // Install genezio CLI
        await exec.exec("npm install -g genezio").catch((error: any) => {
            console.log("Error: ", error.message)
            exit(1)
        });

        // Login using genezio CLI
        if (token != "" || token != null) {
            await exec.exec("genezio", ["login", token]);
        }

        // Check if genezio is logged in
        await exec.exec("genezio", ["account"]).catch((error: any) => {
            console.log("Error: ", error.message)
            exit(1)
        });

        core.setOutput("genezio-version", version);
    } catch (error : any) {
        core.setFailed(error.message)
    };
}

run();
