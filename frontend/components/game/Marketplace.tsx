import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Types } from 'aptos';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from '@/components/ui/loader';
import { useGameState } from '@/hooks/useGameState';

interface Listing {
  id: number;
  seller: string;
  assetType: number;
  assetId: number;
  price: number;
  timestamp: number;
}

const ASSET_TYPES = {
  1: 'Agent',
  2: 'Territory',
  3: 'Resources',
};

export function Marketplace() {
  const { account, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();
  const { contractAddress } = useGameState();
  const [price, setPrice] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState(1);

  // Query listings
  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      // Implementation will depend on your view function structure
      return []; // TODO: Implement listing fetching
    },
    enabled: !!account?.address,
  });

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: async () => {
      if (!account?.address || !selectedAssetId) throw new Error('Invalid parameters');

      const transaction: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${contractAddress}::marketplace::create_listing`,
        type_arguments: [],
        arguments: [selectedAssetType, selectedAssetId, Number(price)],
      };

      const response = await signAndSubmitTransaction(transaction);
      await response.wait();
      return response;
    },
    onSuccess: () => {
      toast.success('Listing created successfully');
      setPrice('');
      setSelectedAssetId(null);
      queryClient.invalidateQueries(['marketplace-listings']);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create listing: ${error.message}`);
    },
  });

  // Purchase listing mutation
  const purchaseListingMutation = useMutation({
    mutationFn: async (listingId: number) => {
      if (!account?.address) throw new Error('Wallet not connected');

      const transaction: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${contractAddress}::marketplace::purchase_listing`,
        type_arguments: [],
        arguments: [listingId],
      };

      const response = await signAndSubmitTransaction(transaction);
      await response.wait();
      return response;
    },
    onSuccess: () => {
      toast.success('Purchase successful');
      queryClient.invalidateQueries(['marketplace-listings']);
    },
    onError: (error: Error) => {
      toast.error(`Purchase failed: ${error.message}`);
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-neon-blue">Syndicate Marketplace</h2>

        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="bg-darker-gray border-b border-neon-purple">
            <TabsTrigger value="buy" className="text-neon-blue hover:text-neon-purple">
              Buy Assets
            </TabsTrigger>
            <TabsTrigger value="sell" className="text-neon-blue hover:text-neon-purple">
              Sell Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings?.map((listing) => (
                <Card
                  key={listing.id}
                  className="p-4 bg-dark-gray border-neon-blue hover:border-neon-purple transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-neon-blue">
                        {ASSET_TYPES[listing.assetType as keyof typeof ASSET_TYPES]} #{listing.assetId}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                      </p>
                    </div>
                    <p className="text-neon-green">{listing.price} APT</p>
                  </div>
                  
                  <Button
                    onClick={() => purchaseListingMutation.mutate(listing.id)}
                    disabled={listing.seller === account?.address}
                    className="w-full mt-4 bg-neon-purple hover:bg-neon-purple/80"
                  >
                    {listing.seller === account?.address ? 'Your Listing' : 'Purchase'}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sell" className="mt-4">
            <Card className="p-4 bg-dark-gray border-neon-purple">
              <h3 className="text-lg font-semibold mb-4 text-neon-green">Create New Listing</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <select
                    value={selectedAssetType}
                    onChange={(e) => setSelectedAssetType(Number(e.target.value))}
                    className="flex-1 bg-darker-gray text-neon-blue border border-neon-blue rounded p-2"
                  >
                    {Object.entries(ASSET_TYPES).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    placeholder="Asset ID"
                    value={selectedAssetId || ''}
                    onChange={(e) => setSelectedAssetId(Number(e.target.value))}
                    className="flex-1 bg-darker-gray text-neon-blue"
                  />
                  <Input
                    type="number"
                    placeholder="Price in APT"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex-1 bg-darker-gray text-neon-blue"
                  />
                </div>
                <Button
                  onClick={() => createListingMutation.mutate()}
                  disabled={!selectedAssetId || !price || createListingMutation.isLoading}
                  className="w-full bg-neon-purple hover:bg-neon-purple/80"
                >
                  Create Listing
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
