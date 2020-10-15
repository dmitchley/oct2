function asyncRoute(fn)  {
    return function asyncRouteWrapper(req, res, next, ...args) {
        const fnReturn = fn(req, res, next, ...args);
        return Promise.resolve(fnReturn).catch(next);
    }
}

module.exports = {
    asyncRoute
};