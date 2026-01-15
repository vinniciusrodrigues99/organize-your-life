import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transacao } from '../../types';

interface TransacoesState {
    lista: Transacao[];
}

const initialState: TransacoesState = {
    lista: [],
};

export const transacoesSlice = createSlice({
    name: 'transacoes',
    initialState,
    reducers: {
        adicionarTransacao: (state, action: PayloadAction<Transacao>) => {
            const novoId = state.lista.length > 0 ? (Number(state.lista[state.lista.length - 1].id) + 1).toString() : '1';
            action.payload.id = novoId;
            state.lista.push(action.payload);
        },
        removerTransacao: (state, action: PayloadAction<string | undefined>) => {
            state.lista = state.lista.filter(transacao => transacao.id !== action.payload);
        }
    }   
})

export const { adicionarTransacao, removerTransacao } = transacoesSlice.actions;
export default transacoesSlice.reducer;
