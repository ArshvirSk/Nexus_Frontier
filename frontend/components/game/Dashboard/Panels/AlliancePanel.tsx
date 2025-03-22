import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alliance, AllianceMember } from "@/types/alliances";

interface AlliancePanelProps {
  alliance: Alliance | null;
  allianceMembers: AllianceMember[];
  onInviteMember: (address: string) => void;
  onLeaveAlliance: () => void;
  onContributeResources: (amount: number) => void;
}

export const AlliancePanel = ({
  alliance,
  allianceMembers,
  onInviteMember,
  onLeaveAlliance,
  onContributeResources,
}: AlliancePanelProps) => {
  const [inviteAddress, setInviteAddress] = useState("");
  const [contributionAmount, setContributionAmount] = useState(10);

  if (!alliance) {
    return (
      <div className="h-full flex items-center justify-center p-4 bg-black/50 rounded-lg border border-purple-500/30">
        <div className="text-center text-purple-300">
          <p className="text-lg font-cyberpunk">No alliance</p>
          <p className="text-sm opacity-70">Create or join an alliance to view details</p>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-4 border-cyan-500 text-cyan-400 hover:bg-cyan-900/50"
          >
            Create Alliance
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 bg-black/50 rounded-lg border border-purple-500/30 text-purple-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-cyberpunk text-purple-300">{alliance.name}</h3>
          <p className="text-sm text-purple-400">{alliance.description}</p>
        </div>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onLeaveAlliance}
        >
          Leave
        </Button>
      </div>

      {/* Alliance Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-purple-400">Influence</span>
          <Progress 
            value={alliance.stats.influence} 
            className="h-2 bg-purple-950"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-purple-400">Production Bonus</span>
          <Progress 
            value={alliance.stats.productionBonus} 
            className="h-2 bg-purple-950"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-purple-400">Defense Bonus</span>
          <Progress 
            value={alliance.stats.defenseBonus} 
            className="h-2 bg-purple-950"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-purple-400">Resource Capacity</span>
          <Progress 
            value={alliance.stats.resourceCapacity} 
            className="h-2 bg-purple-950"
          />
        </div>
      </div>

      {/* Alliance Members */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-purple-300 mb-2">Members ({allianceMembers.length})</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {allianceMembers.map((member, index) => (
            <div 
              key={index}
              className="p-2 rounded border border-purple-800 bg-purple-950/30"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm flex items-center">
                    {member.name}
                    {member.online && (
                      <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
                    )}
                  </div>
                  <div className="text-xs text-purple-400 truncate max-w-[150px]">
                    {member.address.substring(0, 6)}...{member.address.substring(member.address.length - 4)}
                  </div>
                </div>
                <div className="text-xs text-right">
                  <div className="capitalize text-cyan-400">{member.role}</div>
                  <div>{member.territories} territories</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-purple-300 mb-2">Invite Member</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inviteAddress}
            onChange={(e) => setInviteAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="flex-1 bg-black/60 border border-purple-800 rounded px-2 py-1 text-sm"
          />
          <Button 
            variant="outline" 
            size="sm"
            className="border-cyan-500 text-cyan-400 hover:bg-cyan-900/50"
            onClick={() => onInviteMember(inviteAddress)}
            disabled={!inviteAddress}
          >
            Invite
          </Button>
        </div>
      </div>

      {/* Resource Contribution */}
      <div className="mt-auto">
        <h4 className="text-sm font-medium text-purple-300 mb-2">Resource Contribution</h4>
        <div className="flex items-center space-x-2 mb-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setContributionAmount(Math.max(5, contributionAmount - 5))}
          >
            -
          </Button>
          <div className="flex-1 text-center">
            <span className="text-lg font-medium">{contributionAmount}%</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setContributionAmount(Math.min(50, contributionAmount + 5))}
          >
            +
          </Button>
        </div>
        <Button 
          variant="default" 
          size="sm"
          className="w-full"
          onClick={() => onContributeResources(contributionAmount)}
        >
          Set Contribution
        </Button>
      </div>
    </div>
  );
};
