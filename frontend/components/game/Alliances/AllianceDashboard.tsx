import { useState } from "react";
import { useAllianceManager } from "./AllianceManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AllianceMember } from "@/types/alliances";
import { Progress } from "@/components/ui/progress";
import { calculateExperienceForLevel } from "@/types/alliances";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function AllianceDashboard() {
  const { 
    alliance, 
    pendingInvites, 
    createNewAlliance, 
    joinAlliance,
    leaveAlliance,
    inviteMember,
    removeMember,
    promoteToOfficer,
    demoteToMember,
    transferLeadership,
    updateAllianceDescription,
    updateAllianceEmblem
  } = useAllianceManager();
  
  const { account } = useWallet();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAllianceName, setNewAllianceName] = useState("");
  const [newAllianceTag, setNewAllianceTag] = useState("");
  
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteAddress, setInviteAddress] = useState("");
  const [inviteName, setInviteName] = useState("");
  
  const [isEditDescriptionDialogOpen, setIsEditDescriptionDialogOpen] = useState(false);
  const [newDescription, setNewDescription] = useState(alliance?.description || "");
  
  const [isEditEmblemDialogOpen, setIsEditEmblemDialogOpen] = useState(false);
  const [newEmblem, setNewEmblem] = useState(alliance?.emblem || "🏢");
  
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isTransferLeadershipDialogOpen, setIsTransferLeadershipDialogOpen] = useState(false);
  const [newLeaderAddress, setNewLeaderAddress] = useState("");
  
  // Get user's role in alliance
  const getUserRole = () => {
    if (!alliance || !account?.address) return null;
    const member = alliance.members.find(m => m.address === account.address);
    return member?.role;
  };
  
  const userRole = getUserRole();
  const isLeader = userRole === "leader";
  const isOfficer = userRole === "officer";
  const canManageMembers = isLeader || isOfficer;
  
  // Calculate XP progress to next level
  const calculateXpProgress = () => {
    if (!alliance) return 0;
    
    const currentLevelXp = calculateExperienceForLevel(alliance.level);
    const nextLevelXp = calculateExperienceForLevel(alliance.level + 1);
    const levelXpRange = nextLevelXp - currentLevelXp;
    
    return ((alliance.experience - currentLevelXp) / levelXpRange) * 100;
  };
  
  // Handle alliance creation
  const handleCreateAlliance = () => {
    if (newAllianceName.trim() === "" || newAllianceTag.trim() === "") return;
    
    try {
      createNewAlliance(newAllianceName, newAllianceTag);
      setNewAllianceName("");
      setNewAllianceTag("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create alliance:", error);
    }
  };
  
  // Handle member invitation
  const handleInviteMember = () => {
    if (inviteAddress.trim() === "") return;
    
    inviteMember(inviteAddress, inviteName);
    setInviteAddress("");
    setInviteName("");
    setIsInviteDialogOpen(false);
  };
  
  // Handle description update
  const handleUpdateDescription = () => {
    updateAllianceDescription(newDescription);
    setIsEditDescriptionDialogOpen(false);
  };
  
  // Handle emblem update
  const handleUpdateEmblem = () => {
    updateAllianceEmblem(newEmblem);
    setIsEditEmblemDialogOpen(false);
  };
  
  // Handle leadership transfer
  const handleTransferLeadership = () => {
    if (newLeaderAddress.trim() === "") return;
    
    transferLeadership(newLeaderAddress);
    setNewLeaderAddress("");
    setIsTransferLeadershipDialogOpen(false);
  };
  
  // Render member list with actions
  const renderMemberList = () => {
    if (!alliance) return null;
    
    return (
      <div className="space-y-2">
        {alliance.members.map(member => (
          <MemberCard 
            key={member.address} 
            member={member}
            isCurrentUser={member.address === account?.address}
            userRole={userRole}
            onPromote={isLeader ? () => promoteToOfficer(member.address) : undefined}
            onDemote={isLeader ? () => demoteToMember(member.address) : undefined}
            onRemove={canManageMembers ? () => removeMember(member.address) : undefined}
            onTransferLeadership={isLeader ? () => {
              setNewLeaderAddress(member.address);
              setIsTransferLeadershipDialogOpen(true);
            } : undefined}
          />
        ))}
      </div>
    );
  };
  
  // Render pending invites
  const renderPendingInvites = () => {
    if (pendingInvites.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          No pending invites
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {pendingInvites.map(invite => (
          <Card key={invite.allianceId} className="bg-black/80 border border-cyan-500/30 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{invite.allianceName}</h3>
                <p className="text-sm text-gray-400">You have been invited to join this alliance</p>
              </div>
              <Button onClick={() => joinAlliance(invite.allianceId)}>
                Accept
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // If user is not in an alliance, show creation/join options
  if (!alliance) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Alliance Network</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">Create Alliance</Button>
            </DialogTrigger>
            <DialogContent className="bg-black border border-cyan-500/50 text-white">
              <DialogHeader>
                <DialogTitle className="text-cyan-400">Create New Alliance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="alliance-name">Alliance Name</Label>
                  <Input 
                    id="alliance-name" 
                    value={newAllianceName} 
                    onChange={(e) => setNewAllianceName(e.target.value)}
                    className="bg-gray-900 border-gray-700"
                    maxLength={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alliance-tag">Alliance Tag (3-4 characters)</Label>
                  <Input 
                    id="alliance-tag" 
                    value={newAllianceTag} 
                    onChange={(e) => setNewAllianceTag(e.target.value.toUpperCase())}
                    className="bg-gray-900 border-gray-700"
                    maxLength={4}
                  />
                  <p className="text-xs text-gray-400">This will appear next to member names</p>
                </div>
                <Button onClick={handleCreateAlliance} className="w-full">Create Alliance</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="bg-black/80 border border-cyan-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Alliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              You are not currently a member of any alliance. Create your own alliance or accept an invitation to join one.
            </p>
            
            <h3 className="font-semibold mb-2">Pending Invitations</h3>
            {renderPendingInvites()}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // User is in an alliance, show alliance dashboard
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">{alliance.emblem}</span>
          <h2 className="text-xl font-bold text-white">
            {alliance.name} <span className="text-sm text-gray-400">[{alliance.tag}]</span>
          </h2>
        </div>
        <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">Leave Alliance</Button>
          </DialogTrigger>
          <DialogContent className="bg-black border border-red-500/50 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400">Leave Alliance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <p>
                Are you sure you want to leave the {alliance.name} alliance?
                {isLeader && alliance.members.length > 1 && (
                  <span className="block mt-2 text-red-400">
                    You are the leader of this alliance. You must transfer leadership before leaving.
                  </span>
                )}
                {isLeader && alliance.members.length === 1 && (
                  <span className="block mt-2 text-red-400">
                    You are the only member. The alliance will be disbanded.
                  </span>
                )}
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsLeaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    leaveAlliance();
                    setIsLeaveDialogOpen(false);
                  }}
                  disabled={isLeader && alliance.members.length > 1}
                >
                  Leave Alliance
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members ({alliance.members.length})</TabsTrigger>
          <TabsTrigger value="diplomacy">Diplomacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-black/80 border border-cyan-500/30 text-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Alliance Details</CardTitle>
                {canManageMembers && (
                  <Dialog open={isEditDescriptionDialogOpen} onOpenChange={setIsEditDescriptionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Edit Description</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border border-cyan-500/50 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-cyan-400">Edit Alliance Description</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <Textarea 
                          value={newDescription} 
                          onChange={(e) => setNewDescription(e.target.value)}
                          className="bg-gray-900 border-gray-700 min-h-[100px]"
                        />
                        <Button onClick={handleUpdateDescription} className="w-full">Update Description</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{alliance.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p>{new Date(alliance.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Members</p>
                  <p>{alliance.members.length} / {alliance.upgrades.memberLimit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Territories</p>
                  <p>{alliance.territories.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Leader</p>
                  <p>{alliance.members.find(m => m.address === alliance.leader)?.name || "Unknown"}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Alliance Level {alliance.level}</span>
                  <span>{alliance.experience} XP</span>
                </div>
                <Progress value={calculateXpProgress()} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Alliance Bonuses</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-gray-900/50 rounded border border-gray-800">
                    <p className="text-gray-400">Resource Production</p>
                    <p className="text-cyan-400">+{Math.round(alliance.upgrades.resourceBonus * 100)}%</p>
                  </div>
                  <div className="p-2 bg-gray-900/50 rounded border border-gray-800">
                    <p className="text-gray-400">Territory Defense</p>
                    <p className="text-cyan-400">+{Math.round(alliance.upgrades.defenseBonus * 100)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/80 border border-cyan-500/30 text-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Alliance Resources</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(alliance.resources).map(resource => (
                  <div key={resource.type} className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold" style={{ color: getResourceColor(resource.type) }}>
                        {capitalizeFirstLetter(resource.type)}
                      </h4>
                      <span>{resource.storage} / {resource.capacity}</span>
                    </div>
                    <Progress 
                      value={(resource.storage / resource.capacity) * 100} 
                      className="h-2 mb-2"
                      style={{ backgroundColor: `${getResourceColor(resource.type)}33` }}
                    />
                    <p className="text-xs text-gray-400">
                      Production: {resource.production.toFixed(1)} / hour
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {isLeader && (
            <Card className="bg-black/80 border border-cyan-500/30 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Alliance Customization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Dialog open={isEditEmblemDialogOpen} onOpenChange={setIsEditEmblemDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-auto py-6 flex flex-col items-center">
                        <span className="text-3xl mb-2">{alliance.emblem}</span>
                        <span>Change Emblem</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border border-cyan-500/50 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-cyan-400">Change Alliance Emblem</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="grid grid-cols-5 gap-2">
                          {["🏢", "🏙️", "🌆", "🌃", "🌉", "💻", "🖥️", "📱", "📡", "🛰️", 
                            "🔌", "🔋", "💾", "💿", "🧠", "👁️", "🤖", "👾", "🎮", "🎲",
                            "⚔️", "🛡️", "🔫", "💣", "🧪", "⚡", "🔥", "💧", "🌪️", "🌍"].map(emoji => (
                            <Button
                              key={emoji}
                              variant={newEmblem === emoji ? "default" : "outline"}
                              className="h-12 text-2xl"
                              onClick={() => setNewEmblem(emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                        <Button onClick={handleUpdateEmblem} className="w-full">Update Emblem</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="h-auto py-6 flex flex-col items-center" disabled>
                    <div 
                      className="w-8 h-8 rounded-full mb-2"
                      style={{ backgroundColor: alliance.color }}
                    />
                    <span>Change Color (Coming Soon)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="members" className="space-y-4">
          <Card className="bg-black/80 border border-cyan-500/30 text-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Alliance Members</CardTitle>
                {canManageMembers && (
                  <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm">Invite Member</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border border-cyan-500/50 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-cyan-400">Invite New Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="member-address">Wallet Address</Label>
                          <Input 
                            id="member-address" 
                            value={inviteAddress} 
                            onChange={(e) => setInviteAddress(e.target.value)}
                            className="bg-gray-900 border-gray-700"
                            placeholder="0x..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member-name">Display Name (Optional)</Label>
                          <Input 
                            id="member-name" 
                            value={inviteName} 
                            onChange={(e) => setInviteName(e.target.value)}
                            className="bg-gray-900 border-gray-700"
                          />
                        </div>
                        <Button onClick={handleInviteMember} className="w-full">Send Invitation</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {renderMemberList()}
            </CardContent>
          </Card>
          
          <Dialog open={isTransferLeadershipDialogOpen} onOpenChange={setIsTransferLeadershipDialogOpen}>
            <DialogContent className="bg-black border border-cyan-500/50 text-white">
              <DialogHeader>
                <DialogTitle className="text-cyan-400">Transfer Leadership</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <p>
                  Are you sure you want to transfer leadership to{" "}
                  {alliance.members.find(m => m.address === newLeaderAddress)?.name || newLeaderAddress.substring(0, 8)}?
                </p>
                <p className="text-sm text-yellow-400">
                  You will become an officer after the transfer.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setIsTransferLeadershipDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="default" onClick={handleTransferLeadership}>
                    Transfer Leadership
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="diplomacy" className="space-y-4">
          <Card className="bg-black/80 border border-cyan-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Diplomatic Relations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-center py-8">
                Alliance diplomacy features coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Member card component
interface MemberCardProps {
  member: AllianceMember;
  isCurrentUser: boolean;
  userRole: string | null;
  onPromote?: () => void;
  onDemote?: () => void;
  onRemove?: () => void;
  onTransferLeadership?: () => void;
}

function MemberCard({ 
  member, 
  isCurrentUser, 
  userRole, 
  onPromote, 
  onDemote, 
  onRemove,
  onTransferLeadership
}: MemberCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  // Check if current user can manage this member
  const canManage = !isCurrentUser && 
    ((userRole === "leader") || 
     (userRole === "officer" && member.role === "member"));
  
  // Format last active time
  const getLastActiveTime = () => {
    const now = Date.now();
    const diff = now - member.lastActive;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };
  
  return (
    <Card className="bg-black/60 border border-gray-800 text-white">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              member.role === "leader" ? "bg-yellow-500/20 text-yellow-500" :
              member.role === "officer" ? "bg-cyan-500/20 text-cyan-500" :
              "bg-gray-500/20 text-gray-400"
            }`}>
              {member.role === "leader" ? "👑" : 
               member.role === "officer" ? "⭐" : "👤"}
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold">{member.name}</h3>
                {isCurrentUser && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-700 text-gray-300">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <span className="truncate max-w-[120px]">{member.address.substring(0, 8)}...</span>
                <span className="mx-1">•</span>
                <span>{getLastActiveTime()}</span>
              </div>
            </div>
          </div>
          
          {canManage && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowActions(!showActions)}
            >
              <span className="sr-only">Actions</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          )}
        </div>
        
        {showActions && canManage && (
          <div className="mt-2 pt-2 border-t border-gray-800 grid grid-cols-2 gap-2">
            {member.role === "member" && onPromote && (
              <Button variant="outline" size="sm" onClick={onPromote}>
                Promote
              </Button>
            )}
            {member.role === "officer" && onDemote && (
              <Button variant="outline" size="sm" onClick={onDemote}>
                Demote
              </Button>
            )}
            {onRemove && member.role !== "leader" && (
              <Button variant="destructive" size="sm" onClick={onRemove}>
                Remove
              </Button>
            )}
            {userRole === "leader" && member.role !== "leader" && onTransferLeadership && (
              <Button variant="default" size="sm" onClick={onTransferLeadership}>
                Make Leader
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper functions
function getResourceColor(resourceType: string): string {
  switch (resourceType) {
    case "energy": return "#00ff00";
    case "data": return "#00ffff";
    case "materials": return "#ff9900";
    case "influence": return "#ff00ff";
    default: return "#ffffff";
  }
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
