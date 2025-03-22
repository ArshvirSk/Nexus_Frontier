import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alliance, AllianceMember, createAlliance } from "@/types/alliances";
import { Territory } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface AllianceManagerContextType {
  alliance: Alliance | null;
  pendingInvites: { allianceId: string, allianceName: string }[];
  createNewAlliance: (name: string, tag: string) => Alliance;
  joinAlliance: (allianceId: string) => void;
  leaveAlliance: () => void;
  inviteMember: (address: string, name: string) => void;
  removeMember: (address: string) => void;
  promoteToOfficer: (address: string) => void;
  demoteToMember: (address: string) => void;
  transferLeadership: (address: string) => void;
  updateAllianceDescription: (description: string) => void;
  updateAllianceEmblem: (emblem: string) => void;
  proposeAlliance: (allianceId: string) => void;
  acceptAlliance: (allianceId: string) => void;
  declareWar: (allianceId: string) => void;
  proposeNonAggressionPact: (allianceId: string) => void;
  acceptNonAggressionPact: (allianceId: string) => void;
  getAllianceColor: () => string | undefined;
}

const AllianceManagerContext = createContext<AllianceManagerContextType | undefined>(undefined);

export function useAllianceManager() {
  const context = useContext(AllianceManagerContext);
  if (!context) {
    throw new Error("useAllianceManager must be used within an AllianceManagerProvider");
  }
  return context;
}

interface AllianceManagerProviderProps {
  children: ReactNode;
  territories: Territory[];
}

export function AllianceManagerProvider({ children, territories }: AllianceManagerProviderProps) {
  const [alliance, setAlliance] = useState<Alliance | null>(null);
  const [allAlliances, setAllAlliances] = useState<Alliance[]>([]);
  const [pendingInvites, setPendingInvites] = useState<{ allianceId: string, allianceName: string }[]>([]);
  const { toast } = useToast();
  const { account } = useWallet();

  // Load alliance data from local storage on component mount
  useEffect(() => {
    if (!account?.address) return;
    
    // Load all alliances
    const savedAlliances = localStorage.getItem('alliances');
    if (savedAlliances) {
      try {
        const alliances = JSON.parse(savedAlliances);
        setAllAlliances(alliances);
        
        // Find the alliance this user belongs to
        const userAlliance = alliances.find((a: Alliance) => 
          a.members.some((m: AllianceMember) => m.address === account.address)
        );
        
        if (userAlliance) {
          setAlliance(userAlliance);
        }
      } catch (error) {
        console.error("Failed to parse saved alliances:", error);
      }
    }
    
    // Load pending invites
    const savedInvites = localStorage.getItem(`alliance_invites_${account.address}`);
    if (savedInvites) {
      try {
        setPendingInvites(JSON.parse(savedInvites));
      } catch (error) {
        console.error("Failed to parse saved invites:", error);
      }
    }
  }, [account?.address]);

  // Save alliance data to local storage whenever it changes
  const saveAlliances = (alliances: Alliance[]) => {
    localStorage.setItem('alliances', JSON.stringify(alliances));
  };

  // Save pending invites to local storage
  const saveInvites = (invites: { allianceId: string, allianceName: string }[]) => {
    if (!account?.address) return;
    localStorage.setItem(`alliance_invites_${account.address}`, JSON.stringify(invites));
  };

  // Update member's last active timestamp
  useEffect(() => {
    if (!account?.address || !alliance) return;
    
    const intervalId = setInterval(() => {
      setAllAlliances(currentAlliances => {
        const updatedAlliances = currentAlliances.map(a => {
          if (a.id === alliance.id) {
            const updatedMembers = a.members.map(m => {
              if (m.address === account.address) {
                return { ...m, lastActive: Date.now() };
              }
              return m;
            });
            
            return { ...a, members: updatedMembers };
          }
          return a;
        });
        
        saveAlliances(updatedAlliances);
        return updatedAlliances;
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [account?.address, alliance]);

  // Create a new alliance
  const createNewAlliance = (name: string, tag: string): Alliance => {
    if (!account?.address) {
      toast({
        title: "Error",
        description: "You need to connect your wallet to create an alliance.",
        variant: "destructive",
      });
      throw new Error("Wallet not connected");
    }
    
    // Check if user is already in an alliance
    if (alliance) {
      toast({
        title: "Error",
        description: "You are already in an alliance. Leave your current alliance first.",
        variant: "destructive",
      });
      throw new Error("Already in an alliance");
    }
    
    // Check if alliance name or tag already exists
    const nameExists = allAlliances.some(a => a.name.toLowerCase() === name.toLowerCase());
    const tagExists = allAlliances.some(a => a.tag.toLowerCase() === tag.toLowerCase());
    
    if (nameExists) {
      toast({
        title: "Error",
        description: "An alliance with this name already exists.",
        variant: "destructive",
      });
      throw new Error("Alliance name already exists");
    }
    
    if (tagExists) {
      toast({
        title: "Error",
        description: "An alliance with this tag already exists.",
        variant: "destructive",
      });
      throw new Error("Alliance tag already exists");
    }
    
    const newAlliance = createAlliance(name, tag, account.address, account.address.substring(0, 8));
    
    setAlliance(newAlliance);
    setAllAlliances(current => {
      const updated = [...current, newAlliance];
      saveAlliances(updated);
      return updated;
    });
    
    toast({
      title: "Alliance Created",
      description: `You have successfully created the ${name} alliance.`,
      variant: "default",
    });
    
    return newAlliance;
  };

  // Join an alliance
  const joinAlliance = (allianceId: string) => {
    if (!account?.address) {
      toast({
        title: "Error",
        description: "You need to connect your wallet to join an alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is already in an alliance
    if (alliance) {
      toast({
        title: "Error",
        description: "You are already in an alliance. Leave your current alliance first.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the invite exists
    const inviteIndex = pendingInvites.findIndex(invite => invite.allianceId === allianceId);
    if (inviteIndex === -1) {
      toast({
        title: "Error",
        description: "You don't have an invite to this alliance.",
        variant: "destructive",
      });
      return;
    }
    
    setAllAlliances(currentAlliances => {
      const updatedAlliances = currentAlliances.map(a => {
        if (a.id === allianceId) {
          // Check if alliance has reached member limit
          if (a.members.length >= a.upgrades.memberLimit) {
            toast({
              title: "Error",
              description: "This alliance has reached its member limit.",
              variant: "destructive",
            });
            return a;
          }
          
          const newMember: AllianceMember = {
            address: account.address,
            name: account.address.substring(0, 8),
            joinedAt: Date.now(),
            role: "member",
            contribution: {
              territories: 0,
              resources: {
                energy: 0,
                data: 0,
                materials: 0,
                influence: 0
              }
            },
            lastActive: Date.now()
          };
          
          const updatedAlliance = {
            ...a,
            members: [...a.members, newMember]
          };
          
          setAlliance(updatedAlliance);
          
          toast({
            title: "Alliance Joined",
            description: `You have successfully joined the ${a.name} alliance.`,
            variant: "default",
          });
          
          return updatedAlliance;
        }
        return a;
      });
      
      saveAlliances(updatedAlliances);
      
      // Remove the invite
      const updatedInvites = [...pendingInvites];
      updatedInvites.splice(inviteIndex, 1);
      setPendingInvites(updatedInvites);
      saveInvites(updatedInvites);
      
      return updatedAlliances;
    });
  };

  // Leave an alliance
  const leaveAlliance = () => {
    if (!account?.address || !alliance) {
      toast({
        title: "Error",
        description: "You are not in an alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is the leader
    const isLeader = alliance.leader === account.address;
    
    if (isLeader && alliance.members.length > 1) {
      toast({
        title: "Error",
        description: "You are the leader of this alliance. Transfer leadership before leaving.",
        variant: "destructive",
      });
      return;
    }
    
    setAllAlliances(currentAlliances => {
      let updatedAlliances: Alliance[];
      
      if (isLeader && alliance.members.length === 1) {
        // If leader is the only member, disband the alliance
        updatedAlliances = currentAlliances.filter(a => a.id !== alliance.id);
        
        toast({
          title: "Alliance Disbanded",
          description: `The ${alliance.name} alliance has been disbanded.`,
          variant: "default",
        });
      } else {
        // Remove member from alliance
        updatedAlliances = currentAlliances.map(a => {
          if (a.id === alliance.id) {
            return {
              ...a,
              members: a.members.filter(m => m.address !== account.address)
            };
          }
          return a;
        });
        
        toast({
          title: "Alliance Left",
          description: `You have left the ${alliance.name} alliance.`,
          variant: "default",
        });
      }
      
      saveAlliances(updatedAlliances);
      setAlliance(null);
      
      return updatedAlliances;
    });
  };

  // Invite a member to the alliance
  const inviteMember = (address: string, name: string) => {
    if (!alliance) {
      toast({
        title: "Error",
        description: "You are not in an alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has permission (leader or officer)
    const currentMember = alliance.members.find(m => m.address === account?.address);
    if (!currentMember || (currentMember.role !== "leader" && currentMember.role !== "officer")) {
      toast({
        title: "Error",
        description: "You don't have permission to invite members.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if member is already in the alliance
    if (alliance.members.some(m => m.address === address)) {
      toast({
        title: "Error",
        description: "This address is already a member of your alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Add invite to the target's pending invites
    // In a real app, this would be handled by a backend
    // For this demo, we'll simulate it with local storage
    const inviteKey = `alliance_invites_${address}`;
    const existingInvites = localStorage.getItem(inviteKey);
    let invites = [];
    
    if (existingInvites) {
      try {
        invites = JSON.parse(existingInvites);
      } catch (error) {
        console.error("Failed to parse existing invites:", error);
      }
    }
    
    // Check if invite already exists
    if (invites.some((invite: any) => invite.allianceId === alliance.id)) {
      toast({
        title: "Error",
        description: "This address has already been invited to your alliance.",
        variant: "destructive",
      });
      return;
    }
    
    invites.push({
      allianceId: alliance.id,
      allianceName: alliance.name
    });
    
    localStorage.setItem(inviteKey, JSON.stringify(invites));
    
    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${name || address.substring(0, 8)}.`,
      variant: "default",
    });
  };

  // Remove a member from the alliance
  const removeMember = (address: string) => {
    if (!alliance || !account?.address) {
      toast({
        title: "Error",
        description: "You are not in an alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has permission (leader or officer)
    const currentMember = alliance.members.find(m => m.address === account.address);
    if (!currentMember || (currentMember.role !== "leader" && currentMember.role !== "officer")) {
      toast({
        title: "Error",
        description: "You don't have permission to remove members.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if target is the leader
    if (address === alliance.leader) {
      toast({
        title: "Error",
        description: "You cannot remove the alliance leader.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if target is an officer and current user is not the leader
    const targetMember = alliance.members.find(m => m.address === address);
    if (targetMember?.role === "officer" && currentMember.role !== "leader") {
      toast({
        title: "Error",
        description: "Only the alliance leader can remove officers.",
        variant: "destructive",
      });
      return;
    }
    
    setAllAlliances(currentAlliances => {
      const updatedAlliances = currentAlliances.map(a => {
        if (a.id === alliance.id) {
          const updatedAlliance = {
            ...a,
            members: a.members.filter(m => m.address !== address)
          };
          
          setAlliance(updatedAlliance);
          
          toast({
            title: "Member Removed",
            description: `The member has been removed from the alliance.`,
            variant: "default",
          });
          
          return updatedAlliance;
        }
        return a;
      });
      
      saveAlliances(updatedAlliances);
      return updatedAlliances;
    });
  };

  // Promote a member to officer
  const promoteToOfficer = (address: string) => {
    if (!alliance || !account?.address) {
      toast({
        title: "Error",
        description: "You are not in an alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is the leader
    if (alliance.leader !== account.address) {
      toast({
        title: "Error",
        description: "Only the alliance leader can promote members.",
        variant: "destructive",
      });
      return;
    }
    
    setAllAlliances(currentAlliances => {
      const updatedAlliances = currentAlliances.map(a => {
        if (a.id === alliance.id) {
          const updatedMembers = a.members.map(m => {
            if (m.address === address && m.role === "member") {
              return { ...m, role: "officer" };
            }
            return m;
          });
          
          const updatedAlliance = { ...a, members: updatedMembers };
          setAlliance(updatedAlliance);
          
          toast({
            title: "Member Promoted",
            description: `The member has been promoted to officer.`,
            variant: "default",
          });
          
          return updatedAlliance;
        }
        return a;
      });
      
      saveAlliances(updatedAlliances);
      return updatedAlliances;
    });
  };

  // Demote an officer to member
  const demoteToMember = (address: string) => {
    if (!alliance || !account?.address) {
      toast({
        title: "Error",
        description: "You are not in an alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is the leader
    if (alliance.leader !== account.address) {
      toast({
        title: "Error",
        description: "Only the alliance leader can demote officers.",
        variant: "destructive",
      });
      return;
    }
    
    setAllAlliances(currentAlliances => {
      const updatedAlliances = currentAlliances.map(a => {
        if (a.id === alliance.id) {
          const updatedMembers = a.members.map(m => {
            if (m.address === address && m.role === "officer") {
              return { ...m, role: "member" };
            }
            return m;
          });
          
          const updatedAlliance = { ...a, members: updatedMembers };
          setAlliance(updatedAlliance);
          
          toast({
            title: "Officer Demoted",
            description: `The officer has been demoted to member.`,
            variant: "default",
          });
          
          return updatedAlliance;
        }
        return a;
      });
      
      saveAlliances(updatedAlliances);
      return updatedAlliances;
    });
  };

  // Transfer leadership to another member
  const transferLeadership = (address: string) => {
    if (!alliance || !account?.address) {
      toast({
        title: "Error",
        description: "You are not in an alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is the leader
    if (alliance.leader !== account.address) {
      toast({
        title: "Error",
        description: "Only the alliance leader can transfer leadership.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if target is in the alliance
    if (!alliance.members.some(m => m.address === address)) {
      toast({
        title: "Error",
        description: "The target address is not a member of your alliance.",
        variant: "destructive",
      });
      return;
    }
    
    setAllAlliances(currentAlliances => {
      const updatedAlliances = currentAlliances.map(a => {
        if (a.id === alliance.id) {
          // Update the leader
          const updatedAlliance = {
            ...a,
            leader: address,
            members: a.members.map(m => {
              if (m.address === address) {
                return { ...m, role: "leader" };
              }
              if (m.address === account.address) {
                return { ...m, role: "officer" };
              }
              return m;
            })
          };
          
          setAlliance(updatedAlliance);
          
          toast({
            title: "Leadership Transferred",
            description: `You have transferred leadership to another member.`,
            variant: "default",
          });
          
          return updatedAlliance;
        }
        return a;
      });
      
      saveAlliances(updatedAlliances);
      return updatedAlliances;
    });
  };

  // Update alliance description
  const updateAllianceDescription = (description: string) => {
    if (!alliance || !account?.address) {
      toast({
        title: "Error",
        description: "You are not in an alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has permission (leader or officer)
    const currentMember = alliance.members.find(m => m.address === account.address);
    if (!currentMember || (currentMember.role !== "leader" && currentMember.role !== "officer")) {
      toast({
        title: "Error",
        description: "You don't have permission to update the alliance description.",
        variant: "destructive",
      });
      return;
    }
    
    setAllAlliances(currentAlliances => {
      const updatedAlliances = currentAlliances.map(a => {
        if (a.id === alliance.id) {
          const updatedAlliance = { ...a, description };
          setAlliance(updatedAlliance);
          
          toast({
            title: "Description Updated",
            description: `The alliance description has been updated.`,
            variant: "default",
          });
          
          return updatedAlliance;
        }
        return a;
      });
      
      saveAlliances(updatedAlliances);
      return updatedAlliances;
    });
  };

  // Update alliance emblem
  const updateAllianceEmblem = (emblem: string) => {
    if (!alliance || !account?.address) {
      toast({
        title: "Error",
        description: "You are not in an alliance.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is the leader
    if (alliance.leader !== account.address) {
      toast({
        title: "Error",
        description: "Only the alliance leader can update the emblem.",
        variant: "destructive",
      });
      return;
    }
    
    setAllAlliances(currentAlliances => {
      const updatedAlliances = currentAlliances.map(a => {
        if (a.id === alliance.id) {
          const updatedAlliance = { ...a, emblem };
          setAlliance(updatedAlliance);
          
          toast({
            title: "Emblem Updated",
            description: `The alliance emblem has been updated.`,
            variant: "default",
          });
          
          return updatedAlliance;
        }
        return a;
      });
      
      saveAlliances(updatedAlliances);
      return updatedAlliances;
    });
  };

  // Diplomacy functions
  const proposeAlliance = (allianceId: string) => {
    // Implementation would be similar to inviteMember but for alliances
    toast({
      title: "Alliance Proposed",
      description: "Your alliance proposal has been sent.",
      variant: "default",
    });
  };

  const acceptAlliance = (allianceId: string) => {
    // Implementation would add the alliance to allies list
    toast({
      title: "Alliance Accepted",
      description: "The alliance has been formed.",
      variant: "default",
    });
  };

  const declareWar = (allianceId: string) => {
    // Implementation would add the alliance to enemies list
    toast({
      title: "War Declared",
      description: "You have declared war on the alliance.",
      variant: "default",
    });
  };

  const proposeNonAggressionPact = (allianceId: string) => {
    // Implementation would be similar to proposeAlliance
    toast({
      title: "Non-Aggression Pact Proposed",
      description: "Your non-aggression pact proposal has been sent.",
      variant: "default",
    });
  };

  const acceptNonAggressionPact = (allianceId: string) => {
    // Implementation would add the alliance to nonAggressionPacts list
    toast({
      title: "Non-Aggression Pact Accepted",
      description: "The non-aggression pact has been formed.",
      variant: "default",
    });
  };

  // Get alliance color for territory visualization
  const getAllianceColor = () => {
    return alliance?.color;
  };

  return (
    <AllianceManagerContext.Provider
      value={{
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
        updateAllianceEmblem,
        proposeAlliance,
        acceptAlliance,
        declareWar,
        proposeNonAggressionPact,
        acceptNonAggressionPact,
        getAllianceColor,
      }}
    >
      {children}
    </AllianceManagerContext.Provider>
  );
}
