const find = function(origin) {
    if(this === undefined || this.constructor !== find) {
        return new find(origin)
    }
    this.origin = origin;
    this.result = null;
    return this;
}
find.prototype.where = function (condition) {
    Object.keys(condition).forEach(key => {
        if(!this.result) {
            this.result = this.origin.filter(item => {
                return condition[key].exec(item[key])
            });
        } else {
            this.result = this.result.filter(item => {
                return condition[key].exec(item[key])
            })
        }
    })
    return this;
}
find.prototype.orderBy = function (key, type) {
    switch (type) {
        case 'desc': {
            this.result.sort((a, b) => b[key] - a[key]);
            break;
        }
        case 'asc': {
            this.result.sort((a, b) => a[key] - b[key]);
            break;
        }
    }
    return this.result;
}

export default find;

