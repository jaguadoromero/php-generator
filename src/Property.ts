import * as vscode from 'vscode';
import Configuration from './Configuration';

export default class Property {
    private name: string;
    private type: string;

    private config: Configuration;

    public constructor(name: string, type: string) {
        this.name = name;
        this.type = type;

        this.config = new Configuration();
    }

    /**
     * Get property name
     * 
     * @return {string}
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Get property type
     * 
     * @return {string}
     */
    public getType(): string {
        return this.type;
    }

    /**
     * Get property getter template
     * 
     * @return {string}
     */
    public generateGetter(): string {

        let eol = vscode.window.activeTextEditor?.document.eol === 1 ? '\n' : '\r\n';
        let tab = this.config.getTab();
        let beforeBracket = this.config.get('newLineBeforeBracket') === true ? eol + tab : ' ';

        let name: string = this.getName();
        let nameCaps: string = name[0].toUpperCase() + name.slice(1);

        let returnType = this.getType() === '' ? '' : ': ' + this.getType();
        let commentType = this.getType() === '' ? '' : eol + tab + '* @return ' + this.getType();
        return `
${tab}/**
${tab}* Get $${name}${commentType}
${tab}*/
${tab}public function get${nameCaps}()${returnType}${beforeBracket}{
${tab}${tab}return $this->${name};
${tab}}`;
    }

    /**
     * Get property setter template
     * 
     * @return {string}
     */
    public generateSetter(): string {

        let eol = vscode.window.activeTextEditor?.document.eol === 1 ? '\n' : '\r\n';
        let tab = this.config.getTab();
        let beforeBracket = this.config.get('newLineBeforeBracket') === true ? eol + tab : ' ';

        let name: string = this.getName();
        let nameCaps: string = name[0].toUpperCase() + name.slice(1);

        let type = this.getType() + " ";
        let commentParam = this.getType() === '' ? '' : eol + tab + '* @param ' + this.getType() + ' $' + name; 
        return `
${tab}/**
${tab}* Set $${name}${commentParam}
${tab}*/
${tab}public function set${nameCaps}(${type}$${name})${beforeBracket}{
${tab}${tab}$this->${name} = $${name};
${tab}}`;
    }
}