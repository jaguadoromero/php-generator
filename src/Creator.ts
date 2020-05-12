import * as vscode from 'vscode';
import * as fs from 'fs';
import Templater from './Templater';

export default class Creator {

    /**
     * Create a new Class file
     * 
     * @param file 
     */
    public static newClass(file: any) {
        Creator.newFile(file, 'MyClass.php', Templater.getClassTemplate);
    }

    /**
     * Create a new Interface file
     * 
     * @param file 
     */
    public static newInterface(file: any) {
        Creator.newFile(file, 'MyInterface.php', Templater.getInterfaceTemplate);
    }

    /**
     * Create a new file
     * 
     * @param file
     * @param {string} fileName
     * @param {CallableFunction} method
     * 
     * @return {Promise<void>}
     */
    public static async newFile(file: any, fileName: string, method: CallableFunction): Promise<void> {

		if (!file || !file.path) {
            vscode.window.showInformationMessage('Php Generator: Empty file path');
            return;
        }

        let filePath = Creator.getPath(file);
        let newFilePath = await vscode.window.showInputBox({
            prompt: "File name",
            value: filePath + fileName,
            valueSelection: [
                filePath.length,
                filePath.length + fileName.length - 4
            ],
        });

        if(!newFilePath || !Creator.isPath(newFilePath)) {
            vscode.window.showInformationMessage('Php Generator: Wrong path');
            return;
        }
        if(fs.existsSync(newFilePath)) {
            vscode.window.showInformationMessage('Php Generator: File already exist');
            return;
        }

        let edit = new vscode.WorkspaceEdit();
        let uri = vscode.Uri.parse(newFilePath);
        edit.createFile(uri);
        edit.insert(uri, new vscode.Position(0, 0), await method(newFilePath));
        await vscode.workspace.applyEdit(edit);

        await vscode.window.showTextDocument(uri);
    }

    /**
     * Get file path
     * 
     * @param file
     * @return {string} 
     */
    public static getPath(file: any): string {
        const regex = /(\/?([a-zA-Z_-]*\/)*)(\.?[a-zA-Z_-]*)(\.[a-zA-Z]*)?/g;
        const res = regex.exec(file.path);
        if(!res) {
            throw new Error('PHP Generator: Wrong path');
        }
        return !res[4] || res[4] === ''
            ? res[1] + res[3] + '/'
            : res[1];
    }

    /**
     * Return true if gven string is a file/folder path
     * 
     * @param {string} path 
     * @return {boolean}
     */
    public static isPath(path: string): boolean {
        const regex = /(\/?([a-zA-Z_-]*\/)*)(\.?[a-zA-Z_-]*)(\.[a-zA-Z]*)?/g;
        return !!regex.exec(path);
    }
}