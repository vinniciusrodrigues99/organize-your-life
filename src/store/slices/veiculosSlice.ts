import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Veiculo } from '../../types';

interface VeiculosState {
    lista: Veiculo[];
}

const initialState: VeiculosState = {
    lista: [],
};

export const veiculosSlice = createSlice({
    name: 'veiculos',
    initialState,
    reducers: {
        adicionarVeiculo: (state, action: PayloadAction<Veiculo>) => {
            const novoId = state.lista.length > 0 ? (Number(state.lista[state.lista.length - 1].id) + 1).toString() : '1';
            action.payload.id = novoId;
            state.lista.push(action.payload);
        },
        removerVeiculo: (state, action: PayloadAction<string>) => {
            state.lista = state.lista.filter(veiculo => veiculo.id !== action.payload);
        }
    }
})

export const { adicionarVeiculo, removerVeiculo } = veiculosSlice.actions;
export default veiculosSlice.reducer;