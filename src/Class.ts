import * as vscode from 'vscode';
import Property from './Property';
import Configuration from './Configuration';

export default class Class {

    private properties: Array<Property>;

    private config: Configuration;

    public constructor(properties: Array<Property>) {
        this.properties = properties;

        this.config = Configuration.getInstance();
    }

    public generateConstruct(): string {

        let eol = vscode.window.activeTextEditor?.document.eol === 1 ? '\n' : '\r\n';
        let tab = this.config.getTab();
        let beforeBracket = this.config.get('newLineBeforeBracket') === true ? eol + tab : ' ';
        return `
${tab}public function __construct()${beforeBracket}{
${tab}${tab}
${tab}}`;
    }

    public generateGetters(): string {
        let content = '';
        this.properties.forEach(property => {
            content += property.generateGetter() + '\n';
        });
        return content;
    }

    public generateSetters(): string {
        let content = '';
        this.properties.forEach(property => {
            content += property.generateSetter() + '\n';
        });
        return content;
    }
}