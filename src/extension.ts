// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Generator from './Generator';
import Creator from './Creator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "php-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let addConstruct = vscode.commands.registerCommand('php-generator.generate-construct', () => Generator.addConstruct());
	let addGetter = vscode.commands.registerCommand('php-generator.generate-getter', () => Generator.addGetter());
	let addSetter = vscode.commands.registerCommand('php-generator.generate-setter', () => Generator.addSetter());
	let addAllGetters = vscode.commands.registerCommand('php-generator.generate-all-getters', () => Generator.addAllGetter());
	let addAllSetters = vscode.commands.registerCommand('php-generator.generate-all-setters', () => Generator.addAllSetter());

	let newClass = vscode.commands.registerCommand('php-generator.create-class', file => Creator.newClass(file));
	let newInterface = vscode.commands.registerCommand('php-generator.create-interface', file => Creator.newInterface(file));


	context.subscriptions.push(addConstruct);
	context.subscriptions.push(addGetter);
	context.subscriptions.push(addSetter);
	context.subscriptions.push(addAllGetters);
	context.subscriptions.push(addAllSetters);

	context.subscriptions.push(newClass);
	context.subscriptions.push(newInterface);
}

// this method is called when your extension is deactivated
export function deactivate() {}
