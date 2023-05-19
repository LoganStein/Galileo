import { createContext } from "react";

export const initialState = { total: 0, assets: [] };

export const reducer = (state, action) => {
  switch (action.type) {
    // add an asset to the context given that it isn't already in the context
    case "ADD_ASSET":
      const assetExists = state.assets.some(
        (asset) => asset.code === action.value.code
      );
      if (!assetExists) {
        // adds the asset to the asset list and adds the value to the total value
        return {
          total: state.total + action.value.val,
          assets: [...state.assets, action.value],
        };
      } else {
        return state;
      }
    case "RESET":
      return { total: 0, assets: [] };
    default:
      return state;
  }
};
export const TotalContext = createContext({
  totalState: initialState,
  totalDispatch: () => {},
});
