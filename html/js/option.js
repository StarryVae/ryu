/**
 * 
 */
window.onload=function(){
         var mytab =document.getElementById("tab");
         var myul=mytab.getElementsByTagName("ul")[0];
         var myli=myul.getElementsByTagName("li");
         var mydiv=mytab.getElementsByTagName("div");
        //  alert(mydiv.length)
         for(i=0,len=myli.length;i<len;i++){
             myli[i].index=i;
             myli[i].onclick=function(){
                 for(var n=0;n<len;n++){
                     myli[n].className="";
                     mydiv[n].className="hide";
                 }
                 this.className="on";                 
                 mydiv[this.index].className="";
                  
             }
         }
        }