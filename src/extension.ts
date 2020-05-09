// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Generator from './Generator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "php-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let addGetter = vscode.commands.registerCommand('php-generator.generate-getter', () => Generator.addGetter());
	let addSetter = vscode.commands.registerCommand('php-generator.generate-setter', () => Generator.addSetter());
	let addAllGetters = vscode.commands.registerCommand('php-generator.generate-all-getters', () => Generator.addAllGetter());
	let addAllSetters = vscode.commands.registerCommand('php-generator.generate-all-setters', () => Generator.addAllSetter());

	context.subscriptions.push(addGetter);
	context.subscriptions.push(addSetter);
	context.subscriptions.push(addAllGetters);
	context.subscriptions.push(addAllSetters);
}

// this method is called when your extension is deactivated
export function deactivate() {}
