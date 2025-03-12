/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        id: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
        name: "John Doe",
        email: "john@email.com",
        password: "$2a$12$UvgZd12sn9cud3P3b1PhCudZyddRIKXNusEs0Bv1D2ZJZcoVhqfAO",
      },
      {
        id: "7375567e-2f02-4fe5-8fe5-1233c3986c9f",
        name: "Jane Doe",
        email: "jane@email.com",
        password: "$2a$12$zfEZHc5CDEnR9ld7EbUGTezodCPuJx1W8Ogs7nUVSeT4RzLCR1Wdy",
      },
    ],
  });

  await prisma.shoppingList.createMany({
    data: [
      {
        id: "393d179d-d9a2-4fa7-a4b3-c10509158c7b",
        productName: "Guitarra Gibson Les Paul 1980 - Black Beauty",
        productPrice: 50.123,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "ba344724-6a21-4964-ac6b-14afd09fb2ee",
        productName: "Guitarra Gibson Flying V 1979 - Kirk Hammett",
        productPrice: 100.321,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "0ea85a63-0f34-4d02-a1d1-dc0bbe32b9a6",
        productName: "Guitarra Fender Stratocaster - Stevie Ray Vaughan",
        productPrice: 27.11,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "33785601-03c3-4a81-b092-fb5bc7c1bf99",
        productName: "Caderno",
        productPrice: 24.9,
        productQuantity: 1,
        userId: "7375567e-2f02-4fe5-8fe5-1233c3986c9f",
      },
      {
        id: "f02eb1ba-c935-49c1-a310-8c4756738aa8",
        productName: "Caneta Azul",
        productPrice: 2.5,
        productQuantity: 3,
        userId: "7375567e-2f02-4fe5-8fe5-1233c3986c9f",
      },
      {
        id: "b30e2f97-04fc-4658-bb5e-7186884f9cda",
        productName: "Lápis",
        productPrice: 1.99,
        productQuantity: 2,
        userId: "7375567e-2f02-4fe5-8fe5-1233c3986c9f",
      },
      {
        id: "b9c565fe-2c5f-4646-bd14-f996f95a6f90",
        productName: "Borracha",
        productPrice: 4.5,
        productQuantity: 1,
        userId: "7375567e-2f02-4fe5-8fe5-1233c3986c9f",
      },
      {
        id: "73a785fa-a813-4be6-be75-b73733dcf01a",
        productName: "Mochila",
        productPrice: 99.99,
        productQuantity: 1,
        userId: "7375567e-2f02-4fe5-8fe5-1233c3986c9f",
      },
    ],
  });
}

seed()
  .then(() => {
    console.log("\n Database Seeded.");
  })
  .catch((e) => {
    console.error("Error on seeding database: ", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
