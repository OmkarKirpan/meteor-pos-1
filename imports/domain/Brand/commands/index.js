import CreateBrand from "./CreateBrand";
import UpdateBrand from "./UpdateBrand";

export default Space.messaging.define(Space.domain.Command, {
    CreateBrand,
    UpdateBrand
});
