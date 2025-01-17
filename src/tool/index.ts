import {firstLine, secondLine, thirdLine} from './parseLines'
import {RecordItem, LanguageData} from '../type'

import _ from 'lodash'

function splitIntoRecords(data: string, language: LanguageData): string[] {
    return data.split(_.get(language, 'tool.index.splitFlag'));
}

function splitRecord(record: string): string[] {
    const line: string[] = record.split('\r\n');
    let lines: string[] = [];
    for (let item of line) {
        if (item) {
            lines.push(item.trim());
        }
    }
    return lines;
}


function makeArray(records: string[], language: any) {
    let result: any = [];
    for (let record of records) {
        // split record into lines (section of a record - title / time / text)
        const lines: string[] = splitRecord(record);
        let singleRecord: Partial<RecordItem> = {};
        // first line - title and author
        const first: any = firstLine(lines);
        if (first) {
            singleRecord.title = first.title;
            singleRecord.author = first.author;
        }
        //second line - type, location, time,page
        const second: any = secondLine(lines, language);
        if (second) {
            singleRecord =
                {
                    ...singleRecord,
                    ...second
                }
        }
        // third line - content
        const third: string = thirdLine(lines);
        if (third) {
            singleRecord.text = third;
        }
        if (singleRecord.text) {
            result.push(singleRecord);
        }

    }
    return result;
}


export function parseContent(data: string, language: any) {
    const records: string[] = splitIntoRecords(data, language);
    return makeArray(records, language);
}
