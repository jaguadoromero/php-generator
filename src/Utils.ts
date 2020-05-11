import * as vscode from "vscode";

export default class Utils {

    /**
     * Return string in camel case format
     * 
     * @param {string} str
     * @return {string}
     */
    public static toCamelCase(str: string): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) 
        { 
            return index === 0 ? word.toLowerCase() : word.toUpperCase(); 
        }).replace(/(\s|\-)+/g, ''); 
    }

    /**
     * Get namespaces declared in composer.json
     * 
     * @return {Promise<Object>}
     */
    public static async getComposerNamespaces(): Promise<Object> {

        let workspaceFolders = vscode.workspace.workspaceFolders;
        if(!workspaceFolders) {
            return '';
        }

        //Load composer.json
        let uri = vscode.Uri.parse(workspaceFolders[0].uri.path + '/composer.json');
        let doc = await vscode.workspace.openTextDocument(uri);

        let namespacesList = JSON.parse(doc.getText().replace('psr-4', 'psr4').replace('psr-0', 'psr0')).autoload;

        //Return object containing namespaces declared in composer.json
        return namespacesList.psr4
            ? namespacesList.psr4
            : namespacesList.psr0;
    }
}