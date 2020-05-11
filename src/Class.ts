import * as vscode from 'vscode';
import Property from './Property';
import Configuration from './Configuration';

export default class Class {

    private className: string;
    private properties: Array<Property>;

    private config: Configuration;

    public constructor(className: string, properties: Array<Property>) {
        this.className = className;
        this.properties = properties;

        this.config = new Configuration();
    }

    public generateConstruct(): string {

        let eol = vscode.window.activeTextEditor?.document.eol === 1 ? '\n' : '\r\n';
        let tab = this.config.getTab();
        let beforeBracket = this.config.get('newLineBeforeBracket') === true ? eol + tab : ' ';

        let params = '';
        let body = '';
        let commentParams = '';
        this.properties.forEach((property, i) => {

            params += i === 0 ? '' : ', ';
            params += property.getType() !== '' 
                ? property.getType() + ' '
                : '';
            params += '$' + property.getName();

            body += eol + tab + tab + '$this->' + property.getName() + ' = $' + property.getName() + ';';

            commentParams += eol + tab + '* @param ' + 
                (property.getType() !== '' 
                    ? property.getType() + ' '
                    : '')
                + '$' + property.getName(); 
        });

        return `
${tab}/**
${tab}* ${this.className} __Construct method${commentParams}
${tab}*/
${tab}public function __construct(${params})${beforeBracket}{${body}
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