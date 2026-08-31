const { weightedAverageCost, realisedPnl } = require("./money");
test("calculates a weighted-average purchase cost in whole paise", () => { expect(weightedAverageCost({ currentQuantity: 2, currentAverageCostPaise: 10000, buyQuantity: 3, executionPricePaise: 12000 })).toBe(11200); });
test("calculates realised profit and loss without floating point money", () => { expect(realisedPnl({ averageCostPaise: 11200, executionPricePaise: 13000, quantity: 3 })).toBe(5400); expect(realisedPnl({ averageCostPaise: 11200, executionPricePaise: 10000, quantity: 2 })).toBe(-2400); });
