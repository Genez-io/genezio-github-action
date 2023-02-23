import * as core from "@actions/core";
import { context } from "@actions/github";
import * as exec from "@actions/exec"; 
import { exit } from "process";

async function run(): Promise<void> {
    try {
        let version: string = core.getInput("genezio-version", { required: false });
        if (version != "" || version != null) {
            version = "latest"
        }
        const token: string  = core.getInput("token", { required: false });
        
        // Check if npm is installed
        exec.exec("npm -v").catch((error: any) => {
            console.log("Checking if npm is installed failed with error: ", error.message)
            exit(1)
        });
        
        // Install genezio CLI
        await exec.exec("npm install -g genezio@"+version).catch((error: any) => {
            console.log("Installing genezio using npm failed with error: ", error.message)
            exit(1)
        });
        
        // Set genezio version as output to be used to verify the installation
        await exec.exec("genezio", ["--version"]).catch((error: any) => {
            console.log("Checking if genezio is installed failed with error: ", error.message)
            exit(1)
        }).then((version: any) => {
            console.log("genezio version: ", version)
            core.setOutput("genezio-version", version);
        });
        
        // Login using genezio CLI
        if (token != "" && token != null) {
            core.setSecret(token);
            await exec.exec("genezio", ["login", token]);
        } else {
            console.log("Logging in failed with error:", "Token is not provided")
            exit(1)
        }

        // Check if genezio is logged in
        await exec.exec("genezio", ["account"]).catch((error: any) => {
            console.log("Displaying user information failed with error: ", error.message)
            exit(1)
        });

    } catch (error : any) {
        core.setFailed(error.message)
    };
}

run();
