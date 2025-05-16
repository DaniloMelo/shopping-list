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

  await prisma.product.createMany({
    data: [
      {
        id: "393d179d-d9a2-4fa7-a4b3-c10509158c7b",
        productName: "Guitarra Gibson Les Paul 1980 - Black Beauty",
        productPrice: 501230,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "ba344724-6a21-4964-ac6b-14afd09fb2ee",
        productName: "Guitarra Gibson Flying V 1979 - Kirk Hammett",
        productPrice: 1003210,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "0ea85a63-0f34-4d02-a1d1-dc0bbe32b9a6",
        productName: "Guitarra Fender Stratocaster - Stevie Ray Vaughan",
        productPrice: 270000,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "b894aaf2-179a-4b94-82fa-8e6a76a7a439",
        productName: "Guitarra Ibanez Apex 7 cordas",
        productPrice: 184990,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "a1db38cf-b45c-49b9-99ea-0db04a56eacf",
        productName: "Guitarra Dean Dime Slime",
        productPrice: 190000,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "dce0e89f-ab62-43da-8673-91bb3c1d6a57",
        productName: "Jackson Rhoads Flying V RRT-5",
        productPrice: 270000,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "968cbfaf-e538-47a7-8ed1-afeba4ac33c6",
        productName: "Palheta",
        productPrice: 50,
        productQuantity: 10,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "3ac0d59f-9036-4504-9583-6bbb46f1052a",
        productName: "Encordoamento 0.09 Elixir",
        productPrice: 11499,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "67a6d42c-680c-49cc-a42d-39dba27882fa",
        productName: "Cabo 10 metros",
        productPrice: 9999,
        productQuantity: 2,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "9bf0bb7e-2be3-4ac8-8193-e31688967b90",
        productName: "Inteface de Áudio",
        productPrice: 15000,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "d15dc2df-8976-4ed8-a74d-b8e6ea0191c2",
        productName: "Fone Audio Tecnica",
        productPrice: 149999,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
      },
      {
        id: "ecbcd393-c94b-4548-9af0-ff26ab97ed62",
        productName: "Pedaleira Quad Cortex",
        productPrice: 250000,
        productQuantity: 1,
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
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
