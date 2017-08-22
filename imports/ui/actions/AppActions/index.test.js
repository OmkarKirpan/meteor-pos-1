import { APP } from "../actionTypes";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import thunk from "redux-thunk";
import { toggleSidebar } from ".";

if (Meteor.isClient) {
    describe("Toggle sidebar action", function() {
        const mockStore = configureMockStore([thunk]);
        const store = mockStore({});

        it("dispatched action has a type of APP.TOGGLE_SIDEBAR", function() {
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
