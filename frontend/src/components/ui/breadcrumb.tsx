import Link from "next/link"

type BreadcrumbItem = {
    label: string
    href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="Breadcrumb" className="flex mb-8">
            <ol className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
                <li>
                    <Link className="text-taupe hover:text-brand transition-colors" href="/">Home</Link>
                </li>
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <span className="text-stone-beige">/</span>
                        {item.href ? (
                            <Link className="text-taupe hover:text-brand transition-colors" href={item.href}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-brand font-semibold">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
