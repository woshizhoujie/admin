import { schema, normalize } from 'normalizr'

export const cookbookSchemaID = 'cookbooks'

export const stepSchemaID = 'steps'

export const ingredientSchemaID = 'ingredients'

export const imageSchemaID = 'images'


export const categorySchemaID = 'categories'

export const recommendSchemaID = 'recommends'

export const marketSchemaID = 'markets'

export const restaurantSchemaID = 'SchemaID'


export const materialsSchema = new schema.Entity('materials')


export const cookbooksSchema = new schema.Entity(cookbookSchemaID)

export const stepsSchema = new schema.Entity(stepSchemaID)

export const ingredientsSchema = new schema.Entity(ingredientSchemaID)

export const imagesSchema = new schema.Entity(imageSchemaID)


export const categoriesSchema = new schema.Entity(categorySchemaID)

export const recommendsSchema = new schema.Entity(recommendSchemaID)

export const marketsSchema = new schema.Entity(marketSchemaID)

export const restaurantsSchema = new schema.Entity(restaurantSchemaID )