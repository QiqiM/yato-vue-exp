const constDef = module.exports;


constDef.purchaseState = {
    init : 0, //未审核
    publish: 1, //发布
    stop: 2,    //终止
};

constDef.saleState = {
    publish: 1, //发布
    trade_success: 2,
    stop: 3,    //终止
};
