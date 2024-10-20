import GetAssetValue from "./GetAssetValue";
import GetIncome, { GetIncomeFromTemplate } from "./GetIncome";

jest.mock("./GetAssetValue");

describe("GetIncome", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate income correctly for a simple case", async () => {
    const ops = [
      {
        type: "payment",
        from: "otherAccount",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        amount: "100",
        asset_code: "USD",
        asset_issuer: "issuer1",
      },
    ];
    const acctID = "testAccount";

    GetAssetValue.mockResolvedValue(100);

    const result = await GetIncome(ops, acctID);

    expect(result).toEqual({ hr: 4.166666666666667, day: 100 });
  });

  it("should exclude transactions from the same account", async () => {
    const ops = [
      {
        type: "payment",
        from: "testAccount",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        amount: "100",
        asset_code: "USD",
        asset_issuer: "issuer1",
      },
    ];
    const acctID = "testAccount";

    const result = await GetIncome(ops, acctID);

    expect(result).toEqual({ hr: 0, day: 0 });
  });

  it("should exclude transactions not from yesterday", async () => {
    const ops = [
      {
        type: "payment",
        from: "otherAccount",
        created_at: new Date().toISOString(),
        amount: "100",
        asset_code: "USD",
        asset_issuer: "issuer1",
      },
    ];
    const acctID = "testAccount";

    const result = await GetIncome(ops, acctID);

    expect(result).toEqual({ hr: 0, day: 0 });
  });

  it("should handle multiple transactions", async () => {
    const ops = [
      {
        type: "payment",
        from: "otherAccount1",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        amount: "100",
        asset_code: "USD",
        asset_issuer: "issuer1",
      },
      {
        type: "payment",
        from: "otherAccount2",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        amount: "200",
        asset_code: "USD",
        asset_issuer: "issuer2",
      },
    ];
    const acctID = "testAccount";

    GetAssetValue.mockResolvedValueOnce(100).mockResolvedValueOnce(200);

    const result = await GetIncome(ops, acctID);

    expect(result).toEqual({ hr: 12.5, day: 300 });
  });

  it("should handle native asset type", async () => {
    const ops = [
      {
        type: "payment",
        from: "otherAccount",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        amount: "100",
        asset_type: "native",
      },
    ];
    const acctID = "testAccount";

    GetAssetValue.mockResolvedValue(100);

    const result = await GetIncome(ops, acctID);

    expect(result).toEqual({ hr: 4.166666666666667, day: 100 });
  });

  it("should get Income from a template", async () => {
    const link =
      "https://horizon.stellar.org/accounts/GDSDLFKJA123SDLKFWLKJDFS12/operations{?cursor,limit,order}";

    GetAssetValue.mockResolvedValue(100);
    const ops = [
      {
        type: "payment",
        from: "otherAccount",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        amount: "100",
        asset_code: "USD",
        asset_issuer: "issuer1",
      },
    ];

    const horizonAPICall = jest.spyOn(global, "fetch").mockResolvedValue(ops);

    const result = await GetIncomeFromTemplate(link);

    expect(horizonAPICall).toHaveBeenCalledWith(
      "https://horizon.stellar.org/accounts/GDSDLFKJA123SDLKFWLKJDFS12/operations?limit=200&order=desc"
    );
    expect(result).toEqual({ hr: 4.166666666666667, day: 100 });
  });
});
