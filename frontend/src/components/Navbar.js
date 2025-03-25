import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4 text-white">
        <li><Link href="/">Dashboard</Link></li>
        <li><Link href="/inventory">Inventory</Link></li>
        <li><Link href="/purchase">Purchase Log</Link></li>
        <li><Link href="/usage">Usage Log</Link></li>
      </ul>
    </nav>
  );
}
