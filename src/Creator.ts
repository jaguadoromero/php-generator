import * as vscode from 'vscode';
import Templater from './Templater';

export default class Creator {

    public static async newClass(file: any) {
        Creator.newFile(file, 'MyClass.php', Templater.getClassTemplate);
    }

    public static newInterface(file: any) {
        Creator.newFile(file, 'MyInterface.php', Templater.getInterfaceTemplate);
    }

    public static async newFile(file: any, fileName: string, method: CallableFunction) {

		if (!file || !file.path) {
            throw new Error('Php Generator: Empty file path');
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
            throw new Error('Php Generator: Empty file path');
        }

        let edit = new vscode.WorkspaceEdit();
        let uri = vscode.Uri.parse(newFilePath);
        edit.createFile(uri);
        edit.insert(uri, new vscode.Position(0, 0), await method(newFilePath));
        await vscode.workspace.applyEdit(edit);

        await vscode.window.showTextDocument(uri);
    }

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

    public static isPath(path: string) {
        const regex = /(\/?([a-zA-Z_-]*\/)*)(\.?[a-zA-Z_-]*)(\.[a-zA-Z]*)?/g;
        return !!regex.exec(path);
    }
}