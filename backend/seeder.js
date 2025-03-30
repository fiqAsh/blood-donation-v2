// import dotenv from "dotenv";
// dotenv.config();

// import mongoose from "mongoose";

// import Bank from "./models/bank.model.js";

// dotenv.config();

// const seedBanks = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI); // Ensure MONGO_URI is in your .env file

//     // List of blood banks inside Dhaka
//     const banks = [
//       {
//         name: "Dhaka Central Blood Bank",
//         bloodInventory: generateRandomBloodInventory(),
//         location: { latitude: 23.8103, longitude: 90.4125 }, // Dhaka center
//       },
//       {
//         name: "Bangladesh Red Crescent Blood Bank",
//         bloodInventory: generateRandomBloodInventory(),
//         location: { latitude: 23.7981, longitude: 90.4173 }, // Near Dhanmondi
//       },
//       {
//         name: "HealthCare Blood Bank",
//         bloodInventory: generateRandomBloodInventory(),
//         location: { latitude: 23.7509, longitude: 90.3935 }, // Near Mohammadpur
//       },
//       {
//         name: "Medix Blood Donation Center",
//         bloodInventory: generateRandomBloodInventory(),
//         location: { latitude: 23.7806, longitude: 90.4194 }, // Near Gulshan
//       },
//       {
//         name: "Dhaka Medical Blood Bank",
//         bloodInventory: generateRandomBloodInventory(),
//         location: { latitude: 23.727, longitude: 90.3965 }, // Near Dhaka Medical
//       },
//     ];

//     // Clear existing banks and insert new ones
//     await Bank.deleteMany({});
//     await Bank.insertMany(banks);

//     console.log("✅ Blood banks seeded successfully!");
//     mongoose.connection.close();
//   } catch (error) {
//     console.error("❌ Seeding failed:", error);
//     mongoose.connection.close();
//   }
// };

// // Function to generate random blood inventory (0-50 units per group)
// const generateRandomBloodInventory = () => {
//   return {
//     A_positive: Math.floor(Math.random() * 50),
//     A_negative: Math.floor(Math.random() * 50),
//     B_positive: Math.floor(Math.random() * 50),
//     B_negative: Math.floor(Math.random() * 50),
//     AB_positive: Math.floor(Math.random() * 50),
//     AB_negative: Math.floor(Math.random() * 50),
//     O_positive: Math.floor(Math.random() * 50),
//     O_negative: Math.floor(Math.random() * 50),
//   };
// };

// // Run the function if executed directly
// if (process.argv.includes("--seed")) {
//   seedBanks();
// }
