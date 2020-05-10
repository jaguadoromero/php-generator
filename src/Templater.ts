
import Configuration from './Configuration';

export default class Templater {

    public static getClassTemplate(filename: string): string {
        const config = new Configuration();

        let eol = '\n';
        let tab = config.getTab();
        let beforeBracket = config.get('newLineBeforeBracket') === true ? eol : ' ';

        return (
`<?php

class ${filename}${beforeBracket}{

}
`       );
    }

    public static getInterfaceTemplate(filename: string): string {
        const config = new Configuration();

        let eol = '\n';
        let tab = config.getTab();
        let beforeBracket = config.get('newLineBeforeBracket') === true ? eol : ' ';

        return (
`<?php

interface ${filename}${beforeBracket}{

}
`       );
    } 
}