export default function StatsCard({ title, value, color }) {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800'
    };
  
    return (
      <div className={`p-6 rounded-lg shadow-md ${colorClasses[color]}`}>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    );
  }