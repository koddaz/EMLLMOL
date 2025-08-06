// Clarifai food mapping for ingredient detection
export const CLARIFAI_FOOD_MAPPING: { [key: string]: { name: string, carbsPer100g: number, weight: number, category: string, ignore?: boolean, note?: string } } = {
  "apple": { "name": "Apple", "carbsPer100g": 14, "weight": 180, "category": "fruit" },
  "banana": { "name": "Banana", "carbsPer100g": 23, "weight": 120, "category": "fruit" },
  "orange": { "name": "Orange", "carbsPer100g": 12, "weight": 150, "category": "fruit" },
  "lemon": { "name": "Lemon", "carbsPer100g": 9, "weight": 60, "category": "fruit" },
  "lime": { "name": "Lime", "carbsPer100g": 11, "weight": 50, "category": "fruit" },
  "grape": { "name": "Grape", "carbsPer100g": 16, "weight": 150, "category": "fruit" },
  "strawberry": { "name": "Strawberry", "carbsPer100g": 8, "weight": 100, "category": "fruit" },
  "blueberry": { "name": "Blueberry", "carbsPer100g": 14, "weight": 100, "category": "fruit" },
  "raspberry": { "name": "Raspberry", "carbsPer100g": 12, "weight": 100, "category": "fruit" },
  "blackberry": { "name": "Blackberry", "carbsPer100g": 10, "weight": 100, "category": "fruit" },
  "pineapple": { "name": "Pineapple", "carbsPer100g": 13, "weight": 200, "category": "fruit" },
  "mango": { "name": "Mango", "carbsPer100g": 15, "weight": 200, "category": "fruit" },
  "kiwi": { "name": "Kiwi", "carbsPer100g": 15, "weight": 70, "category": "fruit" },
  "peach": { "name": "Peach", "carbsPer100g": 10, "weight": 150, "category": "fruit" },
  "pear": { "name": "Pear", "carbsPer100g": 15, "weight": 180, "category": "fruit" },
  "cherry": { "name": "Cherry", "carbsPer100g": 16, "weight": 100, "category": "fruit" },
  "watermelon": { "name": "Watermelon", "carbsPer100g": 8, "weight": 300, "category": "fruit" },
  "melon": { "name": "Melon", "carbsPer100g": 8, "weight": 250, "category": "fruit" },

  "broccoli": { "name": "Broccoli", "carbsPer100g": 7, "weight": 150, "category": "vegetable" },
  "carrot": { "name": "Carrot", "carbsPer100g": 10, "weight": 100, "category": "vegetable" },
  "potato": { "name": "Potato", "carbsPer100g": 17, "weight": 150, "category": "vegetable" },
  "sweet potato": { "name": "Sweet Potato", "carbsPer100g": 20, "weight": 150, "category": "vegetable" },
  "tomato": { "name": "Tomato", "carbsPer100g": 4, "weight": 120, "category": "vegetable" },
  "cucumber": { "name": "Cucumber", "carbsPer100g": 4, "weight": 100, "category": "vegetable" },
  "bell pepper": { "name": "Bell Pepper", "carbsPer100g": 6, "weight": 150, "category": "vegetable" },
  "pepper": { "name": "Pepper", "carbsPer100g": 6, "weight": 150, "category": "vegetable" },
  "lettuce": { "name": "Lettuce", "carbsPer100g": 3, "weight": 50, "category": "vegetable" },
  "spinach": { "name": "Spinach", "carbsPer100g": 4, "weight": 30, "category": "vegetable" },
  "onion": { "name": "Onion", "carbsPer100g": 9, "weight": 100, "category": "vegetable" },
  "garlic": { "name": "Garlic", "carbsPer100g": 33, "weight": 10, "category": "vegetable" },
  "cabbage": { "name": "Cabbage", "carbsPer100g": 6, "weight": 100, "category": "vegetable" },
  "cauliflower": { "name": "Cauliflower", "carbsPer100g": 5, "weight": 100, "category": "vegetable" },
  "zucchini": { "name": "Zucchini", "carbsPer100g": 3, "weight": 150, "category": "vegetable" },
  "eggplant": { "name": "Eggplant", "carbsPer100g": 6, "weight": 200, "category": "vegetable" },
  "corn": { "name": "Corn", "carbsPer100g": 19, "weight": 100, "category": "vegetable" },
  "peas": { "name": "Peas", "carbsPer100g": 14, "weight": 80, "category": "vegetable" },
  "green beans": { "name": "Green Beans", "carbsPer100g": 7, "weight": 100, "category": "vegetable" },
  "asparagus": { "name": "Asparagus", "carbsPer100g": 4, "weight": 100, "category": "vegetable" },
  "mushroom": { "name": "Mushroom", "carbsPer100g": 3, "weight": 100, "category": "vegetable" },
  "avocado": { "name": "Avocado", "carbsPer100g": 9, "weight": 200, "category": "fruit" },

  "bread": { "name": "Bread", "carbsPer100g": 49, "weight": 50, "category": "grain" },
  "rice": { "name": "Rice", "carbsPer100g": 28, "weight": 200, "category": "grain" },
  "pasta": { "name": "Pasta", "carbsPer100g": 31, "weight": 150, "category": "grain" },
  "noodles": { "name": "Noodles", "carbsPer100g": 25, "weight": 150, "category": "grain" },
  "cereal": { "name": "Cereal", "carbsPer100g": 78, "weight": 30, "category": "grain" },
  "oatmeal": { "name": "Oatmeal", "carbsPer100g": 12, "weight": 200, "category": "grain" },
  "quinoa": { "name": "Quinoa", "carbsPer100g": 22, "weight": 150, "category": "grain" },
  "pizza": { "name": "Pizza", "carbsPer100g": 30, "weight": 200, "category": "main_dish" },
  "sandwich": { "name": "Sandwich", "carbsPer100g": 25, "weight": 150, "category": "main_dish" },
  "burger": { "name": "Burger", "carbsPer100g": 28, "weight": 200, "category": "main_dish" },
  "hot dog": { "name": "Hot Dog", "carbsPer100g": 15, "weight": 100, "category": "main_dish" },
  "taco": { "name": "Taco", "carbsPer100g": 20, "weight": 120, "category": "main_dish" },
  "burrito": { "name": "Burrito", "carbsPer100g": 18, "weight": 250, "category": "main_dish" },

  "chicken": { "name": "Chicken", "carbsPer100g": 0, "weight": 150, "category": "protein" },
  "beef": { "name": "Beef", "carbsPer100g": 0, "weight": 150, "category": "protein" },
  "pork": { "name": "Pork", "carbsPer100g": 0, "weight": 150, "category": "protein" },
  "fish": { "name": "Fish", "carbsPer100g": 0, "weight": 150, "category": "protein" },
  "salmon": { "name": "Salmon", "carbsPer100g": 0, "weight": 150, "category": "protein" },
  "tuna": { "name": "Tuna", "carbsPer100g": 0, "weight": 150, "category": "protein" },
  "egg": { "name": "Egg", "carbsPer100g": 1, "weight": 50, "category": "protein" },
  "beans": { "name": "Beans", "carbsPer100g": 23, "weight": 100, "category": "protein" },
  "tofu": { "name": "Tofu", "carbsPer100g": 2, "weight": 100, "category": "protein" },
  "nuts": { "name": "Nuts", "carbsPer100g": 16, "weight": 30, "category": "protein" },
  
  "milk": { "name": "Milk", "carbsPer100g": 5, "weight": 240, "category": "dairy" },
  "cheese": { "name": "Cheese", "carbsPer100g": 1, "weight": 30, "category": "dairy" },
  "yogurt": { "name": "Yogurt", "carbsPer100g": 4, "weight": 150, "category": "dairy" },
  "butter": { "name": "Butter", "carbsPer100g": 1, "weight": 10, "category": "dairy" },
  "cream": { "name": "Cream", "carbsPer100g": 3, "weight": 30, "category": "dairy" },
  "ice cream": { "name": "Ice Cream", "carbsPer100g": 24, "weight": 100, "category": "dessert" },

  "cake": { "name": "Cake", "carbsPer100g": 45, "weight": 100, "category": "dessert" },
  "cookie": { "name": "Cookie", "carbsPer100g": 68, "weight": 15, "category": "dessert" },
  "donut": { "name": "Donut", "carbsPer100g": 50, "weight": 70, "category": "dessert" },
  "chocolate": { "name": "Chocolate", "carbsPer100g": 46, "weight": 25, "category": "dessert" },
  "candy": { "name": "Candy", "carbsPer100g": 85, "weight": 20, "category": "dessert" },
  "pie": { "name": "Pie", "carbsPer100g": 35, "weight": 120, "category": "dessert" },

  "coffee": { "name": "Coffee", "carbsPer100g": 0, "weight": 240, "category": "beverage" },
  "tea": { "name": "Tea", "carbsPer100g": 0, "weight": 240, "category": "beverage" },
  "juice": { "name": "Juice", "carbsPer100g": 11, "weight": 240, "category": "beverage" },
  "soda": { "name": "Soda", "carbsPer100g": 11, "weight": 240, "category": "beverage" },
  "beer": { "name": "Beer", "carbsPer100g": 4, "weight": 350, "category": "beverage" },
  "wine": { "name": "Wine", "carbsPer100g": 4, "weight": 150, "category": "beverage" },

  "french fries": { "name": "French Fries", "carbsPer100g": 43, "weight": 100, "category": "snack" },
  "chips": { "name": "Chips", "carbsPer100g": 54, "weight": 30, "category": "snack" },
  "popcorn": { "name": "Popcorn", "carbsPer100g": 78, "weight": 25, "category": "snack" },
  "crackers": { "name": "Crackers", "carbsPer100g": 71, "weight": 20, "category": "snack" }
};

export const CLARIFAI_ESTIMATES: { [key: string]: { name: string, carbsPer100g: number, weight: number, category: string } } = {
  "fruit_mixed": { "name": "Mixed Fruits", "carbsPer100g": 12, "weight": 150, "category": "fruit" },
  "vegetable_mixed": { "name": "Mixed Vegetables", "carbsPer100g": 8, "weight": 150, "category": "vegetable" },
  "grain_item": { "name": "Grain Product", "carbsPer100g": 35, "weight": 100, "category": "grain" },
  "protein_item": { "name": "Protein Source", "carbsPer100g": 2, "weight": 120, "category": "protein" },
  "dairy_item": { "name": "Dairy Product", "carbsPer100g": 4, "weight": 100, "category": "dairy" },
  "dessert_item": { "name": "Dessert", "carbsPer100g": 45, "weight": 80, "category": "dessert" },
  "beverage_item": { "name": "Beverage", "carbsPer100g": 6, "weight": 240, "category": "beverage" }
};

// Clarifai configuration
export const CLARIFAI_CONFIG = {
  PAT: '75944bc5ff1c43b8a8945dbeee89cd37', // Ersätt med din Clarifai PAT
  USER_ID: 'baug1zchlvxx',
  APP_ID: 'emilieMol',
  MODEL_ID: 'food-item-recognition',
  MODEL_VERSION_ID: '1d5fd481e0cf4826aa72ec3ff049e044',
};

export interface DetectedFood {
  item: string;
  confidence: number;
  estimatedWeight: number;
  carbContent: number;
  originalClassName: string;
  category: string;
}