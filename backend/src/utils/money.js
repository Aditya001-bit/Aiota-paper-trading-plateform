function weightedAverageCost({ currentQuantity, currentAverageCostPaise, buyQuantity, executionPricePaise }) { return Math.round(((currentQuantity * currentAverageCostPaise) + (buyQuantity * executionPricePaise)) / (currentQuantity + buyQuantity)); }
function realisedPnl({ averageCostPaise, executionPricePaise, quantity }) { return (executionPricePaise - averageCostPaise) * quantity; }
module.exports = { weightedAverageCost, realisedPnl };
