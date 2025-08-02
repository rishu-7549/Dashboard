import { createContext, useContext, useReducer } from "react";

const DashboardContext = createContext();

const initialState = {
  widgets: [],
  selectedWidgetId: null,
  theme: "light",
  activeUsers: [],
  lastModifiedBy: null,
  isLoading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_WIDGET":
      return { ...state, widgets: [...state.widgets, action.payload] };
    case "UPDATE_WIDGET":
      return {
        ...state,
        widgets: state.widgets.map((w) =>
          w.id === action.payload.id ? { ...w, ...action.payload.data } : w
        ),
      };
    case "DELETE_WIDGET":
      const updatedWidgets = state.widgets.filter(
        (w) => w.id !== action.payload
      );
      console.log(
        `Deleting widget ${action.payload}. Remaining widgets:`,
        updatedWidgets.length
      );
      return {
        ...state,
        widgets: updatedWidgets,
        selectedWidgetId:
          state.selectedWidgetId === action.payload
            ? null
            : state.selectedWidgetId,
      };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_WIDGETS":
      return { ...state, widgets: action.payload };
    case "SET_SELECTED_WIDGET":
      return { ...state, selectedWidgetId: action.payload };
    case "SET_ACTIVE_USERS":
      return { ...state, activeUsers: action.payload };
    case "SET_LAST_MODIFIED_BY":
      return { ...state, lastModifiedBy: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "CLEAR_CANVAS":
      return {
        ...state,
        widgets: [],
        selectedWidgetId: null,
      };
    default:
      return state;
  }
}

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
