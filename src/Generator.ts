import * as vscode from 'vscode';
import Property from './Property';
import Class from './Class';
import { threadId } from 'worker_threads';

const PROPERTY_NOT_FOUND = 'Nothing selected or not a property';

export default class Generator {

    private static editor: vscode.TextEditor;

    public static addConstruct():void {

        if(vscode.window.activeTextEditor === undefined) {
            vscode.window.showErrorMessage(PROPERTY_NOT_FOUND);
            throw new Error(PROPERTY_NOT_FOUND);
        }
        this.editor = vscode.window.activeTextEditor;
        let classObject : Class = Generator.loadClass();
        Generator.render(classObject.generateConstruct());

    }

    public static addGetter(): void {

        if(vscode.window.activeTextEditor === undefined) {
            vscode.window.showErrorMessage(PROPERTY_NOT_FOUND);
            throw new Error(PROPERTY_NOT_FOUND);
        }
        this.editor = vscode.window.activeTextEditor;

        //Obtain property informations (name and type)
        let getterInfos : Property = Generator.getPropertyInfos(this.editor.selection.active);
        //Render the getter
        Generator.render(getterInfos.generateGetter());
    }

    public static addSetter(): void {

        if(vscode.window.activeTextEditor === undefined) {
            vscode.window.showErrorMessage(PROPERTY_NOT_FOUND);
            throw new Error(PROPERTY_NOT_FOUND);
        }
        this.editor = vscode.window.activeTextEditor;

        //Obtain property informations (name and type)
        let getterInfos : Property = Generator.getPropertyInfos(this.editor.selection.active);
        //Render the getter
        Generator.render(getterInfos.generateSetter());
    }

    public static addAllGetter(): void {

        if(vscode.window.activeTextEditor === undefined) {
            vscode.window.showErrorMessage(PROPERTY_NOT_FOUND);
            throw new Error(PROPERTY_NOT_FOUND);
        }
        this.editor = vscode.window.activeTextEditor;

        //Obtain property informations (name and type)
        let classObject : Class = Generator.loadClass();

        //Render the getters
        Generator.render(classObject.generateGetters());
    }

    public static addAllSetter(): void {

        if(vscode.window.activeTextEditor === undefined) {
            vscode.window.showErrorMessage(PROPERTY_NOT_FOUND);
            throw new Error(PROPERTY_NOT_FOUND);
        }
        this.editor = vscode.window.activeTextEditor;

        //Obtain property informations (name and type)
        let classObject : Class = Generator.loadClass();

        //Render the getters
        Generator.render(classObject.generateSetters());
    }

    /**
     * Return a map with property informations
     * 
     * @param {vscode.Position} position
     * @return {Property}
     */
    private static getPropertyInfos(position: vscode.Position): Property {

        //Selected line
        let lineText   = this.editor.document.lineAt(position.line).text.trim();
        const regex = /(private|protected|public) *([a-zA-Z]*) *\$([a-zA-Z]+) *;/g;

        let propertyDefinition = regex.exec(lineText);

        //If line is not a property definition, error
        if(!propertyDefinition) {
            vscode.window.showErrorMessage(PROPERTY_NOT_FOUND);
            throw new Error(PROPERTY_NOT_FOUND);
        }

        let propertyType = propertyDefinition[2] === '' ? Generator.getTypeFromDoc(position.line) : propertyDefinition[2];

        return new Property(propertyDefinition[3], propertyType);
    }

    /**
     * Use PHPDoc to get property type
     * 
     * @param {number} propertyLine
     * @return {string} 
     */
    private static getTypeFromDoc(propertyLine: number): string {
        let endDocLine = propertyLine - 1;
        let endDocLineText = this.editor.document.lineAt(endDocLine).text;

        // If previous line is not end of PHPdoc, return empty string(no type)
        if(!endDocLineText.includes('*/')) {
            return '';
        }

        // Search type in PHPdoc
        let docLine = endDocLine;
        let docLineText = endDocLineText;
        const regex = /@var *([a-zA-Z]+) *(\$[a-zA-Z]+)?/g;
        while(docLine >= 0 && docLineText.includes('*') && !docLineText.includes('/*')) {
            let res = regex.exec(docLineText);
            if(res) {
                //type found
                return res[1];
            }

            //next doc line
            docLine--;
            docLineText = this.editor.document.lineAt(docLine).text;
        }

        //No type found in doc
        return '';

    }

    private static getEndOfClass(): vscode.TextLine {

        for (let lineNumber = this.editor.document.lineCount-1; lineNumber > 0; lineNumber--) {
            const text = this.editor.document.lineAt(lineNumber).text.trim();

            if (text.includes('}')) {
                return this.editor.document.lineAt(lineNumber);
            }
        }

        return this.editor.document.lineAt(this.editor.document.lineCount - 1);
    }

    private static render(content: string): void {

        let line = this.getEndOfClass();
        let eol = '';
        if(this.editor.document.lineAt(line.lineNumber-1).text.trim() === '') {
            line = this.editor.document.lineAt(line.lineNumber-1);
        } else {
            eol += '\n';
        }

        this.editor.edit(function(edit: vscode.TextEditorEdit){
            edit.replace(
                new vscode.Position(line.lineNumber, 0),
                content + eol
            );
        });
    }

    private static loadClass(): Class {
        let res = new Array<Property>();
        let className = '';

        for (let lineNumber = 0 ; lineNumber <= this.editor.document.lineCount - 1; lineNumber++) {
            const text = this.editor.document.lineAt(lineNumber).text.trim();
            let regex = /(private|protected|public) *([a-zA-Z]*) *\$([a-zA-Z]+) *;/g;
            let regexRes = regex.exec(text);

            if (regexRes) {
                res.push(Generator.getPropertyInfos(new vscode.Position(lineNumber, 0)));
                continue;
            }

            regex = /class ([a-zA-Z]*) *(\n|\r\n)? *{/gm;
            regexRes = regex.exec(text);

            if(regexRes) {
                className = regexRes[1];
            }


        }

        return new Class(className, res);
    }

}