import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { prisma } from "@/lib/db"
import { PlayCircle, Eye, ArrowRight, Utensils, LayoutGrid, ShieldCheck, Truck, Video, Leaf, Gift, Star } from "lucide-react"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      include: { category: { select: { name: true, slug: true } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ])

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    rating: p.rating ? Number(p.rating) : null,
  }))

  return (
    <div className="w-full flex flex-col">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-[85vh] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCi8A4o-w9GPr4roAPSu0XzRMjBUUzZPe3WDLfc46WvHzbHuGZwvTBO-FLeH-jDVLHCkzb5pOYCtdpmIUzQmd70ijgAqC-0Eg8agfQ5FkVUPsK9BIxUPyxXaMTrMK2WIJshn_68YSnftTr39cUqU_MJccMdzN2dXb5DwR66VQZ4vq_Ox9Oazavt_sxc3b76S_3Xs0lhpaY214gusMm3IcCekHcHKSMLTYxhK9f1hYq905NRa1FwWHg9S9A7HwNaLk7SPpJJBqAmOyGu')" }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1]"></div>

        <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 md:px-8 pb-16 md:pb-24 pt-32">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em]">Live from Vietnam</span>
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-serif font-medium leading-[1.05] tracking-tight">
              Authentic Flavors,<br />
              <span className="italic text-dust-rose">Curated for You.</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-light max-w-xl leading-relaxed">
              Premium Vietnamese specialty foods, carefully selected from quality ingredients and artisanal producers.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/collection" className="inline-flex items-center justify-center rounded-xl h-[52px] px-10 bg-brand hover:bg-brand-hover text-white text-sm font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl">
                Shop Collection
              </Link>
              <Link href="/live" className="inline-flex items-center justify-center rounded-xl h-[52px] px-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-medium tracking-wide transition-all backdrop-blur-sm">
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Live
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="bg-warm-white dark:bg-surface-dark border-b border-stone-beige/50">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-moss flex-shrink-0" />
              <span className="text-xs font-medium text-taupe">Verified Artisan Sources</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-moss flex-shrink-0" />
              <span className="text-xs font-medium text-taupe">Free Shipping $75+</span>
            </div>
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-moss flex-shrink-0" />
              <span className="text-xs font-medium text-taupe">Premium Gift Packaging</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-moss flex-shrink-0" />
              <span className="text-xs font-medium text-taupe">4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 w-full flex flex-col gap-20 md:gap-24 py-16 md:py-20">

        {/* ===== CATEGORIES ===== */}
        <section>
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em] block mb-2">Browse by Category</span>
            <h2 className="text-soft-black dark:text-white text-3xl md:text-4xl font-serif font-medium">Shop Our Collections</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 justify-start md:justify-center">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/collection?category=${cat.slug}`} className="group flex flex-col items-center gap-3 min-w-[130px] p-5 rounded-2xl bg-white dark:bg-surface-dark border border-stone-beige/50 dark:border-white/10 hover:border-brand/30 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl bg-brand/8 text-brand flex items-center justify-center transition-transform group-hover:scale-110">
                  <Utensils className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-soft-black dark:text-white group-hover:text-brand transition-colors text-center">{cat.name}</span>
                <span className="text-[10px] text-taupe">{cat._count.products} items</span>
              </Link>
            ))}
            <Link href="/collection" className="group flex flex-col items-center gap-3 min-w-[130px] p-5 rounded-2xl bg-white dark:bg-surface-dark border border-stone-beige/50 dark:border-white/10 hover:border-brand/30 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-stone-beige/50 text-taupe flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-brand/10 group-hover:text-brand">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-taupe group-hover:text-brand transition-colors text-center">View All</span>
            </Link>
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em] block mb-2">Handpicked for You</span>
              <h2 className="text-soft-black dark:text-white text-3xl md:text-4xl font-serif font-medium">Featured Products</h2>
            </div>
            <Link href="/collection" className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {serializedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="md:hidden mt-8 text-center">
            <Link href="/collection" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ===== LIVE SESSIONS ===== */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em]">On Air</span>
              </div>
              <h2 className="text-soft-black dark:text-white text-3xl md:text-4xl font-serif font-medium">Live Sessions</h2>
            </div>
            <Link href="/live" className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors font-serif italic">
              View all broadcasts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Card 1 */}
            <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-surface-dark border border-stone-beige/50 dark:border-white/10 hover:shadow-lg transition-all flex flex-col md:flex-row">
              <div className="relative w-full md:w-5/12 aspect-[4/5] md:aspect-auto">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhYR595XLmtzb7VRaCnhP--ZLmySw2Bi7dPom5_qcq1VzzilC4hSG7TbvH9ZKELx-IZ8aTLYFtQUW33sOBUgA9J25mrELF4y_r_HfubnlXNgA3RDyO1_L_NPJP9y_WoK9aKfN1rgRu7Sszo2dyfD6DIZSkyG0lzOdckNpHNeXXSh9KT3l8UvegkgCu_jswgPizwpWOk2IBirJtgRDZ-GWwfF4q-QPZyZXEE9t5wGv9W3PNXcbvOugDxWXAd2eJnQRqEHnq37ZiMjDu')" }}>
                </div>
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold tracking-wider px-3 py-1.5 uppercase rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl">
                  <p className="text-[10px] text-taupe uppercase tracking-wider mb-0.5">Featured Product</p>
                  <p className="font-serif font-bold text-brand text-lg">$18.99</p>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Image alt="Host" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbDDn0Ry5mOXJGMR_j9doM_nsH-vUg5Iah_-UwLvaGRVj4411nooLGh4vux3PavOyYsa9Vpca1SGnfHpj2_pCTf-sW6wlqgHcG31k7MAlwtiXD9VaYgNohou0qGW7kyZFna0zOaklHG0wHVLzA9e7SpjFVQSlFQlJ-rkR2N81dIrbWBIIkkHh-rlKF4GGzJjjF1uoDG2FKk6YXLWCNqKnf2GrJt1y9G2G6CmlhnKpg3QTDiSC9OokzXcPRVwxE-ba5Hbal6JlyAvEW" />
                  <div>
                    <span className="text-soft-black dark:text-white text-sm font-semibold">Linh Nguyen</span>
                    <p className="text-[10px] text-taupe">Live Host</p>
                  </div>
                </div>
                <h3 className="text-soft-black dark:text-white text-xl font-serif font-semibold leading-snug mb-2 group-hover:text-brand transition-colors">
                  Saigon Mornings: Premium Robusta
                </h3>
                <p className="text-taupe text-sm mb-6 leading-relaxed line-clamp-2">
                  Exclusive tasting of the finest Robusta beans from the highlands. Dark chocolate and caramel notes.
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-taupe">
                    <Eye className="w-3.5 h-3.5" /> 1.2k watching
                  </div>
                  <Link href="/live" className="px-5 py-2.5 bg-brand text-white text-xs font-semibold tracking-wide rounded-xl hover:bg-brand-hover transition-colors">
                    Join Stream
                  </Link>
                </div>
              </div>
            </div>

            {/* Live Card 2 */}
            <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-surface-dark border border-stone-beige/50 dark:border-white/10 hover:shadow-lg transition-all flex flex-col md:flex-row">
              <div className="relative w-full md:w-5/12 aspect-[4/5] md:aspect-auto">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3j57aMHa7CP_bMeTT6GvrWP3HLtJAwBRVlTP19d9QUrYfmS8q25ql-9Ish1VHNMqee9uzMGicQLOeiiuMzw4sCvgExcg1OQJqAS71aPou--8UIhbZ3kOdfX6SZACHxBvjeihy0kbNK01LOthLIlqrIiridR5AM1Aqdx_j2-4KXHLsEMCKhx3ZyFr2nhejKjAjhQ3UzxZhrGzADtvQVpDw27OMh00f6NETOiXAaSJWi-T9F8t6Qy2R732kztUXaOVHWRykCkIm0zov')" }}>
                </div>
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold tracking-wider px-3 py-1.5 uppercase rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl">
                  <p className="text-[10px] text-taupe uppercase tracking-wider mb-0.5">Featured Product</p>
                  <p className="font-serif font-bold text-brand text-lg">$32.50</p>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Image alt="Host" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ0Ix4l-8Up4xd7rFx_2bCHtJURmCr5UhBzRbs5DSzRZz8AAXGtuSkn4jWGSkCvqCXjFavRaYNbGYcqEK6cQcZ0BvpRtBCmuRjFaAIVgFXaHotqb3Mqfih3tsuSkL5ZawCZOOZrsgmTWsbpHoxkdFNU9viqRGgPsfbJ-ZTioSWoECN7PXGQVqi3Sm0uYPU_qF1SEnWXND3O9x901Og1QM340foil2CqfPDyOxzzznlo-4ScvEVTXeHXOy4g8uAE8A6RUuyleRMx57d" />
                  <div>
                    <span className="text-soft-black dark:text-white text-sm font-semibold">Chef Tuan</span>
                    <p className="text-[10px] text-taupe">Live Host</p>
                  </div>
                </div>
                <h3 className="text-soft-black dark:text-white text-xl font-serif font-semibold leading-snug mb-2 group-hover:text-brand transition-colors">
                  The Art of Banh Mi: Secret Sauce
                </h3>
                <p className="text-taupe text-sm mb-6 leading-relaxed line-clamp-2">
                  Master the perfect Banh Mi assembly. Limited edition artisanal pate and chili sauce kits available now.
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-taupe">
                    <Eye className="w-3.5 h-3.5" /> 856 watching
                  </div>
                  <Link href="/live" className="px-5 py-2.5 border border-brand text-brand hover:bg-brand hover:text-white text-xs font-semibold tracking-wide rounded-xl transition-colors">
                    Watch Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BRAND STORY / OUR PROMISE ===== */}
        <section id="our-promise" className="scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em] block mb-3">Our Promise</span>
                <h2 className="text-3xl md:text-[44px] font-serif font-medium tracking-tight text-soft-black dark:text-white leading-tight">
                  From Vietnam to Your Table,{" "}
                  <span className="italic text-brand">With Care.</span>
                </h2>
              </div>
              <p className="text-taupe text-lg leading-relaxed font-light">
                Every product is carefully selected from quality ingredients. We connect you directly with local artisans through live video, so you can see exactly where your food comes from.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-moss/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-moss" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-soft-black dark:text-white text-sm mb-1">Authentic Source</h4>
                    <p className="text-xs text-taupe leading-relaxed">Direct partnerships with verified local producers.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-moss/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-moss" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-soft-black dark:text-white text-sm mb-1">Fast Shipping</h4>
                    <p className="text-xs text-taupe leading-relaxed">Expedited logistics to ensure peak freshness.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-moss/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-moss" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-soft-black dark:text-white text-sm mb-1">Live Interaction</h4>
                    <p className="text-xs text-taupe leading-relaxed">Real-time Q&A with sellers during streams.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-moss/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5 text-moss" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-soft-black dark:text-white text-sm mb-1">Sustainable</h4>
                    <p className="text-xs text-taupe leading-relaxed">Supporting eco-friendly farming practices.</p>
                  </div>
                </div>
              </div>
              <Link href="/collection" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors mt-2 group">
                Explore Our Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative h-[450px] md:h-[550px]">
              <div className="absolute top-0 right-0 w-[80%] h-[80%] rounded-2xl overflow-hidden shadow-lg z-10">
                <Image alt="Vietnamese artisan at work" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA39yk97WjxP92c6U1F_ENZYYc2koFbgvH1CQVgvqYqyMiNglu_KjK0SwK28rLavXBA8FCivro_rG7jirWMMOFLxmogGamfgwzQNmiVQ58UAFuo3vazmnYRk-CoCD4FnKOYyFL2SzuDbvV6Sn9nojIoIm7bFoqWmUZsm7PA3s_zz_-dpNEV-q17__Whf2Ch7bA5nknt0da67ZwR6GosqPPuuWENnnGMLCXPnLzxPOenq2W3E4PJZFCmHd-NqsE_jPLmabT-jO_eG5e2" />
              </div>
              <div className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-2xl overflow-hidden shadow-lg z-20 border-4 border-ivory dark:border-background-dark">
                <Image alt="Vietnamese spices and ingredients" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhcScHSKL-PZIx4M5G41_jnlzPoABNvB5siPJS7tVNLbXB_kS96ZB3KdGPca7iXeJwEq_VL6DyhB2deGkX_sadODpSZeCfKtSpJyxfGVMwGMQ-7SPg4q-aurPIGL7gKbpAk1sUqhR0QEfCMoJtV99UzYg5Nlgh8viOKmoovKBQ_LokuoFEVY99GFEL87qEhXFRxpe7OQoegP3XxCO547mDob25lFNi-XqqNuW3Y_vAXjR8JQSk8_qbjT4A0qtoWPekM1a3luhHjF71" />
              </div>
              <div className="absolute -z-10 top-16 right-16 w-full h-full bg-dust-rose/40 dark:bg-brand/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* ===== UPCOMING STREAMS ===== */}
        <section className="bg-warm-white dark:bg-surface-dark border border-stone-beige/50 dark:border-white/10 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em] block mb-2">Schedule</span>
              <h2 className="text-soft-black dark:text-white text-2xl md:text-3xl font-serif font-medium">Upcoming Streams</h2>
            </div>
            <Link href="/live" className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors group">
              Full Schedule <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row items-center gap-5 p-5 bg-white dark:bg-background-dark rounded-xl border border-stone-beige/50 dark:border-white/10 hover:border-brand/30 hover:shadow-sm transition-all">
              <div className="flex flex-col items-center justify-center min-w-[80px] text-center">
                <span className="text-[10px] font-semibold text-brand uppercase tracking-wider">Today</span>
                <span className="text-xl font-serif font-bold text-soft-black dark:text-white">18:00</span>
              </div>
              <div className="h-12 w-12 rounded-xl border-2 border-dust-rose flex-shrink-0 overflow-hidden relative">
                <Image alt="Host" fill sizes="48px" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGuqtkGUDkqAw3hS42nWbTvTv-mMO0GMVXzYfyneBYMBz4zFdMojO8XzRy7pmWB6dtyg264ntjjRdIG8B1Qp78XdYzui4mslxNAFmK0Z04qeOq1665YUyk1vKtPwZnxMneRnDGVTEDLNNm7e_5ZMShoyTS8UPJU76rTeVN97FKuiTx4K0Laf_m8XdIE5EHNzNWnEOTjfSjEwlxGMfGw8N6XGPDgP8kJGKTgGl2kwTfQ-rVy5EJrF1jwglbJtdK_wtL4puu9k_VlGVf" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-serif font-semibold text-lg text-soft-black dark:text-white">Traditional Mooncake Making</h3>
                <p className="text-xs text-taupe">with Artisan Mai &bull; <span className="text-brand">Includes pre-order discounts</span></p>
              </div>
              <button className="px-5 py-2.5 rounded-xl bg-brand text-white hover:bg-brand-hover transition-colors text-xs font-semibold tracking-wide w-full md:w-auto">
                Set Reminder
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-5 p-5 bg-white dark:bg-background-dark rounded-xl border border-stone-beige/50 dark:border-white/10 hover:border-brand/30 hover:shadow-sm transition-all group">
              <div className="flex flex-col items-center justify-center min-w-[80px] text-center">
                <span className="text-[10px] font-semibold text-taupe uppercase tracking-wider">Tomorrow</span>
                <span className="text-xl font-serif font-bold text-taupe group-hover:text-soft-black dark:group-hover:text-white transition-colors">09:00</span>
              </div>
              <div className="h-12 w-12 rounded-xl border-2 border-stone-beige/50 flex-shrink-0 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                <Image alt="Host" fill sizes="48px" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyTRxjwuV4QXyfLFj0ht9CMPeWX_oMjPrcbrIknpZHgd0RWGh29GUbFNgdsLXe3Et7eA2nNezDQR89cBEvGe1j_ypvrxP91ndHmqN-lVxJx-Ezi6aSGNxkCX8KxKvVkhPLCuSxMxNuNbj4QmTsVYhSaqJt7sKstsgjPu1b6c7WpzSgimB2QDVntS5vpxz5S-PW6m2aX1_NG7fcd221EE1hkVG3zIYZOkEZ-KHmRsdKZs6ILgKv1bVmbSVzHROA81bB3-M3rO3aXs1H" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-serif font-semibold text-lg text-taupe group-hover:text-soft-black dark:group-hover:text-white transition-colors">Morning Coffee Rituals</h3>
                <p className="text-xs text-taupe">with Barista Hai &bull; Filter coffee sets showcase</p>
              </div>
              <button className="px-5 py-2.5 rounded-xl border border-stone-beige text-taupe group-hover:text-brand group-hover:border-brand transition-all text-xs font-semibold tracking-wide w-full md:w-auto">
                Set Reminder
              </button>
            </div>
          </div>
        </section>

        {/* ===== GIFT SETS CTA ===== */}
        <section className="relative rounded-2xl overflow-hidden">
          <div className="bg-brand p-10 md:p-16 text-center relative">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper-2.png')" }}></div>
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-white tracking-tight">
                Premium Gift Sets
              </h2>
              <p className="text-white/70 text-base font-light leading-relaxed">
                Thoughtfully packaged Vietnamese specialty collections, ideal for personal enjoyment and gifting occasions.
              </p>
              <Link href="/collection?tag=gift" className="inline-flex items-center justify-center rounded-xl h-12 px-8 bg-white text-brand text-sm font-semibold tracking-wide hover:bg-dust-rose transition-colors shadow-lg">
                Shop Gift Sets
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
