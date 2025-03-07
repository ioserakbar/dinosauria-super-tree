export class Generic{
    constructor() {
        const handler = {
            get: function (obj, prop) {
                return typeof obj[prop] !== "function"
                    ? obj[prop]
                    : function (...args) {
                        this.milisecondsStart = new Date().getTime();
                        var result = obj[prop].apply(obj, args);
                        obj.basicLogger(prop, obj.constructor.name);
                        return result;
                    };
            },
        };
        return new Proxy(this, handler);
    }

    basicLogger(prop, obj){
        var milisecondsPassed = new Date().getTime() - this.milisecondsStart;
        console.log("%s%c%s%c%s%c%s%c%s", 'Function ', 
            'font-style: italic; color: green; text-decoration: underline;', prop + '()', 
            'font-style: normal;', ' from ', 
            'font-style: italic; color: red; text-decoration: underline;', obj, 
            'font-style: normal;', ' executed in ' + milisecondsPassed + 'ms'
        );
    }
}

