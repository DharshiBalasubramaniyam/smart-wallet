import { Schema, model, Document } from 'mongoose';

interface ISubCategory {
   _id: Schema.Types.ObjectId;
  name: string;
  color: string; // hex code
}

export interface ICategory extends Document {
  parentCategory: string;
  subCategories: ISubCategory[];
  color: string,
}

const SubCategorySchema = new Schema<ISubCategory>({
  name: { type: String, required: true },
  color: { type: String, required: true }
});

const CategorySchema = new Schema<ICategory>({
  parentCategory: { type: String, required: true },
  subCategories: { type: [SubCategorySchema], default: [] },
  color: { type: String, required: true }
}, {
  timestamps: true
});

const Category = model<ICategory>('Category', CategorySchema);

export default Category;


// Sample category data
const categories: any = [
  {"parentCategory":"Miscellaneous","color":"#9E9E9E","subCategories":[{"name":"fee & charge","color":"#FF9800"},{"name":"tax","color":"#E91E63"},{"name":"bills","color":"#03A9F4"},{"name":"interest","color":"#4CAF50"},{"name":"donations","color":"#9C27B0"},{"name":"fines & penalties","color":"#F44336"},{"name":"subscriptions","color":"#00BCD4"},{"name":"gifts","color":"#FFC107"},{"name":"one-time purchases","color":"#8BC34A"},{"name":"transfer","color":"#8BC34A"}]},
  {"parentCategory":"loan","color":"#a8326d","subCategories":[{"name":"principal","color":"#6b32a8"},{"name":"interest","color":"#32a89c"},{"name":"repayment","color":"#a86532"}]},
  {
    parentCategory: "Food & Drinks",
    color: "#FF5733",
    subCategories: [
      { name: "Groceries", color: "#FF5733" },
      { name: "Restaurants", color: "#33FF57" },
      { name: "Coffee & Tea", color: "#3357FF" }
    ]
  },
  {
    parentCategory: "Shopping",
    color: "#FF33A8",
    subCategories: [
      { name: "Clothing", color: "#FF33A8" },
      { name: "Electronics", color: "#33FFF6" },
      { name: "Accessories", color: "#F6FF33" }
    ]
  },
  {
    parentCategory: "Housing",
    color: "#8E44AD",
    subCategories: [
      { name: "Rent", color: "#8E44AD" },
      { name: "Utilities", color: "#3498DB" },
      { name: "Maintenance", color: "#E67E22" }
    ]
  },
  {
    parentCategory: "Transport",
    color: "#2ECC71",
    subCategories: [
      { name: "Public Transport", color: "#2ECC71" },
      { name: "Fuel", color: "#E74C3C" },
      { name: "Taxi / Ride Share", color: "#F1C40F" }
    ]
  },
  {
    parentCategory: "Income",
    color: "#1ABC9C",
    subCategories: [
      { name: "Salary", color: "#1ABC9C" },
      { name: "Freelance", color: "#9B59B6" },
      { name: "Investments", color: "#34495E" }
    ]
  },
  {
    parentCategory: "Entertainment",
    color: "#FF8C00",
    subCategories: [
      { name: "Movies", color: "#FF8C00" },
      { name: "Concerts", color: "#FF1493" },
      { name: "Games", color: "#00CED1" }
    ]
  },
  {
    parentCategory: "Education",
    color: "#8B0000",
    subCategories: [
      { name: "Books", color: "#8B0000" },
      { name: "Courses", color: "#006400" },
      { name: "Workshops", color: "#4B0082" }
    ]
  }
];

export async function seedCategories() {
  try {
    await Category.deleteMany({});

    // Insert categories
    const inserted = await Category.insertMany(categories);
    console.log('Categories inserted successfully:', inserted);

  } catch (err) {
    console.error('Error seeding categories:', err);
  }
}

// export seedCategories();


