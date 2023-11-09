import { createContext } from "react";

export const initialState = {
  acctID: "N/A",
  total: 0,
  assets: [],
  historicValue: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    // set the account ID for the context
    case "SET_ACCT":
      return {
        acctID: action.value,
        total: state.total,
        assets: state.assets,
        historicValue: state.historicValue,
      };
    // add an asset to the context given that it isn't already in the context
    case "ADD_ASSET":
      const assetExists = state.assets.some(
        (asset) => asset.code === action.value.code
      );
      if (!assetExists) {
        // adds the asset to the asset list and adds the value to the total value
        return {
          acctID: state.acctID,
          total: state.total + action.value.val,
          assets: [...state.assets, action.value],
          historicValue: state.historicValue,
        };
      } else {
        return state;
      }
    // add a historic value to the context
    case "ADD_HISTORIC_VALUE":
      return state;
    // reset the context to the initial state
    case "RESET":
      return { acctID: "N/A", total: 0, assets: [], historicValue: [] };
    default:
      return state;
  }
};
export const TotalContext = createContext({
  totalState: initialState,
  totalDispatch: () => {},
});
