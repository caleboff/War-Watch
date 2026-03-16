import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CONFLICTS = [
  { id:1,  name:"Russia–Ukraine War",         countries:["Russia","Ukraine"],               lat:49.0,  lng:31.0,  start:2022, end:null, intensity:"high",   region:"Europe",      deaths:"500,000+",   type:"Interstate",   cause:"Territorial/Political" },
  { id:2,  name:"Gaza–Israel War",            countries:["Israel","Palestine"],             lat:31.5,  lng:34.5,  start:2023, end:null, intensity:"high",   region:"Middle East", deaths:"45,000+",    type:"Interstate",   cause:"Territorial/Political" },
  { id:3,  name:"Sudan Civil War",            countries:["Sudan"],                          lat:15.0,  lng:30.0,  start:2023, end:null, intensity:"high",   region:"Africa",      deaths:"20,000+",    type:"Civil War",    cause:"Power struggle" },
  { id:4,  name:"Myanmar Civil War",          countries:["Myanmar"],                        lat:19.0,  lng:96.0,  start:2021, end:null, intensity:"high",   region:"Asia",        deaths:"50,000+",    type:"Civil War",    cause:"Military coup" },
  { id:5,  name:"Sahel Insurgency",           countries:["Mali","Burkina Faso","Niger"],    lat:14.0,  lng:0.0,   start:2012, end:null, intensity:"high",   region:"Africa",      deaths:"30,000+",    type:"Insurgency",   cause:"Jihadist extremism" },
  { id:6,  name:"Yemen Civil War",            countries:["Yemen"],                          lat:15.5,  lng:48.0,  start:2015, end:null, intensity:"high",   region:"Middle East", deaths:"377,000+",   type:"Civil War",    cause:"Political/Sectarian" },
  { id:7,  name:"Somalia Conflict",           countries:["Somalia"],                        lat:6.0,   lng:46.0,  start:1991, end:null, intensity:"medium", region:"Africa",      deaths:"500,000+",   type:"Civil War",    cause:"State collapse" },
  { id:8,  name:"DRC Eastern Conflict",       countries:["DR Congo"],                       lat:-1.5,  lng:29.0,  start:1996, end:null, intensity:"high",   region:"Africa",      deaths:"6,000,000+", type:"Civil War",    cause:"Ethnic/Resources" },
  { id:9,  name:"Syrian Civil War",           countries:["Syria"],                          lat:34.8,  lng:38.9,  start:2011, end:null, intensity:"medium", region:"Middle East", deaths:"500,000+",   type:"Civil War",    cause:"Arab Spring" },
  { id:10, name:"Afghan Insurgency",          countries:["Afghanistan"],                    lat:33.0,  lng:65.0,  start:2021, end:null, intensity:"medium", region:"Asia",        deaths:"200,000+",   type:"Insurgency",   cause:"Taliban/ISIS-K" },
  { id:11, name:"Ethiopia–Tigray War",        countries:["Ethiopia"],                       lat:14.0,  lng:39.0,  start:2020, end:2022, intensity:"medium", region:"Africa",      deaths:"300,000+",   type:"Civil War",    cause:"Political/Ethnic" },
  { id:12, name:"Nagorno-Karabakh",           countries:["Armenia","Azerbaijan"],           lat:40.0,  lng:46.5,  start:1988, end:2023, intensity:"low",    region:"Caucasus",    deaths:"30,000+",    type:"Interstate",   cause:"Territorial" },
  { id:13, name:"Iraq Instability",           countries:["Iraq"],                           lat:33.0,  lng:44.0,  start:2014, end:null, intensity:"low",    region:"Middle East", deaths:"200,000+",   type:"Insurgency",   cause:"ISIS remnants" },
  { id:14, name:"Cameroon Anglophone Crisis", countries:["Cameroon"],                       lat:5.5,   lng:10.0,  start:2017, end:null, intensity:"medium", region:"Africa",      deaths:"6,000+",     type:"Civil War",    cause:"Separatism" },
  { id:15, name:"Mozambique Insurgency",      countries:["Mozambique"],                     lat:-13.0, lng:35.5,  start:2017, end:null, intensity:"medium", region:"Africa",      deaths:"4,000+",     type:"Insurgency",   cause:"Jihadist extremism" },
  { id:16, name:"Nigeria (Boko Haram)",       countries:["Nigeria"],                        lat:11.5,  lng:13.0,  start:2009, end:null, intensity:"medium", region:"Africa",      deaths:"350,000+",   type:"Insurgency",   cause:"Jihadist extremism" },
  { id:17, name:"Libyan Civil War",           countries:["Libya"],                          lat:27.0,  lng:17.0,  start:2014, end:null, intensity:"low",    region:"Africa",      deaths:"25,000+",    type:"Civil War",    cause:"Post-Gaddafi vacuum" },
  { id:18, name:"Haiti Gang War",             countries:["Haiti"],                          lat:19.0,  lng:-72.3, start:2021, end:null, intensity:"high",   region:"Americas",    deaths:"5,000+",     type:"Criminal",     cause:"State collapse" },
  { id:19, name:"Colombia FARC Remnants",     countries:["Colombia"],                       lat:4.0,   lng:-73.0, start:2016, end:null, intensity:"low",    region:"Americas",    deaths:"1,000+",     type:"Insurgency",   cause:"Post-peace dissidents" },
  { id:20, name:"Mexico Drug War",            countries:["Mexico"],                         lat:24.0,  lng:-102.0,start:2006, end:null, intensity:"high",   region:"Americas",    deaths:"350,000+",   type:"Criminal",     cause:"Cartel violence" },
  { id:21, name:"World War II",               countries:["Germany","Japan","Allied Powers"],lat:48.0,  lng:15.0,  start:1939, end:1945, intensity:"high",   region:"Global",      deaths:"70,000,000+",type:"Interstate",   cause:"Fascism/Expansion" },
  { id:22, name:"World War I",                countries:["Germany","Austria","Allied"],     lat:49.0,  lng:6.0,   start:1914, end:1918, intensity:"high",   region:"Global",      deaths:"20,000,000+",type:"Interstate",   cause:"Alliance systems" },
  { id:23, name:"Vietnam War",                countries:["Vietnam","USA"],                  lat:16.0,  lng:107.0, start:1955, end:1975, intensity:"high",   region:"Asia",        deaths:"3,500,000+", type:"Interstate",   cause:"Cold War" },
  { id:24, name:"Korean War",                 countries:["North Korea","South Korea"],      lat:37.5,  lng:127.5, start:1950, end:1953, intensity:"high",   region:"Asia",        deaths:"5,000,000+", type:"Interstate",   cause:"Cold War/Division" },
  { id:25, name:"Gulf War",                   countries:["Iraq","Coalition"],               lat:29.0,  lng:48.0,  start:1990, end:1991, intensity:"high",   region:"Middle East", deaths:"100,000+",   type:"Interstate",   cause:"Iraq invasion Kuwait" },
  { id:26, name:"Rwandan Genocide",           countries:["Rwanda"],                         lat:-2.0,  lng:29.9,  start:1994, end:1994, intensity:"high",   region:"Africa",      deaths:"800,000+",   type:"Genocide",     cause:"Ethnic hatred" },
  { id:27, name:"Bosnian War",                countries:["Bosnia","Serbia","Croatia"],      lat:44.0,  lng:17.5,  start:1992, end:1995, intensity:"high",   region:"Europe",      deaths:"100,000+",   type:"Civil War",    cause:"Yugoslav dissolution" },
  { id:28, name:"Iran–Iraq War",              countries:["Iran","Iraq"],                    lat:32.0,  lng:48.0,  start:1980, end:1988, intensity:"high",   region:"Middle East", deaths:"1,000,000+", type:"Interstate",   cause:"Territorial/Ideological" },
  { id:29, name:"Soviet–Afghan War",          countries:["USSR","Afghanistan"],             lat:33.9,  lng:66.0,  start:1979, end:1989, intensity:"high",   region:"Asia",        deaths:"2,000,000+", type:"Interstate",   cause:"Cold War" },
  { id:30, name:"Six-Day War",                countries:["Israel","Egypt","Syria"],         lat:31.0,  lng:35.0,  start:1967, end:1967, intensity:"high",   region:"Middle East", deaths:"20,000+",    type:"Interstate",   cause:"Arab-Israeli conflict" },
  { id:31, name:"Algerian War",               countries:["Algeria","France"],               lat:28.0,  lng:2.5,   start:1954, end:1962, intensity:"high",   region:"Africa",      deaths:"1,000,000+", type:"Colonial",     cause:"Independence" },
  { id:32, name:"Chinese Civil War",          countries:["China"],                          lat:35.0,  lng:105.0, start:1927, end:1949, intensity:"high",   region:"Asia",        deaths:"8,000,000+", type:"Civil War",    cause:"Communist vs Nationalist" },
  { id:33, name:"Spanish Civil War",          countries:["Spain"],                          lat:40.0,  lng:-4.0,  start:1936, end:1939, intensity:"high",   region:"Europe",      deaths:"500,000+",   type:"Civil War",    cause:"Political/Ideological" },
  { id:34, name:"Iraq War (2003)",            countries:["Iraq","USA","Coalition"],         lat:33.3,  lng:44.4,  start:2003, end:2011, intensity:"high",   region:"Middle East", deaths:"600,000+",   type:"Interstate",   cause:"WMD/War on Terror" },
  { id:35, name:"NATO–Afghanistan War",       countries:["Afghanistan","USA","NATO"],       lat:34.5,  lng:69.2,  start:2001, end:2021, intensity:"high",   region:"Asia",        deaths:"240,000+",   type:"Interstate",   cause:"9/11 response" },
  { id:36, name:"South Sudan Civil War",      countries:["South Sudan"],                    lat:6.9,   lng:31.3,  start:2013, end:2020, intensity:"high",   region:"Africa",      deaths:"400,000+",   type:"Civil War",    cause:"Political/Ethnic" },
  { id:37, name:"Falklands War",              countries:["Argentina","UK"],                 lat:-51.7, lng:-59.0, start:1982, end:1982, intensity:"high",   region:"Americas",    deaths:"900+",       type:"Interstate",   cause:"Territorial" },
  { id:38, name:"Congo Crisis",               countries:["DR Congo"],                       lat:-4.0,  lng:23.0,  start:1960, end:1965, intensity:"high",   region:"Africa",      deaths:"100,000+",   type:"Civil War",    cause:"Post-colonial" },
];

const INTENSITY_COLOR = { high:"#E84040", medium:"#E87D20", low:"#D4C244" };
const RESOLVED_COLOR = "#4A7A8A";
const REGIONS = ["All Regions","Africa","Middle East","Europe","Asia","Americas","Caucasus","Global"];
const TYPES = ["All Types","Interstate","Civil War","Insurgency","Genocide","Criminal","Colonial"];

const conflictsByDecade = [
  {decade:"1910s",count:12},{decade:"1920s",count:6},{decade:"1930s",count:9},
  {decade:"1940s",count:18},{decade:"1950s",count:14},{decade:"1960s",count:22},
  {decade:"1970s",count:19},{decade:"1980s",count:21},{decade:"1990s",count:28},
  {decade:"2000s",count:24},{decade:"2010s",count:31},{decade:"2020s",count:22},
];
const byRegion = [
  {region:"Africa",count:24},{region:"Middle East",count:18},{region:"Asia",count:15},
  {region:"Europe",count:8},{region:"Americas",count:11},{region:"Global",count:4},
];
const byType = [
  {name:"Civil War",value:38},{name:"Interstate",value:28},{name:"Insurgency",value:22},
  {name:"Genocide",value:5},{name:"Criminal",value:4},{name:"Other",value:3},
];

function FilterBtn({label,active,onClick}){
  return(
    <button onClick={onClick} style={{
      background:active?"rgba(200,168,75,0.12)":"transparent",
      color:active?"#C8A84B":"#7A8A94",border:"none",
      padding:"5px 14px",textAlign:"left",cursor:"pointer",
      fontSize:10,letterSpacing:1,fontFamily:"'IBM Plex Mono',monospace",
      borderLeft:active?"2px solid #C8A84B":"2px solid transparent",
      transition:"all 0.15s",width:"100%",
    }}>{label}</button>
  );
}

function SideSection({title,children}){
  return(
    <div style={{borderBottom:"1px solid #1C2A35",paddingBottom:8}}>
      <div style={{padding:"10px 14px 6px",fontSize:9,letterSpacing:2,color:"#3A4A54",fontWeight:700}}>{title}</div>
      {children}
    </div>
  );
}

function BriefingText({text}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {text.split("\n").map((line,i)=>{
        if(!line.trim())return null;
        const isHeader=/^[A-Z ]{4,}$/.test(line.trim())&&line.trim().length<35;
        return(
          <div key={i} style={isHeader
            ?{fontSize:8,color:"#C8A84B",letterSpacing:2,marginTop:6,borderLeft:"2px solid #C8A84B",paddingLeft:6,fontWeight:700}
            :{fontSize:10,color:"#A0B0B8",lineHeight:1.7}}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

function ChartCard({title,children}){
  return(
    <div style={{background:"#0E1419",border:"1px solid #1C2A35",padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:3,height:12,background:"#C8A84B"}}/>
        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#C8A84B",letterSpacing:2}}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("MAP");
  const [selected, setSelected] = useState(null);
  const [year, setYear] = useState(2025);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [showResolved, setShowResolved] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [apiInput, setApiInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [briefing, setBriefing] = useState(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = CONFLICTS.filter(c=>{
    if(search){const q=search.toLowerCase();if(!c.name.toLowerCase().includes(q)&&!c.countries.join().toLowerCase().includes(q)&&!String(c.start).includes(q))return false;}
    if(regionFilter!=="All Regions"&&c.region!==regionFilter)return false;
    if(typeFilter!=="All Types"&&c.type!==typeFilter)return false;
    if(showResolved===true&&c.end===null)return false;
    if(showResolved===false&&c.end!==null)return false;
    return true;
  });

  const activeCount = CONFLICTS.filter(c=>c.end===null).length;

  const fetchBriefing = (conflict) => {
    if(!apiKey||!conflict)return;
    setBriefing(null);setLoadingBriefing(true);
    fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:900,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        messages:[{role:"user",content:`You are a neutral intelligence analyst. Write a structured conflict briefing for: "${conflict.name}" (${conflict.start}–${conflict.end||"present"}).

Include exactly these section headers on their own line in ALL CAPS:
BACKGROUND
KEY FACTIONS
CURRENT STATUS
HUMANITARIAN IMPACT
GEOPOLITICAL STAKES
ASSESSMENT

Write 2-3 sentences per section. Be factual and neutral. Use present tense for ongoing conflicts.`}],
      })
    }).then(r=>r.json()).then(d=>{
      const text=d.content?.filter(b=>b.type==="text").map(b=>b.text).join("\n")||"No data available.";
      setBriefing(text);
    }).catch(e=>setBriefing("SIGNAL LOST: "+e.message)).finally(()=>setLoadingBriefing(false));
  };

  const handleSelect = (c) => { setSelected(c); setBriefing(null); if(apiKey) setTimeout(()=>fetchBriefing(c),100); };

  const mapFiltered = filtered.filter(c=>{
    const started=c.start<=year;
    const active=c.end===null||c.end>=year;
    return started&&active;
  });

  const MIN=1900,MAX=2025;
  const pct=(year-MIN)/(MAX-MIN)*100;
  const eras=[{y:1914,label:"WWI"},{y:1939,label:"WWII"},{y:1950,label:"KOREA"},{y:1965,label:"VIETNAM"},{y:1991,label:"POST-USSR"},{y:2001,label:"9/11"},{y:2022,label:"NOW"}];

  const top10=[...CONFLICTS].sort((a,b)=>{
    const p=s=>+(s||"0").replace(/[^0-9]/g,"")||0;
    return p(b.deaths)-p(a.deaths);
  }).slice(0,10);

  const AMBER="#C8A84B",RED="#E84040",TEAL="#4A7A8A";

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;scrollbar-width:thin;scrollbar-color:#1C2A35 #080B0F}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#080B0F}::-webkit-scrollbar-thumb{background:#1C2A35}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes ripple{0%{opacity:0.5;transform:scale(1)}100%{opacity:0;transform:scale(3)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shimmer{0%,100%{opacity:0.2}50%{opacity:0.5}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;width:100%}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#C8A84B;cursor:pointer;box-shadow:0 0 8px rgba(200,168,75,0.6)}
      `}</style>
      <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100vw",background:"#080B0F",overflow:"hidden",fontFamily:"'IBM Plex Mono',monospace"}}>

        {/* TOP BAR */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",height:52,background:"#060A0D",borderBottom:"1px solid #1C2A35",flexShrink:0,gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#E84040",boxShadow:"0 0 10px #E84040",animation:"pulse 2s infinite"}}/>
            <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:24,color:"#C8A84B",letterSpacing:4}}>WARWATCH</span>
            <span style={{background:"#E84040",color:"#fff",fontSize:9,padding:"2px 6px",fontWeight:700,letterSpacing:1}}>{activeCount} ACTIVE</span>
          </div>
          <div style={{display:"flex",gap:4}}>
            {["MAP","STATS","ARCHIVE"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{
                background:view===v?"#C8A84B":"transparent",color:view===v?"#080B0F":"#7A8A94",
                border:"1px solid",borderColor:view===v?"#C8A84B":"#1C2A35",
                padding:"4px 12px",fontSize:10,letterSpacing:2,cursor:"pointer",
                fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,transition:"all 0.15s",
              }}>{v}</button>
            ))}
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="SEARCH CONFLICT..."
            style={{background:"#0E1419",border:"1px solid #1C2A35",color:"#E8E0D0",padding:"5px 10px",fontSize:10,fontFamily:"'IBM Plex Mono',monospace",outline:"none",width:160,letterSpacing:1}}/>
        </div>

        {/* MAIN CONTENT */}
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>

          {/* SIDEBAR */}
          {view==="MAP" && (
            <div style={{width:170,background:"#060A0D",borderRight:"1px solid #1C2A35",display:"flex",flexDirection:"column",overflowY:"auto",flexShrink:0}}>
              <SideSection title="THEATER">
                {REGIONS.map(r=><FilterBtn key={r} label={r==="All Regions"?"ALL REGIONS":r.toUpperCase()} active={regionFilter===r} onClick={()=>setRegionFilter(r)}/>)}
              </SideSection>
              <SideSection title="TYPE">
                {TYPES.map(t=><FilterBtn key={t} label={t==="All Types"?"ALL TYPES":t.toUpperCase()} active={typeFilter===t} onClick={()=>setTypeFilter(t)}/>)}
              </SideSection>
              <SideSection title="STATUS">
                {[["All",null],["Active",false],["Resolved",true]].map(([l,v])=>(
                  <FilterBtn key={l} label={l.toUpperCase()} active={showResolved===v} onClick={()=>setShowResolved(v)}/>
                ))}
              </SideSection>
              <SideSection title="INTEL">
                {[[`ACTIVE`,CONFLICTS.filter(c=>c.end===null).length,"#E84040"],["HIGH",CONFLICTS.filter(c=>!c.end&&c.intensity==="high").length,"#E84040"],["DATABASE",CONFLICTS.length,"#C8A84B"],["RESOLVED",CONFLICTS.filter(c=>c.end).length,"#4A7A8A"]].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 14px"}}>
                    <span style={{fontSize:9,color:"#3A4A54",letterSpacing:1}}>{l}</span>
                    <span style={{fontSize:10,color:c,fontWeight:700}}>{v}</span>
                  </div>
                ))}
              </SideSection>
            </div>
          )}

          {/* CENTER */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>

            {/* MAP */}
            {view==="MAP" && (
              <div style={{flex:1,position:"relative",overflow:"hidden",background:"#060A0D"}}>
                <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(28,42,53,0.25) 1px,transparent 1px),linear-gradient(90deg,rgba(28,42,53,0.25) 1px,transparent 1px)",backgroundSize:"50px 50px",pointerEvents:"none",zIndex:1}}/>
                <div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",zIndex:2,fontFamily:"'Bebas Neue',cursive",fontSize:56,color:"rgba(200,168,75,0.06)",letterSpacing:10,pointerEvents:"none",userSelect:"none",whiteSpace:"nowrap"}}>
                  {year === 2025 ? "LIVE FEED" : year}
                </div>
                <ComposableMap projection="geoNaturalEarth1" style={{width:"100%",height:"100%"}} projectionConfig={{scale:155}}>
                  <ZoomableGroup zoom={1} minZoom={0.7} maxZoom={8}>
                    <Geographies geography={GEO_URL}>
                      {({geographies})=>geographies.map(geo=>{
                        const involved=mapFiltered.some(c=>c.countries.some(cn=>geo.properties.name?.includes(cn)||cn.includes(geo.properties.name||"")));
                        return(
                          <Geography key={geo.rsmKey} geography={geo} style={{
                            default:{fill:involved?"rgba(232,64,64,0.15)":"#0C1820",stroke:"#1A2830",strokeWidth:0.3,outline:"none"},
                            hover:{fill:involved?"rgba(232,64,64,0.25)":"#132030",stroke:"#C8A84B",strokeWidth:0.5,outline:"none"},
                            pressed:{outline:"none"},
                          }}/>
                        );
                      })}
                    </Geographies>
                    {mapFiltered.map(c=>{
                      const color=c.end!==null?RESOLVED_COLOR:INTENSITY_COLOR[c.intensity]||"#E8E0D0";
                      const isSel=selected?.id===c.id;
                      return(
                        <Marker key={c.id} coordinates={[c.lng,c.lat]} onClick={()=>handleSelect(c)} onMouseEnter={()=>setTooltip(c)} onMouseLeave={()=>setTooltip(null)}>
                          {c.end===null&&(
                            <>
                              <circle r={16} fill={color} fillOpacity={0} stroke={color} strokeWidth={1} strokeOpacity={0.3} style={{animation:`ripple 2.5s ease-out infinite ${(c.id*137)%2000}ms`}}/>
                              <circle r={10} fill={color} fillOpacity={0} stroke={color} strokeWidth={0.8} strokeOpacity={0.5} style={{animation:`ripple 2.5s ease-out infinite ${(c.id*137+800)%2000}ms`}}/>
                            </>
                          )}
                          <circle r={isSel?7:4.5} fill={color} fillOpacity={0.9} stroke={isSel?"#C8A84B":"rgba(255,255,255,0.3)"} strokeWidth={isSel?2:0.8} style={{cursor:"pointer",transition:"all 0.2s"}}/>
                          {isSel&&<circle r={12} fill="none" stroke="#C8A84B" strokeWidth={1} strokeDasharray="4 3" style={{animation:"spin 10s linear infinite",transformOrigin:"center",transformBox:"fill-box"}}/>}
                        </Marker>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>
                {/* Tooltip */}
                {tooltip&&(
                  <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:"rgba(8,11,15,0.95)",border:"1px solid #C8A84B",padding:"8px 16px",zIndex:10,whiteSpace:"nowrap",pointerEvents:"none",animation:"fadeIn 0.15s ease"}}>
                    <span style={{color:"#C8A84B",fontSize:11,letterSpacing:1,fontWeight:700}}>{tooltip.name}</span>
                    <span style={{color:"#7A8A94",fontSize:10,marginLeft:12}}>{tooltip.start}–{tooltip.end||"ONGOING"}</span>
                    <span style={{color:tooltip.end?RESOLVED_COLOR:INTENSITY_COLOR[tooltip.intensity],fontSize:10,marginLeft:12,fontWeight:700}}>{tooltip.intensity?.toUpperCase()}</span>
                  </div>
                )}
                {/* Legend */}
                <div style={{position:"absolute",top:14,right:14,background:"rgba(6,10,13,0.9)",border:"1px solid #1C2A35",padding:"10px 14px",zIndex:5}}>
                  <div style={{fontSize:8,color:"#3A4A54",letterSpacing:2,marginBottom:8}}>INTENSITY</div>
                  {[["HIGH","#E84040"],["MEDIUM","#E87D20"],["LOW","#D4C244"],["RESOLVED","#4A7A8A"]].map(([l,c])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:c,boxShadow:`0 0 4px ${c}`}}/>
                      <span style={{fontSize:9,color:"#7A8A94",letterSpacing:1}}>{l}</span>
                    </div>
                  ))}
                  <div style={{fontSize:8,color:"#3A4A54",marginTop:6}}>{mapFiltered.length} CONFLICTS SHOWN</div>
                </div>
              </div>
            )}

            {/* STATS */}
            {view==="STATS" && (
              <div style={{flex:1,overflowY:"auto",padding:20,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,background:"#080B0F",alignContent:"start"}}>
                <ChartCard title="CONFLICTS BY DECADE">
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={conflictsByDecade} margin={{top:0,right:0,bottom:0,left:-20}}>
                      <XAxis dataKey="decade" tick={{fill:"#3A4A54",fontSize:8,fontFamily:"IBM Plex Mono"}} tickLine={false} axisLine={false}/>
                      <YAxis tick={{fill:"#3A4A54",fontSize:8,fontFamily:"IBM Plex Mono"}} tickLine={false} axisLine={false}/>
                      <Tooltip contentStyle={{background:"#0E1419",border:"1px solid #1C2A35",fontFamily:"IBM Plex Mono",fontSize:10,color:"#E8E0D0"}} cursor={{fill:"rgba(200,168,75,0.05)"}}/>
                      <Bar dataKey="count" fill={AMBER} radius={[2,2,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="CONFLICTS BY REGION">
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={byRegion} layout="vertical" margin={{top:0,right:0,bottom:0,left:10}}>
                      <XAxis type="number" tick={{fill:"#3A4A54",fontSize:8,fontFamily:"IBM Plex Mono"}} tickLine={false} axisLine={false}/>
                      <YAxis dataKey="region" type="category" tick={{fill:"#7A8A94",fontSize:9,fontFamily:"IBM Plex Mono"}} tickLine={false} axisLine={false} width={65}/>
                      <Tooltip contentStyle={{background:"#0E1419",border:"1px solid #1C2A35",fontFamily:"IBM Plex Mono",fontSize:10,color:"#E8E0D0"}} cursor={{fill:"rgba(200,168,75,0.05)"}}/>
                      <Bar dataKey="count" radius={[0,2,2,0]}>
                        {byRegion.map((e,i)=><Cell key={i} fill={[RED,AMBER,"#E87D20","#D4C244",TEAL,"#7A8A94"][i%6]}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="CONFLICT TYPES">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={byType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={32} paddingAngle={2}>
                        {byType.map((e,i)=><Cell key={i} fill={[RED,AMBER,"#E87D20","#D4C244",TEAL,"#7A8A94"][i%6]}/>)}
                      </Pie>
                      <Tooltip contentStyle={{background:"#0E1419",border:"1px solid #1C2A35",fontFamily:"IBM Plex Mono",fontSize:10,color:"#E8E0D0"}}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
                    {byType.map((e,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:[RED,AMBER,"#E87D20","#D4C244",TEAL,"#7A8A94"][i%6]}}/>
                        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#7A8A94"}}>{e.name} {e.value}%</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
                <ChartCard title="TOP 10 DEADLIEST CONFLICTS">
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {top10.map((c,i)=>{
                      const raw=+(c.deaths||"0").replace(/[^0-9]/g,"")||1;
                      const max=+(top10[0].deaths||"1").replace(/[^0-9]/g,"")||1;
                      const w=Math.max(4,raw/max*100);
                      return(
                        <div key={c.id} style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:9,color:"#3A4A54",width:14,textAlign:"right",flexShrink:0}}>{i+1}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                              <span style={{fontSize:9,color:"#E8E0D0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                              <span style={{fontSize:9,color:RED,marginLeft:8,flexShrink:0}}>{c.deaths}</span>
                            </div>
                            <div style={{height:2,background:"#1C2A35",borderRadius:1}}>
                              <div style={{width:`${w}%`,height:"100%",background:`linear-gradient(90deg,${RED},${AMBER})`,borderRadius:1}}/>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ChartCard>
              </div>
            )}

            {/* ARCHIVE */}
            {view==="ARCHIVE" && (
              <div style={{flex:1,overflowY:"auto",background:"#080B0F"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead style={{position:"sticky",top:0,background:"#060A0D",borderBottom:"1px solid #1C2A35"}}>
                    <tr>
                      {["CONFLICT","REGION","TYPE","FROM","TO","INTENSITY","CASUALTIES"].map(h=>(
                        <th key={h} style={{padding:"10px 12px",textAlign:"left",fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#3A4A54",letterSpacing:2,fontWeight:700,whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c,i)=>{
                      const color=c.end!==null?RESOLVED_COLOR:INTENSITY_COLOR[c.intensity];
                      return(
                        <tr key={c.id} onClick={()=>{handleSelect(c);setView("MAP");}}
                          style={{borderBottom:"1px solid rgba(28,42,53,0.6)",cursor:"pointer",background:i%2===0?"transparent":"rgba(14,20,25,0.4)",transition:"background 0.1s"}}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(200,168,75,0.05)"}
                          onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"rgba(14,20,25,0.4)"}
                        >
                          <td style={{padding:"8px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#E8E0D0",fontWeight:700}}>{c.name}</td>
                          <td style={{padding:"8px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#7A8A94"}}>{c.region}</td>
                          <td style={{padding:"8px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#7A8A94"}}>{c.type}</td>
                          <td style={{padding:"8px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#7A8A94"}}>{c.start}</td>
                          <td style={{padding:"8px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:c.end?TEAL:RED}}>{c.end||"ONGOING"}</td>
                          <td style={{padding:"8px 12px"}}><span style={{fontSize:9,padding:"2px 6px",background:`${color}22`,color,letterSpacing:1,fontFamily:"'IBM Plex Mono',monospace"}}>{c.intensity?.toUpperCase()}</span></td>
                          <td style={{padding:"8px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:RED,fontWeight:700}}>{c.deaths}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* TIMELINE */}
            {view==="MAP" && (
              <div style={{height:70,background:"#060A0D",borderTop:"1px solid #1C2A35",padding:"10px 20px",flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,alignItems:"center"}}>
                  <span style={{fontSize:9,color:"#3A4A54",letterSpacing:2}}>1900</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {eras.map(e=>(
                      <button key={e.y} onClick={()=>setYear(e.y)} style={{background:"transparent",border:"1px solid #1C2A35",color:"#3A4A54",fontSize:8,padding:"2px 6px",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:1,transition:"all 0.15s"}}
                        onMouseEnter={e2=>e2.target.style.color="#C8A84B"}onMouseLeave={e2=>e2.target.style.color="#3A4A54"}>
                        {e.label}
                      </button>
                    ))}
                    <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,color:"#C8A84B",letterSpacing:3,minWidth:56,textAlign:"center"}}>{year}</span>
                  </div>
                  <span style={{fontSize:9,color:"#3A4A54",letterSpacing:2}}>2025</span>
                </div>
                <div style={{position:"relative",height:24,display:"flex",alignItems:"center"}}>
                  <div style={{position:"absolute",left:0,right:0,height:3,background:"#1C2A35",borderRadius:2}}>
                    <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#4A7A8A,#C8A84B,#E84040)",borderRadius:2,transition:"width 0.1s"}}/>
                  </div>
                  <input type="range" min={MIN} max={MAX} value={year} onChange={e=>setYear(+e.target.value)}
                    style={{position:"absolute",left:0,right:0,width:"100%",cursor:"pointer",zIndex:2,opacity:0,height:24}}/>
                  <div style={{position:"absolute",left:`${pct}%`,transform:"translateX(-50%)",width:16,height:16,background:"#C8A84B",borderRadius:"50%",boxShadow:"0 0 10px rgba(200,168,75,0.7)",pointerEvents:"none",transition:"left 0.1s",zIndex:1}}/>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          {view==="MAP" && (
            <div style={{width:270,background:"#060A0D",borderLeft:"1px solid #1C2A35",display:"flex",flexDirection:"column",flexShrink:0}}>
              {!selected ? (
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:20}}>
                  <div style={{width:48,height:48,border:"1px solid #1C2A35",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:24,height:24,border:"1px solid #3A4A54",borderRadius:"50%"}}/>
                  </div>
                  <span style={{fontSize:10,color:"#3A4A54",letterSpacing:2,textAlign:"center",lineHeight:1.8}}>SELECT A CONFLICT<br/>MARKER ON THE MAP<br/>TO VIEW BRIEFING</span>
                </div>
              ) : (
                <>
                  <div style={{borderBottom:"1px solid #1C2A35",padding:"12px 14px",background:"#0A0F14",flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:selected.end?RESOLVED_COLOR:INTENSITY_COLOR[selected.intensity],boxShadow:`0 0 6px ${selected.end?RESOLVED_COLOR:INTENSITY_COLOR[selected.intensity]}`,animation:selected.end?"none":"pulse 2s infinite"}}/>
                      <span style={{fontSize:9,color:selected.end?TEAL:RED,letterSpacing:2}}>{selected.end?"RESOLVED":"● ACTIVE"}</span>
                    </div>
                    <div style={{fontSize:12,color:"#E8E0D0",fontWeight:700,letterSpacing:1,lineHeight:1.4,marginBottom:8}}>{selected.name.toUpperCase()}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                      {selected.countries.map(c=>(
                        <span key={c} style={{background:"rgba(200,168,75,0.1)",border:"1px solid rgba(200,168,75,0.2)",color:"#C8A84B",fontSize:8,padding:"2px 6px",letterSpacing:1}}>{c}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:"1px solid #1C2A35",flexShrink:0}}>
                    {[["TYPE",selected.type],["REGION",selected.region],["SINCE",selected.start],["ENDED",selected.end||"ONGOING"],["DEATHS",selected.deaths],["CAUSE",selected.cause]].map(([k,v])=>(
                      <div key={k} style={{padding:"7px 12px",borderRight:"1px solid #1C2A35",borderBottom:"1px solid #1C2A35"}}>
                        <div style={{fontSize:8,color:"#3A4A54",letterSpacing:1,marginBottom:2}}>{k}</div>
                        <div style={{fontSize:9,color:"#E8E0D0",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
                    <div style={{fontSize:8,color:"#C8A84B",letterSpacing:2,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:4,height:4,background:"#C8A84B"}}/>INTELLIGENCE BRIEFING
                    </div>
                    {!apiKey&&<div style={{fontSize:9,color:"#3A4A54",lineHeight:1.7}}>Enter your Anthropic API key below to unlock AI-powered intelligence briefings with live web search.</div>}
                    {loadingBriefing&&(
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {[80,95,70,85,90].map((w,i)=>(
                          <div key={i} style={{height:7,background:"#1C2A35",borderRadius:1,width:`${w}%`,animation:`shimmer 1.5s ease infinite ${i*0.2}s`}}/>
                        ))}
                        <div style={{fontSize:8,color:"#3A4A54",letterSpacing:2,marginTop:4}}>RETRIEVING INTELLIGENCE...</div>
                      </div>
                    )}
                    {briefing&&!loadingBriefing&&<BriefingText text={briefing}/>}
                    {apiKey&&!briefing&&!loadingBriefing&&(
                      <button onClick={()=>fetchBriefing(selected)} style={{background:"transparent",border:"1px solid #C8A84B",color:"#C8A84B",padding:"6px 12px",fontSize:9,letterSpacing:2,cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",width:"100%"}}>
                        GENERATE BRIEFING
                      </button>
                    )}
                  </div>
                </>
              )}
              {/* API KEY */}
              <div style={{borderTop:"1px solid #1C2A35",padding:"8px 12px",background:"#0A0F14",flexShrink:0}}>
                <div style={{fontSize:8,color:"#3A4A54",letterSpacing:2,marginBottom:6}}>ANTHROPIC API KEY</div>
                <div style={{display:"flex",gap:4}}>
                  <input type={showKey?"text":"password"} value={apiInput} onChange={e=>setApiInput(e.target.value)}
                    placeholder="sk-ant-..."
                    style={{flex:1,background:"#0E1419",border:"1px solid #1C2A35",color:"#E8E0D0",padding:"4px 8px",fontSize:9,fontFamily:"'IBM Plex Mono',monospace",outline:"none",minWidth:0}}/>
                  <button onClick={()=>setShowKey(s=>!s)} style={{background:"transparent",border:"1px solid #1C2A35",color:"#3A4A54",fontSize:8,padding:"0 6px",cursor:"pointer",flexShrink:0}}>
                    {showKey?"●":"○"}
                  </button>
                  <button onClick={()=>setApiKey(apiInput)} style={{background:"#C8A84B",border:"none",color:"#080B0F",fontSize:8,padding:"4px 8px",cursor:"pointer",fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",flexShrink:0,letterSpacing:1}}>
                    SET
                  </button>
                </div>
                {apiKey&&<div style={{fontSize:8,color:"#4A7A8A",letterSpacing:1,marginTop:4}}>✓ KEY ACTIVE</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
