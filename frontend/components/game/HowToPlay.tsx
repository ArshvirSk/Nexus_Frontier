import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HowToPlay() {
  return (
    <div className="space-y-6">
      <Card className="w-full max-w-6xl mx-auto bg-black/80 backdrop-blur-md border-0 shadow-2xl shadow-purple-900/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

        <CardHeader className="relative z-10 border-b border-purple-500/30 pb-4 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-8 bg-neon-purple"></div>
            <CardTitle className="text-2xl font-cyber text-white flex items-center">
              <span className="text-neon-purple">
                NEXUS FRONTIER
              </span>
              <span className="text-neon-purple ml-2 animate-pulse"> // </span>
              <span className="text-sm font-mono uppercase tracking-wider text-gray-400 ml-2 border-l border-purple-500/30 pl-2">SYSTEM GUIDE</span>
            </CardTitle>
          </div>
          <p className="text-gray-300 ml-10 pl-0.5 border-l-2 border-neon-purple/50 italic">
            A cyberpunk strategy game where syndicates compete for control of the digital frontier
          </p>
        </CardHeader>

        <CardContent className="relative z-10 pt-6 p-0">
          <Tabs defaultValue="basics" className="space-y-6">
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-purple-500/20 px-4 py-2">
              <TabsList className="w-full flex flex-wrap justify-center gap-1 bg-darker-gray/80 p-1 border border-purple-500/20 rounded-md">
                <TabsTrigger
                  value="basics"
                  className="flex-1 data-[state=active]:bg-purple-950/50 data-[state=active]:text-neon-purple data-[state=active]:shadow-[0_0_10px_rgba(176,38,255,0.3)] transition-all duration-200"
                >
                  <span className="flex items-center justify-center"><span className="text-neon-purple mr-1 font-mono">&gt;</span> Game Basics</span>
                </TabsTrigger>
                <TabsTrigger
                  value="territories"
                  className="flex-1 data-[state=active]:bg-purple-950/50 data-[state=active]:text-neon-purple data-[state=active]:shadow-[0_0_10px_rgba(176,38,255,0.3)] transition-all duration-200"
                >
                  <span className="flex items-center justify-center"><span className="text-neon-blue mr-1 font-mono">&gt;</span> Territories</span>
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="flex-1 data-[state=active]:bg-purple-950/50 data-[state=active]:text-neon-purple data-[state=active]:shadow-[0_0_10px_rgba(176,38,255,0.3)] transition-all duration-200"
                >
                  <span className="flex items-center justify-center"><span className="text-green-400 mr-1 font-mono">&gt;</span> Resources</span>
                </TabsTrigger>
                <TabsTrigger
                  value="agents"
                  className="flex-1 data-[state=active]:bg-purple-950/50 data-[state=active]:text-neon-purple data-[state=active]:shadow-[0_0_10px_rgba(176,38,255,0.3)] transition-all duration-200"
                >
                  <span className="flex items-center justify-center"><span className="text-amber-400 mr-1 font-mono">&gt;</span> Agents</span>
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="flex-1 data-[state=active]:bg-purple-950/50 data-[state=active]:text-neon-purple data-[state=active]:shadow-[0_0_10px_rgba(176,38,255,0.3)] transition-all duration-200"
                >
                  <span className="flex items-center justify-center"><span className="text-cyan-400 mr-1 font-mono">&gt;</span> Map</span>
                </TabsTrigger>
                <TabsTrigger
                  value="strategy"
                  className="flex-1 data-[state=active]:bg-purple-950/50 data-[state=active]:text-neon-purple data-[state=active]:shadow-[0_0_10px_rgba(176,38,255,0.3)] transition-all duration-200"
                >
                  <span className="flex items-center justify-center"><span className="text-red-400 mr-1 font-mono">&gt;</span> Strategy</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Game Basics Tab */}
            <TabsContent value="basics" className="space-y-6">
              <div className="grid gap-6">
                <div className="bg-darker-gray/80 rounded-md border border-neon-purple/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-900/30 to-transparent p-1 border-b border-neon-purple/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-purple mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-purple">SYSTEM OVERVIEW</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[CORE_DATA]</div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-gray-300 leading-relaxed">
                      <span className="text-neon-purple font-bold">Nexus Frontier</span> is a strategic territory
                      control game set in a cyberpunk future. You lead a syndicate competing for control of valuable
                      digital territories, resources, and influence.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Your goal is to expand your syndicate's power by claiming territories, upgrading your
                      infrastructure, deploying agents, and forming strategic alliances.
                    </p>
                    <div className="mt-2 flex items-center">
                      <div className="h-0.5 flex-grow bg-gradient-to-r from-neon-purple to-transparent"></div>
                      <span className="text-xs text-gray-500 font-mono px-2">EOF</span>
                      <div className="h-0.5 flex-grow bg-gradient-to-l from-neon-purple to-transparent"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-green/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-900/30 to-transparent p-1 border-b border-neon-green/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-green mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-green">INITIALIZATION SEQUENCE</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[GETTING_STARTED]</div>
                  </div>
                  <div className="p-4">
                    <ol className="list-none space-y-3 relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-green via-neon-green/50 to-transparent"></div>
                      {[
                        "Connect your wallet to establish your syndicate identity",
                        "Navigate to the Territory Control tab to view the map",
                        'Claim your first territory by selecting an unclaimed hex and clicking "Claim Territory"',
                        "Begin collecting resources from your territory",
                        "Upgrade your territories to increase production and defense",
                      ].map((step, index) => (
                        <li key={index} className="pl-8 relative">
                          <div className="absolute left-0 top-1 w-6 h-6 flex items-center justify-center">
                            <div className="absolute inset-0 bg-darker-gray border border-neon-green/50 rounded-md transform rotate-45"></div>
                            <span className="relative text-neon-green text-xs font-mono">{index + 1}</span>
                          </div>
                          <p className="text-gray-300">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-blue/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-900/30 to-transparent p-1 border-b border-neon-blue/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-blue mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-blue">INTERFACE MODULES</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[NAVIGATION]</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "Territory Control",
                          desc: "View and manage your territories on the interactive map",
                          color: "purple",
                        },
                        {
                          title: "Agents",
                          desc: "Deploy and manage special units with unique abilities",
                          color: "green",
                        },
                        {
                          title: "Market",
                          desc: "Trade resources and purchase upgrades",
                          color: "blue",
                        },
                        {
                          title: "Diplomacy",
                          desc: "Form alliances and negotiate with other syndicates",
                          color: "amber",
                        },
                      ].map((module, index) => (
                        <div key={index} className="flex space-x-3 p-3 rounded-md bg-black/20 border border-gray-800">
                          <div className={`flex-shrink-0 w-1.5 h-auto bg-${module.color}-500`}></div>
                          <div>
                            <h4 className={`text-${module.color}-300 font-bold font-cyber text-sm`}>{module.title}</h4>
                            <p className="text-gray-400 text-sm mt-1">{module.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Territories Tab */}
            <TabsContent value="territories" className="space-y-6">
              <div className="grid gap-6">
                <div className="bg-darker-gray/80 rounded-md border border-neon-purple/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-900/30 to-transparent p-1 border-b border-neon-purple/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-purple mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-purple">TERRITORY CLASSIFICATION</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[TYPE_DATA]</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "Energy Nexus",
                          desc: "High energy production (10-15/h)",
                          subDesc: "Powers your operations and infrastructure",
                          color: "green",
                        },
                        {
                          name: "Data Haven",
                          desc: "High data production (10-12/h)",
                          subDesc: "Enables research and intelligence operations",
                          color: "blue",
                        },
                        {
                          name: "Material Complex",
                          desc: "High material production (12-14/h)",
                          subDesc: "Used for construction and upgrades",
                          color: "amber",
                        },
                        {
                          name: "Influence Hub",
                          desc: "High influence production (11-13/h)",
                          subDesc: "Increases your diplomatic power",
                          color: "purple",
                        },
                        {
                          name: "Balanced Sector",
                          desc: "Even resource distribution (6-7/h each)",
                          subDesc: "Versatile territories for balanced growth",
                          color: "gray",
                        },
                      ].map((type, index) => (
                        <div key={index} className="flex bg-black/30 rounded-md overflow-hidden border border-gray-800">
                          <div className={`w-1.5 bg-${type.color}-500`}></div>
                          <div className="p-3 flex-1">
                            <div className="flex items-center">
                              <h4 className={`text-${type.color}-300 font-bold font-cyber text-sm`}>{type.name}</h4>
                              <div className="ml-auto">
                                <span
                                  className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-${type.color}-900/30 text-${type.color}-300 border border-${type.color}-500/30`}
                                >
                                  {type.color === "green"
                                    ? "ENERGY"
                                    : type.color === "blue"
                                      ? "DATA"
                                      : type.color === "amber"
                                        ? "MATERIAL"
                                        : type.color === "purple"
                                          ? "INFLUENCE"
                                          : "BALANCED"}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm mt-1">{type.desc}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{type.subDesc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-blue/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-900/30 to-transparent p-1 border-b border-neon-blue/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-blue mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-blue">TERRITORY MANAGEMENT</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[CONTROL_SYSTEMS]</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber flex items-center">
                        <span className="text-neon-blue mr-2">&gt;</span>
                        CLAIMING TERRITORIES
                      </h4>
                      <p className="text-gray-300 text-sm mt-2">
                        Select an unclaimed territory and click "Claim Territory" to take control. Claiming costs
                        resources based on the territory's value.
                      </p>
                      <div className="mt-3 bg-blue-900/10 border border-blue-500/20 rounded p-2">
                        <div className="flex items-center text-xs text-blue-300 font-mono">
                          <span className="mr-1">i</span> INTEL
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Strategic territories may have higher claiming costs but offer better resource production or
                          defensive advantages.
                        </p>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber flex items-center">
                        <span className="text-neon-blue mr-2">&gt;</span>
                        UPGRADING TERRITORIES
                      </h4>
                      <p className="text-gray-300 text-sm mt-2">Territories can be upgraded in three ways:</p>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="bg-green-900/20 border border-green-500/30 rounded p-2 flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-green-900/50 border border-green-500/50 flex items-center justify-center mb-1">
                            <span className="text-neon-green text-xs font-mono">+10%</span>
                          </div>
                          <span className="text-green-300 text-xs font-cyber">PRODUCTION</span>
                          <span className="text-gray-400 text-xs mt-1">Resource generation</span>
                        </div>
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded p-2 flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/50 flex items-center justify-center mb-1">
                            <span className="text-neon-blue text-xs font-mono">+20%</span>
                          </div>
                          <span className="text-blue-300 text-xs font-cyber">STORAGE</span>
                          <span className="text-gray-400 text-xs mt-1">Resource capacity</span>
                        </div>
                        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-2 flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center mb-1">
                            <span className="text-cyan-300 text-xs font-mono">+5</span>
                          </div>
                          <span className="text-cyan-300 text-xs font-cyber">DEFENSE</span>
                          <span className="text-gray-400 text-xs mt-1">Territory security</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber flex items-center">
                        <span className="text-neon-blue mr-2">&gt;</span>
                        TERRITORY DEFENSE
                      </h4>
                      <p className="text-gray-300 text-sm mt-2">
                        Territories with higher defense are harder to capture. Strategic territories often have
                        naturally higher defense values.
                      </p>
                      <div className="mt-3 flex items-center">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                        <div className="ml-3 text-xs font-mono text-gray-400">
                          <span className="text-green-400">LOW</span> → <span className="text-yellow-400">MED</span> →{" "}
                          <span className="text-red-400">HIGH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-red/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-900/30 to-transparent p-1 border-b border-neon-red/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-red mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-red">TERRITORY COMBAT</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[CONFLICT_PROTOCOLS]</div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-300 mb-3">
                      You can attack territories controlled by other syndicates to expand your influence.
                    </p>
                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber text-sm">ATTACK SUCCESS RATE</h4>
                      <p className="text-gray-400 text-xs mt-1 mb-2">Determined by the following factors:</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-1 h-4 bg-red-500 mr-2"></div>
                          <span className="text-gray-300 text-sm">Your agent strength vs. territory defense</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1 h-4 bg-red-500 mr-2"></div>
                          <span className="text-gray-300 text-sm">Resource investment in the attack</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1 h-4 bg-red-500 mr-2"></div>
                          <span className="text-gray-300 text-sm">Strategic advantages (adjacent territories)</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-red-900/10 border border-red-500/20 rounded p-2">
                        <div className="flex items-center text-xs text-red-300 font-mono">
                          <span className="mr-1">!</span> WARNING
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Failed attacks will result in resource loss and may trigger retaliation from the defending
                          syndicate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <div className="grid gap-6">
                <div className="bg-darker-gray/80 rounded-md border border-neon-purple/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-900/30 to-transparent p-1 border-b border-neon-purple/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-purple mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-purple">RESOURCE CLASSIFICATION</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[ASSET_TYPES]</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "Energy",
                          desc: "Powers all operations and is required for most actions",
                          subDesc: "Essential for maintaining territory control",
                          color: "green",
                        },
                        {
                          name: "Data",
                          desc: "Used for research, intelligence operations, and upgrades",
                          subDesc: "Critical for technological advancement",
                          color: "blue",
                        },
                        {
                          name: "Materials",
                          desc: "Required for construction, upgrades, and agent equipment",
                          subDesc: "The physical backbone of your syndicate",
                          color: "amber",
                        },
                        {
                          name: "Influence",
                          desc: "Enhances diplomatic actions and alliance formation",
                          subDesc: "The currency of power in the digital frontier",
                          color: "purple",
                        },
                      ].map((resource, index) => (
                        <div key={index} className="relative overflow-hidden">
                          <div
                            className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-${resource.color}-500/5 blur-xl -mr-8 -mt-8`}
                          ></div>
                          <div
                            className={`flex bg-black/30 rounded-md overflow-hidden border border-${resource.color}-500/30`}
                          >
                            <div className={`w-1.5 bg-${resource.color}-500`}></div>
                            <div className="p-3 flex-1 relative">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full bg-${resource.color}-500 mr-2`}></div>
                                <h4 className={`text-${resource.color}-300 font-bold font-cyber text-sm`}>
                                  {resource.name}
                                </h4>
                                <div className="ml-auto">
                                  <span
                                    className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-${resource.color}-900/30 text-${resource.color}-300 border border-${resource.color}-500/30`}
                                  >
                                    {resource.color === "green"
                                      ? "POWER"
                                      : resource.color === "blue"
                                        ? "INFO"
                                        : resource.color === "amber"
                                          ? "MATTER"
                                          : "CONTROL"}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm mt-2">{resource.desc}</p>
                              <p className="text-gray-400 text-xs mt-1">{resource.subDesc}</p>
                              <div className={`mt-2 h-1 bg-${resource.color}-900/50 rounded-full overflow-hidden`}>
                                <div className={`h-full bg-${resource.color}-500/70 w-3/4`}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-blue/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-900/30 to-transparent p-1 border-b border-neon-blue/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-blue mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-blue">RESOURCE MANAGEMENT</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[LOGISTICS]</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-900/50 border border-blue-500/50 flex items-center justify-center mr-2">
                            <span className="text-neon-blue text-xs font-mono">01</span>
                          </div>
                          <h4 className="text-white font-bold font-cyber text-sm">PRODUCTION</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Resources are generated hourly based on your territories' production rates. Different
                          territories specialize in different resources.
                        </p>
                        <div className="mt-3 flex items-center text-xs">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                          <span className="text-green-300 font-mono">+10/h</span>
                          <span className="mx-1 text-gray-500">|</span>
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                          <span className="text-blue-300 font-mono">+8/h</span>
                          <span className="mx-1 text-gray-500">|</span>
                          <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
                          <span className="text-amber-300 font-mono">+6/h</span>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-900/50 border border-blue-500/50 flex items-center justify-center mr-2">
                            <span className="text-neon-blue text-xs font-mono">02</span>
                          </div>
                          <h4 className="text-white font-bold font-cyber text-sm">STORAGE</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Each resource has a storage limit based on your territory capacity. Upgrade storage to
                          increase these limits and prevent waste.
                        </p>
                        <div className="mt-3 flex items-center space-x-1">
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: "65%" }}></div>
                          </div>
                          <span className="text-xs font-mono text-blue-300">65%</span>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-900/50 border border-blue-500/50 flex items-center justify-center mr-2">
                            <span className="text-neon-blue text-xs font-mono">03</span>
                          </div>
                          <h4 className="text-white font-bold font-cyber text-sm">TRADING</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Use the Market to trade resources with other syndicates. Exchange rates fluctuate based on
                          supply and demand.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-1 text-xs">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                            <span className="text-green-300 font-mono">1.2:1</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                            <span className="text-blue-300 font-mono">0.8:1</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
                            <span className="text-amber-300 font-mono">1.5:1</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                            <span className="text-purple-300 font-mono">2.0:1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-amber/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-900/30 to-transparent p-1 border-b border-neon-amber/20 flex items-center">
                    <div className="w-1 h-5 bg-amber-500 mr-2"></div>
                    <h3 className="text-lg font-cyber text-amber-400">RESOURCE STRATEGY</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[OPTIMIZATION]</div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-300 mb-3">
                      Effective resource management is key to success in the digital frontier.
                    </p>
                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber text-sm mb-2">STRATEGIC PROTOCOLS</h4>
                      <div className="space-y-3">
                        {[
                          "Balance your resource production based on your strategy",
                          "Prioritize territories that produce resources you need",
                          "Upgrade storage before production reaches capacity",
                          "Trade excess resources for those you lack",
                          "Maintain emergency reserves for defense",
                        ].map((strategy, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-amber-900/50 border border-amber-500/30 flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-amber-300 text-xs font-mono">{index + 1}</span>
                            </div>
                            <p className="text-gray-300 text-sm flex-1">{strategy}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 bg-amber-900/10 border border-amber-500/20 rounded p-2">
                        <div className="flex items-center text-xs text-amber-300 font-mono">
                          <span className="mr-1">i</span> INTEL
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          The syndicate with the most efficient resource management often has the advantage in long-term
                          conflicts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Agents Tab */}
            <TabsContent value="agents" className="space-y-6">
              <div className="grid gap-6">
                <div className="bg-darker-gray/80 rounded-md border border-neon-cyan/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-900/30 to-transparent p-1 border-b border-neon-cyan/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-cyan mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-cyan">AGENT CLASSIFICATION</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[OPERATIVE_TYPES]</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          name: "INFILTRATOR",
                          desc: "Specializes in stealth operations and data extraction",
                          abilities: ["Territory Scan", "Data Theft", "Stealth Movement"],
                          color: "cyan",
                          icon: "🔍",
                        },
                        {
                          name: "ENFORCER",
                          desc: "Combat specialist with enhanced offensive capabilities",
                          abilities: ["Territory Attack", "Defense Breach", "Resource Raid"],
                          color: "red",
                          icon: "⚔️",
                        },
                        {
                          name: "TECHNICIAN",
                          desc: "Expert in systems, upgrades, and resource optimization",
                          abilities: ["Production Boost", "Defense Upgrade", "System Hack"],
                          color: "green",
                          icon: "🔧",
                        },
                      ].map((agent, index) => (
                        <div key={index} className="bg-black/30 rounded-md border border-gray-800 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r from-${agent.color}-900/30 to-transparent p-2 border-b border-${agent.color}-500/30 flex items-center`}
                          >
                            <span className="mr-2">{agent.icon}</span>
                            <h4 className={`text-${agent.color}-300 font-bold font-cyber text-sm`}>{agent.name}</h4>
                            <div className="ml-auto">
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-${agent.color}-900/30 text-${agent.color}-300 border border-${agent.color}-500/30`}
                              >
                                CLASS-{index + 1}
                              </span>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-gray-300 text-sm">{agent.desc}</p>
                            <div className="mt-3 space-y-1.5">
                              {agent.abilities.map((ability, abilityIndex) => (
                                <div key={abilityIndex} className="flex items-center">
                                  <div className={`w-1 h-3 bg-${agent.color}-500 mr-2`}></div>
                                  <span className="text-gray-300 text-xs">{ability}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-1">
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-500">ATK</span>
                                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className={`h-full bg-${agent.color}-500`}
                                    style={{
                                      width: agent.color === "red" ? "80%" : agent.color === "cyan" ? "50%" : "30%",
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-500">DEF</span>
                                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className={`h-full bg-${agent.color}-500`}
                                    style={{
                                      width: agent.color === "red" ? "60%" : agent.color === "cyan" ? "40%" : "70%",
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-500">TECH</span>
                                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className={`h-full bg-${agent.color}-500`}
                                    style={{
                                      width: agent.color === "red" ? "30%" : agent.color === "cyan" ? "70%" : "90%",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-purple/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-900/30 to-transparent p-1 border-b border-neon-purple/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-purple mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-purple">AGENT DEPLOYMENT</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[FIELD_OPS]</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-purple mr-2">&gt;</span>
                          MISSION TYPES
                        </h4>
                        <div className="mt-3 space-y-3">
                          {[
                            {
                              name: "RECONNAISSANCE",
                              desc: "Gather intelligence on territories and enemy operations",
                              time: "1h",
                              risk: "Low",
                            },
                            {
                              name: "SABOTAGE",
                              desc: "Disrupt enemy resource production or defense systems",
                              time: "3h",
                              risk: "Medium",
                            },
                            {
                              name: "EXTRACTION",
                              desc: "Steal resources or data from enemy territories",
                              time: "2h",
                              risk: "High",
                            },
                          ].map((mission, index) => (
                            <div key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-6 h-6 rounded-sm bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2 mt-0.5">
                                <span className="text-neon-purple text-xs font-mono">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h5 className="text-white text-sm">{mission.name}</h5>
                                  <div className="ml-auto flex items-center space-x-2">
                                    <span className="text-xs text-gray-400">{mission.time}</span>
                                    <span
                                      className={`text-xs ${mission.risk === "Low" ? "text-green-400" : mission.risk === "Medium" ? "text-yellow-400" : "text-red-400"}`}
                                    >
                                      {mission.risk}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-gray-300 text-xs mt-1">{mission.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-purple mr-2">&gt;</span>
                          DEPLOYMENT STRATEGY
                        </h4>
                        <p className="text-gray-300 text-sm mt-2">
                          Strategic agent deployment is crucial for expanding your syndicate's influence.
                        </p>
                        <div className="mt-3 space-y-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">i</span>
                            </div>
                            <p className="text-gray-300 text-xs flex-1">
                              Match agent specialties to mission requirements for optimal success rates.
                            </p>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">i</span>
                            </div>
                            <p className="text-gray-300 text-xs flex-1">
                              Agents can be upgraded with cybernetic enhancements to improve their capabilities.
                            </p>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">i</span>
                            </div>
                            <p className="text-gray-300 text-xs flex-1">
                              Failed missions may result in agent capture or resource loss.
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 bg-purple-900/10 border border-purple-500/20 rounded p-2">
                          <div className="flex items-center text-xs text-purple-300 font-mono">
                            <span className="mr-1">!</span> CRITICAL
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Agents require recovery time between missions. Plan deployments accordingly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-green/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-900/30 to-transparent p-1 border-b border-neon-green/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-green mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-green">AGENT UPGRADES</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[ENHANCEMENT]</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          name: "NEURAL IMPLANTS",
                          desc: "Enhance cognitive abilities and hacking skills",
                          bonus: "+20% Tech Efficiency",
                          cost: "500 Data, 300 Energy",
                        },
                        {
                          name: "COMBAT AUGMENTS",
                          desc: "Physical enhancements for combat operations",
                          bonus: "+25% Attack Power",
                          cost: "400 Materials, 350 Energy",
                        },
                        {
                          name: "STEALTH SYSTEMS",
                          desc: "Advanced cloaking and infiltration tech",
                          bonus: "+30% Mission Success Rate",
                          cost: "450 Data, 250 Materials",
                        },
                      ].map((upgrade, index) => (
                        <div key={index} className="bg-black/30 p-3 rounded-md border border-gray-800">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-900/50 border border-green-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-green text-xs font-mono">{index + 1}</span>
                            </div>
                            <h4 className="text-white font-bold font-cyber text-sm">{upgrade.name}</h4>
                          </div>
                          <p className="text-gray-300 text-sm mt-2">{upgrade.desc}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-neon-green text-xs font-mono">{upgrade.bonus}</span>
                            <span className="text-gray-400 text-xs">{upgrade.cost}</span>
                          </div>
                          <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-green-300"
                              style={{ width: `${(index + 1) * 25}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="space-y-6">
              <div className="grid gap-6">
                <div className="bg-darker-gray/80 rounded-md border border-neon-blue/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-900/30 to-transparent p-1 border-b border-neon-blue/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-blue mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-blue">MAP INTERACTION</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[TERRITORY_LAYOUT]</div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-300 mb-3">
                      The map is divided into hexagonal territories, each with its own resource production and defensive
                      capabilities.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-blue mr-2">&gt;</span>
                          NAVIGATION CONTROLS
                        </h4>
                        <div className="mt-3 space-y-2">
                          {[
                            "Zoom in/out with mouse wheel or buttons",
                            "Pan by dragging the map",
                            "Reset view button to return to default view",
                            "Scale limits: 0.5x to 2x",
                          ].map((control, index) => (
                            <div key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mr-2 mt-0.5">
                                <span className="text-blue-300 text-xs font-mono">{index + 1}</span>
                              </div>
                              <p className="text-gray-300 text-sm flex-1">{control}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-blue mr-2">&gt;</span>
                          TERRITORY INTERACTION
                        </h4>
                        <div className="mt-3 space-y-2">
                          {[
                            "Hover effects with scaling and glow",
                            "Territory tooltips showing name and description",
                            "Click to select territories",
                            "Visual feedback for alliance ownership",
                          ].map((interaction, index) => (
                            <div key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mr-2 mt-0.5">
                                <span className="text-blue-300 text-xs font-mono">{index + 1}</span>
                              </div>
                              <p className="text-gray-300 text-sm flex-1">{interaction}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber flex items-center">
                        <span className="text-neon-blue mr-2">&gt;</span>
                        VISUAL STATES
                      </h4>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Base State</h5>
                          <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                            <li>Resource-based coloring</li>
                            <li>Standard glow (2x)</li>
                            <li>Normal scale</li>
                          </ul>
                        </div>
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Hover State</h5>
                          <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                            <li>Scale: 1.05x</li>
                            <li>Enhanced glow (4x)</li>
                            <li>Tooltip display</li>
                          </ul>
                        </div>
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Selected State</h5>
                          <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                            <li>Maximum glow (5x)</li>
                            <li>Thicker border (3px)</li>
                            <li>Detailed info panel</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-purple/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-900/30 to-transparent p-1 border-b border-neon-purple/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-purple mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-purple">HEX TILE VISUAL ARCHITECTURE</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[VISUAL_SYSTEM]</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-purple mr-2">&gt;</span>
                          CORE VISUAL ELEMENTS
                        </h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">1</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Hexagonal Grid</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                SVG polygons with resource-based pattern overlays
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">2</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Neon Glow Effects</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                SVG filters with variable intensity based on state
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">3</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Dynamic Color System</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Color-coded by territory type and ownership
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-purple mr-2">&gt;</span>
                          RESOURCE VISUALIZATION
                        </h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">1</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Color-Coded Borders</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Energy: green, Data: blue, Materials: orange, Influence: purple
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">2</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Pattern Intensity</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                45-degree line patterns with opacity based on production level
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">3</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Resource Production Bars</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Mini-bars with production values in territory info
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber flex items-center">
                        <span className="text-neon-purple mr-2">&gt;</span>
                        TERRITORY INFORMATION DISPLAY
                      </h4>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Level & Defense</h5>
                          <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                            <li>Level: Top center position</li>
                            <li>Defense: Center position</li>
                            <li>Numeric indicators with icons</li>
                          </ul>
                        </div>
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Resource Production</h5>
                          <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                            <li>Bottom row position</li>
                            <li>Color-coded by resource type</li>
                            <li>Production values displayed</li>
                          </ul>
                        </div>
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Ownership</h5>
                          <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                            <li>Alliance-specific colors</li>
                            <li>Medium glow effect (3x)</li>
                            <li>Alliance icon displayed</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-cyan/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-900/30 to-transparent p-1 border-b border-neon-cyan/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-cyan mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-cyan">VISUAL INTERACTION FEEDBACK</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[INTERFACE_DYNAMICS]</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-cyan mr-2">&gt;</span>
                          INTERACTION FEEDBACK
                        </h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-cyan text-xs font-mono">1</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Hover Highlighting</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Territories scale up and glow brighter when hovered
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-cyan text-xs font-mono">2</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Selection State</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Maximum glow and thicker border for selected territories
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-cyan text-xs font-mono">3</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Resource Level Feedback</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Dynamic resource bars update in real-time with production changes
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-cyan mr-2">&gt;</span>
                          PERFORMANCE OPTIMIZATIONS
                        </h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-cyan text-xs font-mono">1</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Smooth Transitions</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                CSS transitions for all state changes ensure fluid experience
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-cyan text-xs font-mono">2</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Event Debouncing</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Prevents performance issues during rapid interactions
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-cyan text-xs font-mono">3</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Hardware Acceleration</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Transform and opacity changes for optimal rendering performance
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber flex items-center">
                        <span className="text-neon-cyan mr-2">&gt;</span>
                        INTERACTIVE TERRITORY STATES
                      </h4>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                          <div className="aspect-w-1 aspect-h-1">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 bg-black border-2 border-gray-700 transform rotate-45 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-transparent"></div>
                                <div
                                  className="absolute inset-0 opacity-20"
                                  style={{
                                    backgroundImage:
                                      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0, 255, 0, 0.2) 5px, rgba(0, 255, 0, 0.2) 10px)",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <h5 className="text-white text-xs font-bold">Unclaimed</h5>
                            <p className="text-gray-400 text-xs">Resource-based coloring</p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="aspect-w-1 aspect-h-1">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 bg-black border-2 border-blue-500 transform rotate-45 relative overflow-hidden scale-105 shadow-[0_0_10px_rgba(0,170,255,0.5)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent"></div>
                                <div
                                  className="absolute inset-0 opacity-30"
                                  style={{
                                    backgroundImage:
                                      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0, 170, 255, 0.2) 5px, rgba(0, 170, 255, 0.2) 10px)",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <h5 className="text-white text-xs font-bold">Hover</h5>
                            <p className="text-gray-400 text-xs">Enhanced glow, scaled</p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="aspect-w-1 aspect-h-1">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 bg-black border-3 border-purple-500 transform rotate-45 relative overflow-hidden shadow-[0_0_15px_rgba(176,38,255,0.7)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-transparent"></div>
                                <div
                                  className="absolute inset-0 opacity-40"
                                  style={{
                                    backgroundImage:
                                      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(176, 38, 255, 0.2) 5px, rgba(176, 38, 255, 0.2) 10px)",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <h5 className="text-white text-xs font-bold">Selected</h5>
                            <p className="text-gray-400 text-xs">Maximum glow, thick border</p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="aspect-w-1 aspect-h-1">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 bg-black border-2 border-cyan-500 transform rotate-45 relative overflow-hidden shadow-[0_0_12px_rgba(0,255,255,0.5)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-transparent"></div>
                                <div
                                  className="absolute inset-0 opacity-30"
                                  style={{
                                    backgroundImage:
                                      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0, 255, 255, 0.2) 5px, rgba(0, 255, 255, 0.2) 10px)",
                                  }}
                                ></div>
                                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-black/60 rounded px-1 text-[8px] text-cyan-400">
                                  OWNED
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <h5 className="text-white text-xs font-bold">Owned</h5>
                            <p className="text-gray-400 text-xs">Alliance-specific colors</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-green/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-900/30 to-transparent p-1 border-b border-neon-green/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-green mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-green">TERRITORY LAYOUT STRATEGY</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[TERRITORY_PLANNING]</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-green mr-2">&gt;</span>
                          MAP STRUCTURE
                        </h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/50 border border-green-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-green text-xs font-mono">1</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Central Territories</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Core gameplay zones with balanced resources
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/50 border border-green-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-green text-xs font-mono">2</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Resource-Rich Territories</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Specialized production with high output of specific resources
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/50 border border-green-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-green text-xs font-mono">3</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Defensive Positions</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                High-defense territories at strategic locations
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-green mr-2">&gt;</span>
                          TERRITORY TYPES
                        </h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/50 border border-green-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-green text-xs font-mono">1</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Energy Nexus</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                High energy production (15/h), low other resources
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/50 border border-green-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-green text-xs font-mono">2</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Data Haven</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                High data processing (12/h), moderate defense
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/50 border border-green-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-green text-xs font-mono">3</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Balanced Sectors</h5>
                              <p className="text-gray-300 text-xs mt-0.5">Even distribution (6-7/h each resource)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber flex items-center">
                        <span className="text-neon-green mr-2">&gt;</span>
                        RESOURCE DISTRIBUTION EXAMPLES
                      </h4>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Resource-Rich Territory</h5>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Energy:</span>
                              <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: "75%" }}></div>
                              </div>
                              <span className="text-xs text-gray-400">15/h</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Data:</span>
                              <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: "13%" }}></div>
                              </div>
                              <span className="text-xs text-gray-400">2/h</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Materials:</span>
                              <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: "20%" }}></div>
                              </div>
                              <span className="text-xs text-gray-400">3/h</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Influence:</span>
                              <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: "7%" }}></div>
                              </div>
                              <span className="text-xs text-gray-400">1/h</span>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Balanced Territory</h5>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Energy:</span>
                              <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: "47%" }}></div>
                              </div>
                              <span className="text-xs text-gray-400">7/h</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Data:</span>
                              <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: "47%" }}></div>
                              </div>
                              <span className="text-xs text-gray-400">7/h</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Materials:</span>
                              <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: "47%" }}></div>
                              </div>
                              <span className="text-xs text-gray-400">7/h</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Influence:</span>
                              <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: "47%" }}></div>
                              </div>
                              <span className="text-xs text-gray-400">7/h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Strategy Tab */}
            <TabsContent value="strategy" className="space-y-6">
              <div className="grid gap-6">
                <div className="bg-darker-gray/80 rounded-md border border-neon-blue/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-900/30 to-transparent p-1 border-b border-neon-blue/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-blue mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-blue">STRATEGIC OVERVIEW</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[CORE_DIRECTIVES]</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-blue mr-2">&gt;</span>
                          EARLY GAME STRATEGY
                        </h4>
                        <div className="mt-3 space-y-2">
                          {[
                            "Focus on claiming territories with balanced resource production",
                            "Establish a core network of connected territories",
                            "Prioritize energy and materials for initial expansion",
                            "Scout nearby territories to identify high-value targets",
                            "Avoid early conflicts with powerful syndicates",
                          ].map((strategy, index) => (
                            <div key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mr-2 mt-0.5">
                                <span className="text-blue-300 text-xs font-mono">{index + 1}</span>
                              </div>
                              <p className="text-gray-300 text-sm flex-1">{strategy}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-blue mr-2">&gt;</span>
                          MID GAME STRATEGY
                        </h4>
                        <div className="mt-3 space-y-2">
                          {[
                            "Upgrade key territories to maximize resource production",
                            "Establish defensive perimeters around your core territories",
                            "Form strategic alliances with neighboring syndicates",
                            "Begin specialized agent operations against competitors",
                            "Diversify your resource production to prevent shortages",
                          ].map((strategy, index) => (
                            <div key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mr-2 mt-0.5">
                                <span className="text-blue-300 text-xs font-mono">{index + 1}</span>
                              </div>
                              <p className="text-gray-300 text-sm flex-1">{strategy}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber flex items-center">
                        <span className="text-neon-blue mr-2">&gt;</span>
                        LATE GAME STRATEGY
                      </h4>
                      <div className="mt-3 space-y-2">
                        {[
                          "Focus on controlling strategic chokepoints and high-value territories",
                          "Deploy elite agents for high-risk, high-reward operations",
                          "Maintain a robust defense network with upgraded territories",
                          "Leverage alliances to coordinate attacks on dominant syndicates",
                          "Stockpile resources for sustained conflict and rapid expansion",
                        ].map((strategy, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-blue-300 text-xs font-mono">{index + 1}</span>
                            </div>
                            <p className="text-gray-300 text-sm flex-1">{strategy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-purple/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-900/30 to-transparent p-1 border-b border-neon-purple/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-purple mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-purple">ALLIANCE DYNAMICS</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[DIPLOMATIC_PROTOCOLS]</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-purple mr-2">&gt;</span>
                          ALLIANCE BENEFITS
                        </h4>
                        <div className="mt-3 space-y-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">+</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Mutual Defense</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Allied territories provide defensive support to each other
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">+</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Resource Trading</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Favorable exchange rates when trading with allies
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-purple text-xs font-mono">+</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Shared Intelligence</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Access to ally's territory information and enemy data
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-purple mr-2">&gt;</span>
                          ALLIANCE RISKS
                        </h4>
                        <div className="mt-3 space-y-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-red-400 text-xs font-mono">!</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Betrayal</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Allies may turn against you when advantageous
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-red-400 text-xs font-mono">!</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Shared Enemies</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                You may become a target due to your ally's conflicts
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mr-2">
                              <span className="text-red-400 text-xs font-mono">!</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Resource Dependency</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Over-reliance on ally resources can be exploited
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-red/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-900/30 to-transparent p-1 border-b border-neon-red/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-red mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-red">COMBAT TACTICS</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[WARFARE_PROTOCOLS]</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          name: "BLITZ ATTACK",
                          desc: "Rapid assault on multiple enemy territories simultaneously",
                          strength: "Overwhelming force, difficult to defend against",
                          weakness: "High resource cost, leaves your territories vulnerable",
                        },
                        {
                          name: "SURGICAL STRIKE",
                          desc: "Precision attacks on high-value enemy territories",
                          strength: "Resource efficient, minimal exposure",
                          weakness: "Limited territorial gains, requires precise intelligence",
                        },
                        {
                          name: "SIEGE WARFARE",
                          desc: "Gradually weaken enemy territories before attacking",
                          strength: "High success rate, lower resource cost per attack",
                          weakness: "Time-consuming, gives enemy time to prepare",
                        },
                      ].map((tactic, index) => (
                        <div key={index} className="bg-black/30 p-3 rounded-md border border-gray-800">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-900/50 border border-red-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-red text-xs font-mono">{index + 1}</span>
                            </div>
                            <h4 className="text-white font-bold font-cyber text-sm">{tactic.name}</h4>
                          </div>
                          <p className="text-gray-300 text-sm mt-2">{tactic.desc}</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 rounded-sm bg-green-900/50 border border-green-500/30 flex items-center justify-center mr-2">
                                <span className="text-green-400 text-xs font-mono">+</span>
                              </div>
                              <p className="text-gray-300 text-xs flex-1">{tactic.strength}</p>
                            </div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 rounded-sm bg-red-900/50 border border-red-500/30 flex items-center justify-center mr-2">
                                <span className="text-red-400 text-xs font-mono">-</span>
                              </div>
                              <p className="text-gray-300 text-xs flex-1">{tactic.weakness}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 bg-red-900/10 border border-red-500/20 rounded p-2">
                      <div className="flex items-center text-xs text-red-300 font-mono">
                        <span className="mr-1">!</span> CRITICAL
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Always maintain a strategic reserve of resources for defense in case of counterattacks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-orange/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-900/30 to-transparent p-1 border-b border-neon-orange/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-orange mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-orange">DEFENSE MECHANICS</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[SECURITY_PROTOCOLS]</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-orange mr-2">&gt;</span>
                          DEFENSE BALANCING
                        </h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-900/50 border border-orange-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-orange text-xs font-mono">1</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">High-Value Targets</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Defense rating: 12-15, requires significant force to capture
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-900/50 border border-orange-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-orange text-xs font-mono">2</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Resource-Rich Zones</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Defense rating: 8-11, balanced for risk vs. reward
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-900/50 border border-orange-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-orange text-xs font-mono">3</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Balanced Territories</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Defense rating: 10-11, standard defensive capabilities
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-900/50 border border-orange-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-orange text-xs font-mono">4</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Strategic Locations</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Defense rating: Variable based on position and importance
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <h4 className="text-white font-bold font-cyber flex items-center">
                          <span className="text-neon-orange mr-2">&gt;</span>
                          DEFENSIVE STRATEGIES
                        </h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-900/50 border border-orange-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-orange text-xs font-mono">1</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Chokepoint Control</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Secure territories that limit access to your core regions
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-900/50 border border-orange-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-orange text-xs font-mono">2</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Buffer Zones</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Create layers of territories to absorb initial attacks
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-900/50 border border-orange-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-orange text-xs font-mono">3</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Defensive Network</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Connected territories provide mutual defensive bonuses
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-900/50 border border-orange-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-orange text-xs font-mono">4</span>
                            </div>
                            <div>
                              <h5 className="text-white text-sm">Agent Deployment</h5>
                              <p className="text-gray-300 text-xs mt-0.5">
                                Station agents in key territories to boost defense
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                      <h4 className="text-white font-bold font-cyber flex items-center">
                        <span className="text-neon-orange mr-2">&gt;</span>
                        DEFENSE UPGRADES
                      </h4>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Firewall Systems</h5>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Base Defense:</span>
                              <span className="text-xs text-orange-400">+2</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Energy Cost:</span>
                              <span className="text-xs text-green-400">50</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Data Cost:</span>
                              <span className="text-xs text-blue-400">75</span>
                            </div>
                            <p className="text-gray-300 text-xs mt-1">
                              Provides basic protection against standard attacks
                            </p>
                          </div>
                        </div>
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Neural Barriers</h5>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Base Defense:</span>
                              <span className="text-xs text-orange-400">+4</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Energy Cost:</span>
                              <span className="text-xs text-green-400">100</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Data Cost:</span>
                              <span className="text-xs text-blue-400">150</span>
                            </div>
                            <p className="text-gray-300 text-xs mt-1">
                              Advanced protection with counter-intrusion capabilities
                            </p>
                          </div>
                        </div>
                        <div className="border border-gray-700 rounded p-2 bg-black/50">
                          <h5 className="text-white text-sm font-bold mb-2">Quantum Shield</h5>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Base Defense:</span>
                              <span className="text-xs text-orange-400">+7</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Energy Cost:</span>
                              <span className="text-xs text-green-400">200</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Data Cost:</span>
                              <span className="text-xs text-blue-400">300</span>
                            </div>
                            <p className="text-gray-300 text-xs mt-1">
                              Elite defense system with predictive counter-measures
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-darker-gray/80 rounded-md border border-neon-red/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-900/30 to-transparent p-1 border-b border-neon-red/20 flex items-center">
                    <div className="w-1 h-5 bg-neon-red mr-2"></div>
                    <h3 className="text-lg font-cyber text-neon-red">COMBAT TACTICS</h3>
                    <div className="ml-auto text-xs text-gray-500 font-mono">[WARFARE_PROTOCOLS]</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          name: "BLITZ ATTACK",
                          desc: "Rapid assault on multiple enemy territories simultaneously",
                          strength: "Overwhelming force, difficult to defend against",
                          weakness: "High resource cost, leaves your territories vulnerable",
                        },
                        {
                          name: "SURGICAL STRIKE",
                          desc: "Precision attacks on high-value enemy territories",
                          strength: "Resource efficient, minimal exposure",
                          weakness: "Limited territorial gains, requires precise intelligence",
                        },
                        {
                          name: "SIEGE WARFARE",
                          desc: "Gradually weaken enemy territories before attacking",
                          strength: "High success rate, lower resource cost per attack",
                          weakness: "Time-consuming, gives enemy time to prepare",
                        },
                      ].map((tactic, index) => (
                        <div key={index} className="bg-black/30 p-3 rounded-md border border-gray-800">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-900/50 border border-red-500/30 flex items-center justify-center mr-2">
                              <span className="text-neon-red text-xs font-mono">{index + 1}</span>
                            </div>
                            <h4 className="text-white font-bold font-cyber text-sm">{tactic.name}</h4>
                          </div>
                          <p className="text-gray-300 text-sm mt-2">{tactic.desc}</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 rounded-sm bg-green-900/50 border border-green-500/30 flex items-center justify-center mr-2">
                                <span className="text-green-400 text-xs font-mono">+</span>
                              </div>
                              <p className="text-gray-300 text-xs flex-1">{tactic.strength}</p>
                            </div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 rounded-sm bg-red-900/50 border border-red-500/30 flex items-center justify-center mr-2">
                                <span className="text-red-400 text-xs font-mono">-</span>
                              </div>
                              <p className="text-gray-300 text-xs flex-1">{tactic.weakness}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 bg-red-900/10 border border-red-500/20 rounded p-2">
                      <div className="flex items-center text-xs text-red-300 font-mono">
                        <span className="mr-1">!</span> CRITICAL
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Always maintain a strategic reserve of resources for defense in case of counterattacks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
