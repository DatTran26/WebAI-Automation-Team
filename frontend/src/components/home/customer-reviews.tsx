import { Star, Quote } from "lucide-react"
import Image from "next/image"

const REVIEWS = [
    {
        id: 1,
        author: "Sarah J.",
        location: "Singapore",
        rating: 5,
        content: "The Robusta coffee from Da Lat is unlike anything I've tasted. Bold, chocolatey, and perfectly roasted. It's now my daily ritual.",
        product: "Premium Robusta Roast",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbDDn0Ry5mOXJGMR_j9doM_nsH-vUg5Iah_-UwLvaGRVj4411nooLGh4vux3PavOyYsa9Vpca1SGnfHpj2_pCTf-sW6wlqgHcG31k7MAlwtiXD9VaYgNohou0qGW7kyZFna0zOaklHG0wHVLzA9e7SpjFVQSlFQlJ-rkR2N81dIrbWBIIkkHh-rlKF4GGzJjjF1uoDG2FKk6YXLWCNqKnf2GrJt1y9G2G6CmlhnKpg3QTDiSC9OokzXcPRVwxE-ba5Hbal6JlyAvEW"
    },
    {
        id: 2,
        author: "Mark T.",
        location: "London, UK",
        rating: 5,
        content: "The barrel-aged fish sauce is a game-changer for my cooking. The depth of flavor is incredible. Worth every penny.",
        product: "Barrel-Aged Fish Sauce",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ0Ix4l-8Up4xd7rFx_2bCHtJURmCr5UhBzRbs5DSzRZz8AAXGtuSkn4jWGSkCvqCXjFavRaYNbGYcqEK6cQcZ0BvpRtBCmuRjFaAIVgFXaHotqb3Mqfih3tsuSkL5ZawCZOOZrsgmTWsbpHoxkdFNU9viqRGgPsfbJ-ZTioSWoECN7PXGQVqi3Sm0uYPU_qF1SEnWXND3O9x901Og1QM340foil2CqfPDyOxzzznlo-4ScvEVTXeHXOy4g8uAE8A6RUuyleRMx57d"
    },
    {
        id: 3,
        author: "Emma L.",
        location: "Sydney, AU",
        rating: 5,
        content: "Ordered the Lotus Tea Gift Set for my mother's birthday. The packaging was so elegant and the tea quality was outstanding.",
        product: "Lotus Tea Gift Set",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuqtkGUDkqAw3hS42nWbTvTv-mMO0GMVXzYfyneBYMBz4zFdMojO8XzRy7pmWB6dtyg264ntjjRdIG8B1Qp78XdYzui4mslxNAFmK0Z04qeOq1665YUyk1vKtPwZnxMneRnDGVTEDLNNm7e_5ZMShoyTS8UPJU76rTeVN97FKuiTx4K0Laf_m8XdIE5EHNzNWnEOTjfSjEwlxGMfGw8N6XGPDgP8kJGKTgGl2kwTfQ-rVy5EJrF1jwglbJtdK_wtL4puu9k_VlGVf"
    }
]

export function CustomerReviews() {
    return (
        <section className="bg-white dark:bg-background-dark py-16">
            <div className="text-center mb-16">
                <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em] block mb-2">Voice of our Community</span>
                <h2 className="text-3xl md:text-4xl font-serif font-medium text-soft-black dark:text-white">Trusted by Food Enthusiasts</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {REVIEWS.map((review) => (
                    <div key={review.id} className="p-8 rounded-3xl bg-warm-white/30 dark:bg-white/5 border border-stone-beige/30 dark:border-white/10 relative group transition-all hover:-translate-y-1">
                        <Quote className="absolute top-6 right-8 w-10 h-10 text-brand/5 group-hover:text-brand/10 transition-colors" />
                        <div className="flex gap-1 mb-6">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-brand text-brand" />
                            ))}
                        </div>
                        <p className="text-soft-black/80 dark:text-accent/80 text-lg leading-relaxed font-light italic mb-8">
                            &quot;{review.content}&quot;
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="w-12 h-12 rounded-full overflow-hidden relative border border-stone-beige/50">
                                <Image src={review.avatar} alt={review.author} fill className="object-cover" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-soft-black dark:text-white">{review.author}</h4>
                                <p className="text-[10px] text-taupe uppercase tracking-widest">{review.location}</p>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-stone-beige/20">
                            <p className="text-[11px] text-brand font-semibold uppercase tracking-wider">Loved: {review.product}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
