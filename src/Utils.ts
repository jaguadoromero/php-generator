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

    // Todo: Fix namespace if many folder open in workspace
    /**
     * Get namespaces declared in composer.json
     * 
     * @return {Promise<Object>}
     */
    public static async getComposerNamespaces(filePath: string): Promise<Object> {

        let workspaceFolders = vscode.workspace.workspaceFolders;
        if(!workspaceFolders) {
            return '';
        }
        let namespacesList = new Object();
        let uri;
        workspaceFolders.forEach(folder => {
            if(filePath.startsWith(folder.uri.path)) {
                uri = vscode.Uri.parse(folder.uri.path + '/composer.json');
            }
        });

        if(!uri) {
            return namespacesList;
        }

        let doc = await vscode.workspace.openTextDocument(uri);
        let autoload = JSON.parse(doc.getText().replace('psr-4', 'psr4').replace('psr-0', 'psr0')).autoload;
        namespacesList = autoload.psr4
            ? autoload.psr4
            : autoload.psr0;

        //Return object containing namespaces declared in composer.json
        return namespacesList;
    }
}