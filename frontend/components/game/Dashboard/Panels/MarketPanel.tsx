import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MarketItem {
  id: string;
  name: string;
  price: number;
  change: number;
  type: 'energy' | 'data' | 'materials' | 'influence' | 'agent';
}

export function MarketPanel() {
  // Mock market data
  const marketItems: MarketItem[] = [
    { id: '1', name: 'Energy Cell', price: 125, change: 2.5, type: 'energy' },
    { id: '2', name: 'Data Shard', price: 85, change: -1.2, type: 'data' },
    { id: '3', name: 'Nano Materials', price: 210, change: 5.7, type: 'materials' },
    { id: '4', name: 'Influence Token', price: 175, change: 0.8, type: 'influence' },
    { id: '5', name: 'Agent Contract', price: 450, change: -3.1, type: 'agent' },
  ];

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'energy': return 'text-green-400';
      case 'data': return 'text-blue-400';
      case 'materials': return 'text-amber-400';
      case 'influence': return 'text-purple-400';
      case 'agent': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col p-4 bg-black/50 rounded-lg border border-purple-500/30 text-purple-100">
      <h3 className="text-xl font-cyberpunk text-purple-300 mb-4">Market Exchange</h3>
      
      {/* Market Items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-gray-800/30">
        <table className="w-full text-sm">
          <thead className="text-gray-400 text-xs uppercase">
            <tr>
              <th className="text-left pb-2 font-medium">Item</th>
              <th className="text-right pb-2 font-medium">Price</th>
              <th className="text-right pb-2 font-medium">Change</th>
              <th className="text-right pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marketItems.map((item) => (
              <tr key={item.id} className="border-b border-purple-900/30 hover:bg-purple-900/10 transition-colors">
                <td className="py-2">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${item.type === 'energy' ? 'bg-green-500' : item.type === 'data' ? 'bg-blue-500' : item.type === 'materials' ? 'bg-amber-500' : item.type === 'influence' ? 'bg-purple-500' : 'bg-cyan-500'} mr-2`}></div>
                    <span className={getTypeColor(item.type)}>{item.name}</span>
                  </div>
                </td>
                <td className="text-right py-2">{item.price}</td>
                <td className={`text-right py-2 ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </td>
                <td className="text-right py-2">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-green-950/30 hover:bg-green-900/50 border-green-700/30">Buy</Button>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-red-950/30 hover:bg-red-900/50 border-red-700/30">Sell</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Market Trends */}
      <div className="mt-4 bg-black/30 p-3 rounded border border-purple-800/30">
        <div className="text-xs text-purple-400 mb-2">Market Trends</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-400">Energy</span>
              <span className="text-green-400">+2.5%</span>
            </div>
            <Progress value={65} className="h-1 bg-green-950" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-400">Data</span>
              <span className="text-red-400">-1.2%</span>
            </div>
            <Progress value={42} className="h-1 bg-blue-950" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-amber-400">Materials</span>
              <span className="text-green-400">+5.7%</span>
            </div>
            <Progress value={78} className="h-1 bg-amber-950" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-purple-400">Influence</span>
              <span className="text-green-400">+0.8%</span>
            </div>
            <Progress value={52} className="h-1 bg-purple-950" />
          </div>
        </div>
      </div>
    </div>
  );
}
