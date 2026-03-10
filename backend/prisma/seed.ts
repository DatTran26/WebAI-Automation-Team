import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Clear existing data (order matters for FK constraints)
    await prisma.liveStreamProduct.deleteMany();
    await prisma.liveStream.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Create Vietnamese food categories
    const categories = await Promise.all([
        prisma.category.create({ data: { name: "Coffee & Tea", slug: "coffee-tea", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400" } }),
        prisma.category.create({ data: { name: "Sauces & Condiments", slug: "sauces-condiments", imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400" } }),
        prisma.category.create({ data: { name: "Sweets & Snacks", slug: "sweets-snacks", imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400" } }),
        prisma.category.create({ data: { name: "Rice & Noodles", slug: "rice-noodles", imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400" } }),
        prisma.category.create({ data: { name: "Spices & Herbs", slug: "spices-herbs", imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400" } }),
        prisma.category.create({ data: { name: "Dried Goods", slug: "dried-goods", imageUrl: "https://images.unsplash.com/photo-1599909533202-00c561ab2337?w=400" } }),
    ]);

    const [coffee, sauces, sweets, rice, spices, dried] = categories;

    // Vietnamese artisan products with new fields
    const products = [
        { name: "Authentic Robusta Roast", slug: "authentic-robusta-roast", description: "Rich, full-bodied coffee beans sourced directly from sustainable farms in the Central Highlands.", price: 24.00, imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600", categoryId: coffee.id, rating: 4.9, origin: "Da Lat Highlands", tags: ["organic", "single-origin", "bold"] },
        { name: "Highland Robusta Beans", slug: "highland-robusta-beans", description: "Bold and chocolatey profile, perfect for crafting the traditional Vietnamese drip coffee.", price: 18.00, imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=600", categoryId: coffee.id, rating: 5.0, origin: "Buon Ma Thuot", tags: ["single-origin", "bold", "traditional"] },
        { name: "Ancient Jasmine Tea", slug: "ancient-jasmine-tea", description: "Hand-picked green tea naturally scented with fresh jasmine blossoms from artisan gardens.", price: 17.50, salePrice: 35.00, imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600", categoryId: coffee.id, rating: 5.0, origin: "Thai Nguyen", tags: ["organic", "floral", "premium"] },
        { name: "Son Tinh Original Blend", slug: "son-tinh-original-blend", description: "Award-winning arabica-robusta blend with notes of dark chocolate and roasted nuts.", price: 22.00, imageUrl: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600", categoryId: coffee.id, rating: 4.7, origin: "Son La Province", tags: ["umami-rich", "award-winning", "blend"] },
        { name: "Lotus Green Tea", slug: "lotus-green-tea", description: "Delicate green tea infused with lotus flower essence, a centuries-old Vietnamese tradition.", price: 19.50, imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600", categoryId: coffee.id, rating: 4.8, origin: "Hanoi City", tags: ["floral", "traditional", "gift-set"] },
        { name: "Barrel-Aged Fish Sauce", slug: "barrel-aged-fish-sauce", description: "Premium 40N fish sauce aged in wooden barrels for a rich, deep umami flavor.", price: 12.50, imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600", categoryId: sauces.id, rating: 4.7, origin: "Phu Quoc Island", tags: ["umami-rich", "artisanal", "aged"] },
        { name: "Artisan Soy Sauce", slug: "artisan-soy-sauce", description: "Naturally brewed soy sauce fermented for 18 months using traditional Vietnamese methods.", price: 9.00, imageUrl: "https://images.unsplash.com/photo-1585672840563-f2af2ced55c9?w=600", categoryId: sauces.id, rating: 4.5, origin: "Binh Dinh", tags: ["umami-rich", "fermented", "traditional"] },
        { name: "Chili Garlic Paste", slug: "chili-garlic-paste", description: "Fiery blend of fresh red chilies and garlic, hand-ground to preserve maximum flavor.", price: 7.50, imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600", categoryId: sauces.id, rating: 4.3, origin: "Binh Thuan", tags: ["spicy", "vegan", "bold"] },
        { name: "Coconut Caramel Sauce", slug: "coconut-caramel-sauce", description: "Sweet and savory coconut caramel made with palm sugar, perfect for Kho dishes.", price: 8.50, salePrice: 12.00, imageUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600", categoryId: sauces.id, rating: 4.6, origin: "Ben Tre", tags: ["sweet", "traditional", "versatile"] },
        { name: "Lotus Seed Mooncake Set", slug: "lotus-seed-mooncake-set", description: "Traditional delicacy crafted with premium lotus paste and salted egg yolk filling.", price: 12.00, salePrice: 24.00, imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600", categoryId: sweets.id, rating: 4.8, origin: "Hanoi City", tags: ["gift-set", "traditional", "premium"] },
        { name: "Royal Jade Mooncakes", slug: "royal-jade-mooncakes", description: "Exquisite gift box featuring four artisanal flavors with double salted egg yolk.", price: 29.00, salePrice: 56.00, imageUrl: "https://images.unsplash.com/photo-1602351447937-745cb720612f?w=600", categoryId: sweets.id, rating: 4.9, origin: "Hue City", tags: ["gift-set", "premium", "luxury"] },
        { name: "Coconut Candy", slug: "coconut-candy", description: "Soft and chewy coconut candy made from fresh Ben Tre coconut milk and cane sugar.", price: 5.50, imageUrl: "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=600", categoryId: sweets.id, rating: 4.2, origin: "Ben Tre", tags: ["sweet", "traditional", "snack"] },
        { name: "Dried Mango Slices", slug: "dried-mango-slices", description: "Sun-dried mango slices with no added sugar, preserving the natural tropical sweetness.", price: 8.00, imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600", categoryId: sweets.id, rating: 4.4, origin: "Cam Ranh", tags: ["organic", "vegan", "snack"] },
        { name: "Pandan Waffle Cookies", slug: "pandan-waffle-cookies", description: "Crispy pandan-infused waffle cookies with coconut cream filling.", price: 6.50, imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600", categoryId: sweets.id, rating: 4.1, origin: "Ho Chi Minh City", tags: ["sweet", "snack", "unique"] },
        { name: "Premium Jasmine Rice", slug: "premium-jasmine-rice", description: "Fragrant long-grain jasmine rice from the Mekong Delta, known for its floral aroma.", price: 14.00, imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600", categoryId: rice.id, rating: 4.8, origin: "Mekong Delta", tags: ["organic", "staple", "premium"] },
        { name: "Artisan Rice Noodles", slug: "artisan-rice-noodles", description: "Hand-pulled rice noodles dried in the highland sun, perfect for pho and stir-fry.", price: 6.00, imageUrl: "https://images.unsplash.com/photo-1559058789-672da06263d8?w=600", categoryId: rice.id, rating: 4.5, origin: "Sa Dec", tags: ["traditional", "staple", "versatile"] },
        { name: "Black Sticky Rice", slug: "black-sticky-rice", description: "Heirloom black glutinous rice with a nutty flavor, rich in antioxidants.", price: 11.00, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600", categoryId: rice.id, rating: 4.6, origin: "Dien Bien", tags: ["organic", "gluten-free", "heirloom"] },
        { name: "Vermicelli Bundle", slug: "vermicelli-bundle", description: "Thin rice vermicelli noodles, a staple for bun cha and spring roll dishes.", price: 4.50, imageUrl: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600", categoryId: rice.id, rating: 4.3, origin: "Cu Chi", tags: ["staple", "versatile", "traditional"] },
        { name: "Phu Quoc Black Pepper", slug: "phu-quoc-black-pepper", description: "Whole black peppercorns from Phu Quoc Island with intense aroma and sharp heat.", price: 10.00, imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600", categoryId: spices.id, rating: 4.9, origin: "Phu Quoc Island", tags: ["organic", "bold", "artisanal"] },
        { name: "Star Anise Collection", slug: "star-anise-collection", description: "Whole star anise pods handpicked from Lang Son, essential for authentic pho broth.", price: 8.50, imageUrl: "https://images.unsplash.com/photo-1599909533202-00c561ab2337?w=600", categoryId: spices.id, rating: 4.7, origin: "Lang Son", tags: ["organic", "traditional", "aromatic"] },
        { name: "Cinnamon Bark Sticks", slug: "cinnamon-bark-sticks", description: "Vietnamese cassia cinnamon with bold, sweet flavor, prized by chefs worldwide.", price: 9.50, salePrice: 14.00, imageUrl: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600", categoryId: spices.id, rating: 4.8, origin: "Yen Bai", tags: ["organic", "aromatic", "premium"] },
        { name: "Lemongrass Bundle", slug: "lemongrass-bundle", description: "Fresh-dried lemongrass stalks perfect for teas, curries, and marinades.", price: 5.00, imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600", categoryId: spices.id, rating: 4.2, origin: "Ninh Thuan", tags: ["aromatic", "versatile", "vegan"] },
        { name: "Dried Shiitake Mushrooms", slug: "dried-shiitake-mushrooms", description: "Forest-grown shiitake mushrooms slowly dried to concentrate their deep umami flavor.", price: 15.00, imageUrl: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600", categoryId: dried.id, rating: 4.7, origin: "Lam Dong", tags: ["umami-rich", "organic", "vegan"] },
        { name: "Dried Shrimp", slug: "dried-shrimp", description: "Sun-dried gulf shrimp with intense savory flavor, a key ingredient in Vietnamese cuisine.", price: 13.00, imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600", categoryId: dried.id, rating: 4.5, origin: "Ca Mau", tags: ["umami-rich", "traditional", "staple"] },
        { name: "Dried Squid Snack", slug: "dried-squid-snack", description: "Seasoned dried squid strips, a beloved Vietnamese street food snack.", price: 10.50, salePrice: 15.00, imageUrl: "https://images.unsplash.com/photo-1606851094291-6efae152bb87?w=600", categoryId: dried.id, rating: 4.3, origin: "Vung Tau", tags: ["snack", "bold", "traditional"] },
        { name: "Lotus Root Chips", slug: "lotus-root-chips", description: "Thinly sliced lotus root crisps lightly salted, a unique artisanal snack.", price: 7.00, imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600", categoryId: dried.id, rating: 4.4, origin: "Dong Thap", tags: ["snack", "vegan", "unique"] },
    ];

    for (const product of products) {
        await prisma.product.create({ data: product });
    }

    console.log(`Seeded ${products.length} products across ${categories.length} categories`);
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error("Seed error:", e); await prisma.$disconnect(); process.exit(1); });
