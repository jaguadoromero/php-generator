import * as vscode from 'vscode';

export default class Configuration {

    private config: vscode.WorkspaceConfiguration;
    private editorConfig: vscode.WorkspaceConfiguration;

    public constructor() {
        this.config = vscode.workspace.getConfiguration('php-generator');
        this.editorConfig = vscode.workspace.getConfiguration('editor');
    }

    /**
     * Get property value
     * 
     * @param {string} property
     * @return {any}
     */
    public get(property: string): any {
        return this.config.get(property) || this.editorConfig.get(property);
    }

    /**
     * Get tab value
     * 
     * @return {string}
     */
    public getTab(): string {
        let tab = '';
        for(let i = 0; i < Number(this.get('tabSize')); i++) {
            tab += ' ';
        }
        return tab;
    }
}