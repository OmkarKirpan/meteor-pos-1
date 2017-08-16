import { ENTITYSTATUS } from "../../../constants";
import commands from "../commands/";
import events from "../events";

const { CreateBrand, UpdateBrand } = commands;

const { BrandCreated, BrandUpdated } = events;

const Brand = Space.eventSourcing.Aggregate.extend("Brand", {
    fields: {
        _id: String,
        name: String,
        entityStatus: Number,
        createdAt: Date,
        updatedAt: Date
    },

    commandMap() {
        return {
            [CreateBrand]: this._createBrand,
            [UpdateBrand]: this._updateBrand
        };
    },

    eventMap() {
        return {
            [BrandCreated]: this._onBrandCreated,
            [BrandUpdated]: this._onBrandUpdated
        };
    },

    // ============= COMMAND HANDLERS =============

    _createBrand(command) {
        this.record(
            new BrandCreated({
                ...this._eventPropsFromCommand(command),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        );
    },

    _updateBrand(command) {
        this.record(
            new BrandUpdated({
                ...this._eventPropsFromCommand(command),
                updatedAt: new Date()
            })
        );
    },

    // ============= EVENT HANDLERS ============

    _onBrandCreated(event) {
        this._assignFields(event);
        this.entityStatus = ENTITYSTATUS.ACTIVE;
    },

    _onBrandUpdated(event) {
        this._assignFields(event);
    }
});

Brand.registerSnapshotType("BrandSnapshot");

export default Brand;
