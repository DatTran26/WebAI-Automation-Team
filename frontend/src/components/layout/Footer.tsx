import Link from 'next/link'
import { Globe, Facebook, Instagram, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-charcoal text-white/90 mt-auto">
            {/* Newsletter strip */}
            <div className="bg-brand">
                <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="font-serif text-2xl md:text-3xl font-medium text-white mb-1">Stay in the Loop</h3>
                        <p className="text-white/70 text-sm font-light">Get 10% off your first order. Curated flavors, delivered weekly.</p>
                    </div>
                    <div className="flex w-full max-w-md">
                        <input
                            className="flex-1 rounded-l-xl border-none px-5 py-3.5 text-soft-black text-sm focus:ring-2 focus:ring-mustard bg-white placeholder-taupe"
                            placeholder="Your email address"
                            type="email"
                        />
                        <button className="bg-soft-black hover:bg-black text-white font-semibold py-3.5 px-6 rounded-r-xl transition-colors text-sm tracking-wide">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 pr-0 md:pr-8">
                        <div className="flex items-center gap-3 mb-5 text-white">
                            <div className="w-7 h-7 text-brand">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                                    <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <h2 className="text-white text-xl font-black leading-tight tracking-tighter uppercase">LIKEFOOD</h2>
                        </div>
                        <p className="text-sm text-white/50 mb-6 leading-relaxed">
                            Carefully selected Vietnamese specialty foods, suitable for everyday meals as well as gifting occasions. Rich in flavor and thoughtfully packaged.
                        </p>
                        <div className="flex gap-3">
                            <a className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand flex items-center justify-center text-white/60 hover:text-white transition-all" href="#" aria-label="Website">
                                <Globe className="w-4 h-4" />
                            </a>
                            <a className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand flex items-center justify-center text-white/60 hover:text-white transition-all" href="#" aria-label="Facebook">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand flex items-center justify-center text-white/60 hover:text-white transition-all" href="#" aria-label="Instagram">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand flex items-center justify-center text-white/60 hover:text-white transition-all" href="#" aria-label="Email">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="col-span-1 md:col-span-2 md:col-start-6">
                        <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">Shop</h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-white/50">
                            <li><Link className="hover:text-white transition-colors" href="/collection">All Products</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/collection?sort=newest">New Arrivals</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/collection?tag=bestseller">Best Sellers</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/collection?tag=gift">Gift Sets</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/live">Live Deals</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">Account</h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-white/50">
                            <li><Link className="hover:text-white transition-colors" href="/account">My Profile</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/orders">Order History</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/cart">Shopping Cart</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/account">Wishlist</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-span-2 md:col-span-2">
                        <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">Support</h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-white/50">
                            <li><Link className="hover:text-white transition-colors" href="/messages">Help Center</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/messages">Shipping Info</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/messages">Returns & Refunds</Link></li>
                            <li><Link className="hover:text-white transition-colors" href="/messages">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/30">
                    <p>&copy; {new Date().getFullYear()} LIKEFOOD Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-white/60 transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-white/60 transition-colors cursor-pointer">Terms of Service</span>
                        <span className="hover:text-white/60 transition-colors cursor-pointer">Cookie Settings</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
