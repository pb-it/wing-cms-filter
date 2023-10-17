declare const fArrEval: any;
declare function jPath(json: Array<object>, expression: string): object[];
declare function _parse(json: Array<object>, expression: string): object[];
/**
 * Exit on predicate else recursion
 * No validation - only splitt on boolean equations
 * Each expression is made up of terms. A term can be a predicate, number, ...
 * @param json
 * @param expression
 * @returns
 */
declare function _applyExpression(json: Array<object>, expression: string): object[];
declare function _removeWhitespaces(str: string): any;
declare function _unclasp(str: any): any;
declare function _unclasp2(str: any): any;
declare function _applyPredicate(json: any, predicate: any): object[];
declare function _fulfilled(obj: any, path: any, operator: any, result: any): boolean;
declare function _fulfilledObj(val: any, operator: string, result: string): boolean;
declare function _parsePath(query: string): string[];
declare function _parseField(str: any): any;
declare const FieldEnum: Readonly<{
    number: 1;
    string: 2;
    object: 3;
    array: 4;
}>;
declare class Field {
    name: any;
    type: any;
    constructor(name: any, type: any);
}
