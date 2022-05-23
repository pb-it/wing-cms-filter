function arrEval(arr, expr) {
    var fulfilled;

    if (expr.indexOf(',') >= 0) {
        var parts = expr.split(',');
        fulfilled = parts.some(i => _evalValue(arr, i));
    } else {
        var open = expr.indexOf('(');
        var close = expr.lastIndexOf(')');
        var part;
        var parentheses = (open >= 0 && close > 0);
        if (parentheses) {
            part = expr.substring(open + 1, close);
        } else {
            part = expr;
        }
        fulfilled = _evalPart(arr, part);
        if (parentheses && expr.startsWith('!'))
            fulfilled = !fulfilled;
    }
    return fulfilled;
}

function _evalPart(arr, expr) {
    var fulfilled;
    if (expr.indexOf("&&") >= 0) {
        var res = expr.split("&&");
        fulfilled = res.every(i => _evalValue(arr, i));
    } else if (expr.indexOf("||") >= 0) {
        var res = expr.split("||");
        fulfilled = res.some(i => _evalValue(arr, i));
    } else {
        fulfilled = _evalValue(arr, expr);
    }
    return fulfilled;
}

function _evalValue(arr, expr) {
    var fulfilled;
    if (expr.startsWith('!')) {
        fulfilled = !arr.includes(parseInt(expr.substring(1)));
    } else {
        fulfilled = arr.includes(parseInt(expr));
    }
    return fulfilled;
}

module.exports = arrEval;