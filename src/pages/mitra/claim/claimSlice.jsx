import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoading: false,
	listData: [],
	typeClaim: [],
	listClaim: [],
	detailClaim: {},
	newLampiran: [],
	newDocument: [],
	detailLampiran: [],
    listProduk: [],
};

const claimSlice = createSlice({
	name: "claim",
	initialState,
	reducers: {
		setResetClaimState: () => initialState,
		setListData(state, action) {
			state.listData = action.payload;
		},
		setTypeClaim(state, action) {
			let data = [];
			if (action.payload) {
				if (action.payload.length > 0) {
					data = action.payload.map(item => {
						return { value: item.CODE_ID, label: item.SHORT_DESC };
					});
				}
			}
			state.typeClaim = data;
		},
		setListClaim(state, action) {
			state.listClaim = action.payload;
		},
		setLoading(state, action) {
			state.isLoading = action.payload;
		},
		setDetailClaim(state, action) {
			state.detailClaim = action.payload;
		},
		setNewLampiranResult(state, action) {
			state.newLampiran = action.payload;
		},
		resetNewLampiran(state) {
			state.newLampiran = [];
		},
        resetListProduk(state) {
            state.listProduk = [];
        },
        setListProdukResult(state, action) {
            state.listProduk = action.payload;
        },		
		setDocumentClaim(state, action) {
			const { key, data } = action.payload;
			let foundDocument = state.newDocument.findIndex(doc => doc.key === key);
            if(foundDocument !== -1) {
                console.log("document found");
                state.newDocument[foundDocument].data = data;
            }
            else {
                console.log("document not found");
                state.newDocument.push({ key, data });
            } 
			state.newDocument = state.newDocument.filter(item => item.data !== null);
		},
		resetNewDocumentClaim(state) {
			state.newDocument = [];
		},
		setDetailLampiranClaimResult(state, action) {
			state.detailLampiran = action.payload;
		},
		resetDetailLampiranClaim(state) {
			state.detailLampiran = [];
		}
	}
});

export const { setResetClaimState, setListData, setTypeRoom, setListClaim, setDetailClaim, setLoading,
	setNewLampiranResult, resetNewLampiran, setDocumentClaim, resetNewDocumentClaim,
	setDetailLampiranClaimResult, resetDetailLampiranClaim, resetListProduk, setListProdukResult } = claimSlice.actions;

export default claimSlice.reducer;
