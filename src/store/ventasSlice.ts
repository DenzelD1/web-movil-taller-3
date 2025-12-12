import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FiltroCampo = "producto" | "categoria" | "region" | "mes";
export type OrdenCampo = "fecha" | "monto" | "producto" | "categoria" | "region";
export type OrdenDireccion = "asc" | "desc";
export type ChartType = "categorias" | "region" | "montoPorMes" | "topProductos" | "promedioPorCategoria";

export interface VentasUIState {
  search: string;
  filterBy: FiltroCampo;
  showPanel: boolean;
  dateFrom: string;
  dateTo: string;
  sortBy: OrdenCampo;
  sortOrder: OrdenDireccion;
  chartType: ChartType;
}

const initialState: VentasUIState = {
  search: "",
  filterBy: "producto",
  showPanel: false,
  dateFrom: "",
  dateTo: "",
  sortBy: "fecha",
  sortOrder: "desc",
  chartType: "categorias",
};

const ventasSlice = createSlice({
  name: "ventasUI",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setFilterBy(state, action: PayloadAction<FiltroCampo>) {
      state.filterBy = action.payload;
    },
    setShowPanel(state, action: PayloadAction<boolean>) {
      state.showPanel = action.payload;
    },
    setDateFrom(state, action: PayloadAction<string>) {
      state.dateFrom = action.payload;
    },
    setDateTo(state, action: PayloadAction<string>) {
      state.dateTo = action.payload;
    },
    setSortBy(state, action: PayloadAction<OrdenCampo>) {
      state.sortBy = action.payload;
    },
    setSortOrder(state, action: PayloadAction<OrdenDireccion>) {
      state.sortOrder = action.payload;
    },
    setChartType(state, action: PayloadAction<ChartType>) {
      state.chartType = action.payload;
    },
    hydrate(state, action: PayloadAction<Partial<VentasUIState>>) {
      return { ...state, ...action.payload };
    },
    reset() {
      return initialState;
    },
  },
});

export const {
  setSearch,
  setFilterBy,
  setShowPanel,
  setDateFrom,
  setDateTo,
  setSortBy,
  setSortOrder,
  setChartType,
  hydrate,
  reset,
} = ventasSlice.actions;

export default ventasSlice.reducer;
