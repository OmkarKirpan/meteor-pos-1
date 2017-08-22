import { APP } from "../actionTypes";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import thunk from "redux-thunk";
import { toggleSidebar } from ".";

if (Meteor.isClient) {
    describe("App actions", function() {
        const mockStore = configureMockStore([thunk]);
        const store = mockStore({});

        it("toggleSidebar should dispatch an action with type APP.TOGGLE_SIDEBAR", function() {
            const expectedActions = [
                {
                    type: APP.TOGGLE_SIDEBAR
                }
            ];

            store.dispatch(toggleSidebar());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
}
