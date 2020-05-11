
import * as vscode from 'vscode';
import Configuration from './Configuration';
import Utils from './Utils';

export default class Templater {

    /**
     * Get template for a class file
     * 
     * @param {string} filepath
     * @return {Promise<string>}
     */
    public static async getClassTemplate(filepath: string): Promise<string> {
        return Templater.getTemplate(filepath, 'class');
    }

    /**
     * Get template for a class file
     * 
     * @param {string} filepath
     * @return {Promise<string>}
     */
    public static async getInterfaceTemplate(filepath: string): Promise<string> {
        return Templater.getTemplate(filepath, 'interface');
    } 

    /**
     * Get template for a file
     * 
     * @param {string} filepath
     * @param {string} keyword
     * @return {Promise<string>}
     */
    public static async getTemplate(filepath: string, keyword: string): Promise<string> {
        const config = new Configuration();

        let eol = '\n';
        let tab = config.getTab();

        let beforeBracket = config.get('newLineBeforeBracket') === true ? eol : ' ';
        let filename = Templater.getFileNameFromPath(filepath);
        let namespace = await Templater.getNamespaceFromPath(filepath) ;
        namespace = config.get('addNamespace') && namespace !== ''
            ? eol + eol + 'namespace ' + namespace + ';'
            : '';

        return (
`<?php${namespace}

${keyword} ${filename}${beforeBracket}{

}
`       );
    }

    /**
     * Get path parts in array
     *      1 : path
     *      3 : filename
     *      4 : filetype
     * 
     * @param {string} path
     * @return {Array<string>|null}
     */
    private static getArrayFromPath(path: string): Array<string>|null {
        const regex = /(\/?([a-zA-Z_-]*\/)*)(\.?[a-zA-Z_-]*)(\.[a-zA-Z]*)?/g;
        return regex.exec(path);
    }

    /**
     * Get app namespace for a file from it's namespace
     * 
     * @param {string} path
     * @return {Promise<string>} 
     */
    public static async getNamespaceFromPath(path: string): Promise<string> {
        const pathArray = Templater.getArrayFromPath(path);
        const workspace: readonly vscode.WorkspaceFolder[]|undefined = vscode.workspace.workspaceFolders;
        let namespace = '';

        if(!pathArray || !workspace) {
            throw new Error('PHP Generator: Wrong path');
        }
        
        let res = pathArray[1].replace(workspace[0].uri.path,'');
        res = res.slice(1);
        res = res.slice(0, res.length - 1);

        let appNamespaces = await Utils.getComposerNamespaces();
        Object.entries(appNamespaces).forEach((ns) => {
            if (res === ns[1]) {
                namespace = ns[0].slice(0, ns[0].length - 1);
            }
        });

        return namespace;
    }


    /**
     * Get filename from it's path
     * 
     * @param {string} path
     * @return {string} 
     */
    public static getFileNameFromPath(path: string): string {
        const res = Templater.getArrayFromPath(path);
        if(!res) {
            throw new Error('PHP Generator: Wrong path');
        }
        return res[3];
    }
}