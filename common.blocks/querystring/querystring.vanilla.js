modules.define('querystring', function(provide) {

var hasOwnProperty = Object.prototype.hasOwnProperty,
    // Equivalency table for cp1251 and utf8.
    map = { '%D0': '%D0%A0','%C0': '%D0%90','%C1': '%D0%91','%C2': '%D0%92','%C3': '%D0%93','%C4': '%D0%94','%C5': '%D0%95','%A8': '%D0%81','%C6': '%D0%96','%C7': '%D0%97','%C8': '%D0%98','%C9': '%D0%99','%CA': '%D0%9A','%CB': '%D0%9B','%CC': '%D0%9C','%CD': '%D0%9D','%CE': '%D0%9E','%CF': '%D0%9F','%D1': '%D0%A1','%D2': '%D0%A2','%D3': '%D0%A3','%D4': '%D0%A4','%D5': '%D0%A5','%D6': '%D0%A6','%D7': '%D0%A7','%D8': '%D0%A8','%D9': '%D0%A9','%DA': '%D0%AA','%DB': '%D0%AB','%DC': '%D0%AC','%DD': '%D0%AD','%DE': '%D0%AE','%DF': '%D0%AF','%E0': '%D0%B0','%E1': '%D0%B1','%E2': '%D0%B2','%E3': '%D0%B3','%E4': '%D0%B4','%E5': '%D0%B5','%B8': '%D1%91','%E6': '%D0%B6','%E7': '%D0%B7','%E8': '%D0%B8','%E9': '%D0%B9','%EA': '%D0%BA','%EB': '%D0%BB','%EC': '%D0%BC','%ED': '%D0%BD','%EE': '%D0%BE','%EF': '%D0%BF','%F0': '%D1%80','%F1': '%D1%81','%F2': '%D1%82','%F3': '%D1%83','%F4': '%D1%84','%F5': '%D1%85','%F6': '%D1%86','%F7': '%D1%87','%F8': '%D1%88','%F9': '%D1%89','%FA': '%D1%8A','%FB': '%D1%8B','%FC': '%D1%8C','%FD': '%D1%8D','%FE': '%D1%8E','%FF': '%D1%8F' };

function addParam(res, name, val) {
    /* jshint eqnull: true */
    res.push(encodeURIComponent(name) + '=' + (val == null? '' : encodeURIComponent(val)));
}

function convert(str) {
    // Symbol code in cp1251 (hex) : symbol code in utf8)
    return str.replace(
        /%.{2}/g,
        function($0) {
            return map[$0];
        });
}

function decode(fn, str) {
    var res = '';
    // try/catch block for getting the encoding of the source string
    // error is thrown if a non-UTF8 string is input
    // if the string was not decoded, it is returned without changes
    try {
        res = fn(str);
    }
    catch(e) {
        res = fn(convert(str));
    }

    return res;
}

provide({
    /**
     * Parse a query string to an object.
     *
     * @param {String} str
     * @returns {Object}
     */
    parse : function (str) {
        if(!str) {
            return {};
        }

        return str.split('&').reduce(
            function(res, pair) {
                if(!pair) {
                    return res;
                }

                var eq = pair.indexOf('='),
                    name, val;

                if(eq >= 0) {
                    name = pair.substr(0, eq);
                    val = pair.substr(eq + 1);
                }
                else {
                    name = pair;
                    val = '';
                }

                name = decodeURIComponent(name);
                val = decodeURIComponent(val);

                hasOwnProperty.call(res, name)?
                    Array.isArray(res[name])?
                        res[name].push(val) :
                        res[name] = [res[name], val] :
                    res[name] = val;

                return res;
            },
            {});
    },

    /**
     * Serialize an object to a query string.
     *
     * @param {Object} obj
     * @returns {String}
     */
    stringify : function(obj) {
        return Object.keys(obj)
            .reduce(
                function(res, name) {
                    var val = obj[name];
                    Array.isArray(val)?
                        val.forEach(function(val) {
                            addParam(res, name, val);
                        }) :
                        addParam(res, name, val);
                    return res;
                },
                [])
            .join('&');
    },

    decodeURI : function(str) {
        return decode(decodeURI, str);
    },

    decodeURIComponent : function(str) {
        return decode(decodeURIComponent, str);
    }
});

});