import BrandCreated from "./BrandCreated";
import BrandUpdated from "./BrandUpdated";

export default Space.messaging.define(Space.domain.Event, {
    BrandCreated,
    BrandUpdated
});
