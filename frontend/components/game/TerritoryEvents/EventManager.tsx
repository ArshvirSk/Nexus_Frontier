import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TerritoryEvent, createRandomEvent } from "@/types/events";
import { Territory } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";

interface EventManagerContextType {
  events: TerritoryEvent[];
  addEvent: (event: TerritoryEvent) => void;
  removeEvent: (eventId: string) => void;
  getEventsForTerritory: (territoryId: string) => TerritoryEvent[];
  triggerRandomEvent: (territory: Territory) => void;
}

const EventManagerContext = createContext<EventManagerContextType | undefined>(undefined);

export function useEventManager() {
  const context = useContext(EventManagerContext);
  if (!context) {
    throw new Error("useEventManager must be used within an EventManagerProvider");
  }
  return context;
}

interface EventManagerProviderProps {
  children: ReactNode;
  territories: Territory[];
}

export function EventManagerProvider({ children, territories }: EventManagerProviderProps) {
  const [events, setEvents] = useState<TerritoryEvent[]>([]);
  const { toast } = useToast();

  // Clean up expired events
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      setEvents((currentEvents) => 
        currentEvents.filter((event) => now < event.startTime + event.duration)
      );
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Randomly trigger events
  useEffect(() => {
    if (!territories || territories.length === 0) return;

    const eventIntervalId = setInterval(() => {
      // 5% chance of an event occurring on a random territory
      if (Math.random() < 0.05) {
        const randomTerritory = territories[Math.floor(Math.random() * territories.length)];
        const newEvent = createRandomEvent(randomTerritory);
        
        setEvents((currentEvents) => [...currentEvents, newEvent]);
        
        // Find territory name
        const territory = territories.find(t => t.id === newEvent.territoryId);
        
        // Notify user
        toast({
          title: newEvent.name,
          description: `${newEvent.description} (${territory?.name || "Unknown territory"})`,
          variant: "default",
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(eventIntervalId);
  }, [territories, toast]);

  const addEvent = (event: TerritoryEvent) => {
    setEvents((currentEvents) => [...currentEvents, event]);
  };

  const removeEvent = (eventId: string) => {
    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
  };

  const getEventsForTerritory = (territoryId: string) => {
    return events.filter((event) => event.territoryId === territoryId);
  };

  const triggerRandomEvent = (territory: Territory) => {
    const newEvent = createRandomEvent(territory);
    addEvent(newEvent);
    
    toast({
      title: newEvent.name,
      description: `${newEvent.description} (${territory.name})`,
      variant: "default",
    });
    
    return newEvent;
  };

  return (
    <EventManagerContext.Provider
      value={{
        events,
        addEvent,
        removeEvent,
        getEventsForTerritory,
        triggerRandomEvent,
      }}
    >
      {children}
    </EventManagerContext.Provider>
  );
}
