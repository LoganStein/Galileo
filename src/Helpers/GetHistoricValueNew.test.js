import { GetHistoricValue } from "./GetHistoricValueNew";

describe("GetHistoricValue", () => {
  it("should return the historic value history", async () => {
    const totalContext = {
      totalState: {
        total: 100,
        assets: [
          { code: "XLM", issuer: null },
          { code: "BTC", issuer: "issuer1" },
          { code: "ETH", issuer: "issuer2" },
        ],
      },
    };
    const days = 7;

    const valueHistory = await GetHistoricValue(totalContext, days);

    expect(valueHistory).toHaveLength(days + 1);
    expect(valueHistory[0]).toEqual({
      date: expect.any(Date),
      value: totalContext.totalState.total,
    });
    expect(valueHistory[1]).toEqual({
      date: expect.any(Date),
      value: expect.any(Number),
    });
    // Add more assertions as needed
  });

  // Add more test cases as needed
});
