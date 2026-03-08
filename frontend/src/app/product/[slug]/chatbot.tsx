"use client"

import { Bot, X, Send, MessageSquare } from "lucide-react"
import { useState } from "react"

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 bg-ivory dark:bg-surface-dark rounded-2xl shadow-2xl border border-stone-beige/50 transition-all duration-300 origin-bottom-right overflow-hidden">
                    <div className="bg-brand p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bot className="text-white/90 w-5 h-5" />
                            <div>
                                <p className="text-white font-serif font-medium text-base">Chef AI</p>
                                <p className="text-white/70 text-[10px] uppercase tracking-wider">Culinary Assistant</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-4 h-72 bg-warm-white dark:bg-background-dark overflow-y-auto space-y-4">
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-white dark:bg-surface-dark p-3 rounded-xl rounded-tl-sm shadow-sm text-sm text-soft-black dark:text-accent border border-stone-beige/30 max-w-[85%]">
                                Hello! Looking for cooking tips for this product?
                            </div>
                        </div>
                        <div className="flex gap-3 flex-row-reverse">
                            <div className="bg-brand text-white p-3 rounded-xl rounded-tr-sm shadow-sm text-sm max-w-[85%]">
                                Yes, any recommendations?
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-white dark:bg-surface-dark p-3 rounded-xl rounded-tl-sm shadow-sm text-sm text-soft-black dark:text-accent border border-stone-beige/30 max-w-[85%]">
                                It pairs really well with fresh herbs and thinly sliced beef!
                            </div>
                        </div>
                    </div>
                    <div className="p-3 border-t border-stone-beige/30 bg-white dark:bg-surface-dark">
                        <div className="flex items-center gap-2">
                            <input className="flex-1 bg-warm-white dark:bg-background-dark border border-stone-beige/50 rounded-xl px-3 py-2 text-sm text-soft-black dark:text-accent placeholder-taupe/60 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all" placeholder="Ask about recipes..." type="text" />
                            <button className="w-9 h-9 rounded-xl bg-brand hover:bg-brand-hover text-white flex items-center justify-center transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="h-14 w-14 bg-brand hover:bg-brand-hover text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 rounded-2xl relative">
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-moss rounded-full border-2 border-ivory dark:border-background-dark"></span>
            </button>
        </div>
    )
}
