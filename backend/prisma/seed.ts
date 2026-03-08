import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Create categories
    const burgers = await prisma.category.create({
        data: {
            name: "Burgers",
            slug: "burgers",
            imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        },
    });

    const drinks = await prisma.category.create({
        data: {
            name: "Drinks",
            slug: "drinks",
            imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
        },
    });

    const sides = await prisma.category.create({
        data: {
            name: "Sides & Snacks",
            slug: "sides-snacks",
            imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400",
        },
    });

    // Create products
    const products = [
        {
            name: "Premium Angus Burger",
            slug: "premium-angus-burger",
            description:
                "A massive 1/2 pound angus beef patty with melted cheddar, crisp lettuce, fresh tomatoes, and our signature secret sauce on a toasted brioche bun.",
            price: 15.99,
            imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
            categoryId: burgers.id,
        },
        {
            name: "Classic Cheeseburger",
            slug: "classic-cheeseburger",
            description:
                "Our timeless classic — juicy beef patty, American cheese, pickles, onions, ketchup, and mustard on a sesame seed bun.",
            price: 9.99,
            imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600",
            categoryId: burgers.id,
        },
        {
            name: "Spicy Chicken Burger",
            slug: "spicy-chicken-burger",
            description:
                "Crispy fried chicken breast with spicy mayo, jalapenos, and coleslaw on a brioche bun.",
            price: 12.49,
            imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600",
            categoryId: burgers.id,
        },
        {
            name: "Strawberry Milkshake",
            slug: "strawberry-milkshake",
            description:
                "Thick and creamy milkshake made with real strawberries and vanilla ice cream, topped with whipped cream.",
            price: 6.99,
            imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600",
            categoryId: drinks.id,
        },
        {
            name: "Fresh Lemonade",
            slug: "fresh-lemonade",
            description:
                "House-made lemonade with fresh lemons, a hint of mint, and just the right amount of sweetness.",
            price: 4.49,
            imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600",
            categoryId: drinks.id,
        },
        {
            name: "Loaded Fries",
            slug: "loaded-fries",
            description:
                "Golden crispy fries topped with melted cheese, bacon bits, sour cream, and chives.",
            price: 7.99,
            imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600",
            categoryId: sides.id,
        },
        {
            name: "Onion Rings",
            slug: "onion-rings",
            description:
                "Thick-cut onion rings coated in our crispy seasoned batter, served with ranch dipping sauce.",
            price: 5.99,
            imageUrl: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600",
            categoryId: sides.id,
        },
        {
            name: "Mozzarella Sticks",
            slug: "mozzarella-sticks",
            description:
                "Six golden-fried mozzarella sticks served with marinara dipping sauce.",
            price: 6.49,
            imageUrl: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=600",
            categoryId: sides.id,
        },
    ];

    for (const product of products) {
        await prisma.product.create({ data: product });
    }

    console.log(`✅ Seeded ${products.length} products across 3 categories`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seed error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
