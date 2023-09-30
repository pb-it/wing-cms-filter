const fArrEval = require('./array-eval');

function jPath(json: Array<object>, expression: string) {
    return _parse(json, expression);
}

function _parse(json: Array<object>, expression: string) {
    expression = _removeWhitespaces(expression);

    if (expression.startsWith("$.")) {
    }
    expression = _unclasp(expression);

    if (expression.startsWith("?")) {
    }
    expression = _unclasp2(expression);

    return _applyExpression(json, expression);
}

/**
 * Exit on predicate else recursion
 * No validation - only splitt on boolean equations
 * Each expression is made up of terms. A term can be a predicate, number, ...
 * @param json 
 * @param expression 
 * @returns 
 */
function _applyExpression(json: Array<object>, expression: string) {
    var res: Array<object>;
    var c;
    var iBraceCnt = 0;
    var bNeg = false;
    var bExpr = false;
    var bPred = false;
    var bAnd = false;
    var bOr = false;
    var iStart = -1;
    var iEnd = -1;
    for (var i = 0; i < expression.length; i++) {
        c = expression[i];
        switch (c) {
            case '(':
                iBraceCnt++;
                if (iStart == -1) {
                    bExpr = true;
                    iStart = i;
                    if (i > 0 && expression[i - 1] == '!')
                        bNeg = true;
                }
                break;
            case ')':
                if (iBraceCnt > 0)
                    iBraceCnt--;
                else
                    throw new Error("invalid expression");
                break;
            case '.':
                if (iStart == -1) {
                    if (i > 0 && expression[i - 1] == '@') {
                        bPred = true;
                        iStart = i - 1;
                        if (i > 1 && expression[i - 2] == '!')
                            bNeg = true;
                    }
                }
                break;
            case '&':
                if (iBraceCnt == 0 && i > 0 && expression[i - 1] == '&') {
                    if (iStart >= 0) {
                        bAnd = true;
                        iEnd = i - 1;
                    } else
                        throw new Error("invalid expression");
                }
                break;
            case '|':
                if (iBraceCnt == 0 && i > 0 && expression[i - 1] == '|') {
                    if (iStart >= 0) {
                        bOr = true;
                        iEnd = i - 1;
                    } else
                        throw new Error("invalid expression");
                }
                break;
            default: // ignore all after expression or predicate started and in parentheses
        }
        if (iEnd >= 0)
            break;
    }

    if (iBraceCnt == 0) {
        var part;
        if (iStart >= 0) {
            if (iEnd == -1)
                iEnd = expression.length;
            if (bPred)
                part = expression.substring(iStart, iEnd);
            else if (bExpr)
                part = expression.substring(iStart + 1, iEnd - 1);
        } else
            part = expression;

        if (bPred)
            res = _applyPredicate(json, part);
        else if (bExpr)
            res = _applyExpression(json, part);
        else
            throw new Error("invalid expression"); // TODO: no expession or predicate ok ???

        if (bNeg)
            res = json.filter((item) => !res.includes(item));

        if (bAnd) {
            res = _applyExpression(res, expression.substring(iEnd + 2));
        } else if (bOr) {
            res = [...new Set([...res, ..._applyExpression(json, expression.substring(iEnd + 2))])];
        }
    } else
        throw new Error("invalid expression");
    return res;
}

function _removeWhitespaces(str: string) {
    var res;
    var parts = str.split('"');
    if (parts.length % 2 == 1) {
        for (var i = 0; i < parts.length; i = i + 2) {
            parts[i] = parts[i].replace(/\s/g, "");
        }
    }
    res = parts.join('"');
    return res;
}

function _unclasp(str) {
    var between;
    var open = str.indexOf('[');
    var close = str.lastIndexOf(']');
    if (open >= 0 && close > 0) {
        between = str.substring(open + 1, close);
    } else
        throw new Error('incorrect clasping');
    return between;
}

function _unclasp2(str) {
    var between;
    var open = str.indexOf('(');
    var close = str.lastIndexOf(')');
    if (open >= 0 && close > 0) {
        between = str.substring(open + 1, close);
    } else
        throw new Error('incorrect clasping');
    return between;
}

function _applyPredicate(json, predicate) {
    var conform: Array<object> = [];
    if (predicate.startsWith("@.")) {
        predicate = predicate.substring(2);

        var operator;
        if (predicate.indexOf("==") >= 0) {
            operator = "==";
        } else if (predicate.indexOf("!=") >= 0) {
            operator = "!=";
        } else if (predicate.indexOf("=~") >= 0) {
            operator = "=~";
        } else if (predicate.indexOf(">=") >= 0) {
            operator = ">=";
        } else if (predicate.indexOf("<=") >= 0) {
            operator = "<=";
        } else if (predicate.indexOf("=") >= 0) {
            throw new Error('invalid operator');
        } else if (predicate.indexOf(">") >= 0) {
            operator = ">";
        } else if (predicate.indexOf("<") >= 0) {
            operator = "<";
        }
        var path;
        var result;
        if (operator == null) {
            path = _parsePath(predicate);
        } else {
            var parts = predicate.split(operator);
            if (parts != null && parts.length == 2) {
                path = _parsePath(parts[0]);
                result = parts[1];
            }
        }
        if (path != null) {
            var obj: object;
            for (var i = 0; i < json.length; i++) {
                obj = json[i];
                if (_fulfilled(obj, path, operator, result)) {
                    conform.push(obj);
                }
            }
        }
    } else
        throw "invalid predicate";
    return conform;
}

function _fulfilled(obj, path, operator, result) {
    var fulfilled = false;

    if (obj) {
        var field = path[0];
        var next: Array<string> = obj[field.name];
        if (next) {
            if (path.length == 1) {
                if (field.type == FieldEnum.object) {
                    fulfilled = _fulfilledObj(next, operator, result);
                }
            } else {
                var remaining = path.slice(1);
                if (field.type == FieldEnum.object) {
                    fulfilled = _fulfilled(next, remaining, operator, result);
                } else if (field.type == FieldEnum.array) {
                    if (path.length == 2) {
                        var nextField = path[1].name;
                        if (nextField == "length()") {
                            var length = next.length;
                            switch (operator) {
                                case "==":
                                    fulfilled = (length == result);
                                    break;
                                case "!=":
                                    fulfilled = (length != result);
                                    break;
                                case "~=":
                                    // TODO: fail
                                    break;
                                case ">=":
                                    fulfilled = (length >= result);
                                    break;
                                case "<=":
                                    fulfilled = (length <= result);
                                    break;
                                case ">":
                                    fulfilled = (length > result);
                                    break;
                                case "<":
                                    fulfilled = (length < result);
                                    break;
                            }
                        } else {
                            // TODO: works only for id? - regex for name possible?
                            if (operator == "==" || operator == "!=") {
                                var res = fArrEval(Array.from(next, x => x[nextField]), result);

                                if (operator == "==")
                                    fulfilled = res;
                                else if (operator == "!=")
                                    fulfilled = !res;
                            }
                        }
                    } else {
                        var arr = next;
                        for (var i = 0; i < arr.length; i++) {
                            fulfilled = _fulfilled(arr[i], remaining, operator, result);
                            if (fulfilled)
                                break;
                        }
                    }
                }
            }
        } else {
            if (operator == "!=")
                fulfilled = true;
        }
    } else {
        if (operator == "!=")
            fulfilled = true;
    }
    return fulfilled;
}

function _fulfilledObj(val, operator, result) {
    var fulfilled = false;

    if (operator != null) {
        if (val != null) {
            var parts = result.split('"');
            if (parts.length == 3 && !parts[0] && !parts[2])
                result = parts[1];

            switch (operator) {
                case "==":
                case "!=":
                    var regex = new RegExp(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"); // https://stackoverflow.com/questions/18893390/splitting-on-comma-outside-quotes
                    var arr = result.split(regex);
                    var str: string;
                    for (var i in arr) {
                        str = arr[i];
                        if (str.startsWith('"') && str.endsWith('"')) {
                            arr[i] = str.substring(1, str.length - 1);
                        }
                    }
                    var match = arr.includes(val.toString());

                    if (operator == "==")
                        fulfilled = match;
                    else
                        fulfilled = !match;
                    break;
                case "=~":
                    var sRegex: string = result;
                    var modifier: string | undefined;
                    if (sRegex.indexOf('/') >= 0) {
                        parts = sRegex.split('/');
                        if (parts.length == 3 && parts[0] == "") {
                            sRegex = parts[1];
                            modifier = parts[2];
                        }
                    }
                    fulfilled = new RegExp(sRegex, modifier).test(val);
                    break;
                case ">=":
                    fulfilled = (val >= result);
                    break;
                case "<=":
                    fulfilled = (val <= result);
                    break;
                case ">":
                    fulfilled = (val > result);
                    break;
                case "<":
                    fulfilled = (val < result);
                    break;
            }
        } else {
            if (operator == "!=")
                fulfilled = true;
        }
    } else {
        fulfilled = (val != null);
    }
    return fulfilled;
}

function _parsePath(query: string) {
    var path: Array<string> = [];
    var fields: Array<string> = query.split('.');
    for (var i = 0; i < fields.length; i++) {
        path.push(_parseField(fields[i]));
    }
    return path;
}

function _parseField(str) {
    var field;
    if (str.endsWith("[*]")) {
        field = new Field(str.substring(0, str.length - 3), FieldEnum.array);
    } else {
        field = new Field(str, FieldEnum.object);
    }
    return field;
}

const FieldEnum = Object.freeze({ "number": 1, "string": 2, "object": 3, "array": 4 });

class Field {

    name;
    type;

    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

module.exports = jPath;
