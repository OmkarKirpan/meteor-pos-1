export default `
    type Category {
        _id: String
        name: String
        entityStatus: Int
    }

    type CategoryEvent {
        CategoryCreated: Category
        CategoryUpdated: Category
        CategoryActivated: Category
        CategoryDeactivated: Category
    }
`;
