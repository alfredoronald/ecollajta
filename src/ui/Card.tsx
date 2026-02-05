export function Card({ children }: { children: React.ReactNode }) {
return (
<div className="rounded-2xl shadow-lg bg-white p-6 border">
{children}
</div>
);
}