
(function(compId){var _=null,y=true,n=false,x10='break-word',x3='6.0.0.400',x2='5.0.0',p='px',x4='rgba(0,0,0,0)',x9='700',g='image',l='normal',x='text',x8='open-sans-condensed, sans-serif',x12='rgba(255,255,255,1)',m='rect',xc='rgba(0,0,0,1)',x11='rgba(192,192,192,1)',x7='21',x1='6.0.0',i='none';var g5='bg.jpg';var s6="<p style=\"margin: 0px;\">​</p>";var im='images/',aud='media/',vid='media/',js='js/',fonts={'open-sans-condensed, sans-serif':'<script src=\"http://use.edgefonts.net/open-sans-condensed:n7,n3,i3:all.js\"></script>'},opts={'gAudioPreloadPreference':'auto','gVideoPreloadPreference':'auto'},resources=[],scripts=[],symbols={"stage":{v:x1,mv:x2,b:x3,stf:i,cg:i,rI:n,cn:{dom:[{id:'bg',t:g,r:['0px','0px','332px','35px','auto','auto'],f:[x4,im+g5,'0px','0px']},{id:'Text2',t:x,r:['151px','3px','75px','35px','auto','auto'],text:s6,align:"left",n:[x8,[x7,p],"rgba(0,52,120,1.00)",x9,i,l,x10,l],ts:["","","","",i]},{id:'Rectangle',t:m,r:['0px','0px','332px','35px','auto','auto'],cu:'pointer',o:'0',f:[x11],s:[0,xc,i]}],style:{'${Stage}':{isStage:true,r:['null','null','332px','35px','auto','auto'],overflow:'hidden',f:[x12]}}},tt:{d:0,a:y,data:[]}}};AdobeEdge.registerCompositionDefn(compId,symbols,fonts,scripts,resources,opts);})("EDGE-100581578");
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;Edge.registerEventBinding(compId,function($){
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindElementAction(compId,symbolName,"document","compositionReady",function(sym,e){function timer(){now=new Date();Czas=new Date("September 18, 2016");ile=Czas.getTime()-now.getTime();if(ile<0)return false;godzin=Math.floor(ile/(1000*60*60));minut=Math.floor(ile/(1000*60)-godzin*60);sekund=Math.floor(ile/1000-godzin*60*60-minut*60);dni=Math.floor(godzin/24);godzin=godzin-(dni*24);var time="";if(dni>0)
time=((dni<10)?"0"+dni:dni)+":"+((godzin<10)?"0"+godzin:godzin)+":"+((minut<10)?"0"+minut:minut)+":"+((sekund<10)?"0"+sekund:sekund);if(dni==0&&godzin>0)
time=((godzin<10)?"0"+godzin:godzin)+":"+((minut<10)?"0"+minut:minut)+":"+((sekund<10)?"0"+sekund:sekund);if(dni==0&&godzin==0)
time=((minut<10)?"0"+minut:minut)+":"+((sekund<10)?"0"+sekund:sekund);sym.$("Text2").html('<span style="font-weight:bold">'+dni+" DNI"+'</span>');if(dni<=0)
dni=0;}
var animeInt;clearInterval(animeInt);animeInt=setInterval(timer,1000);});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${Rectangle}","click",function(sym,e){window.open(window.clickTag,"_blank");});
//Edge binding end
})("stage");
//Edge symbol end:'stage'
})})(AdobeEdge.$,AdobeEdge,"EDGE-100581578");