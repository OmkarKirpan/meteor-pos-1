export default `
    type Category {
        _id: String
        name: String
        status: Int
    }

    type CategoryEvent {
        CategoryCreated: Category
        CategoryUpdated: Category
        CategoryActivated: Category
        CategoryInactivated: Category
    }
`;
