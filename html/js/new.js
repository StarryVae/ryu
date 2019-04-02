/**
 * 
 */
 $(function(){
	 $(".main>a").click(function(){
		 $(this).next().slideToggle(250)
		 .parent().siblings().find(".child").slideUp(250);
	 })
 })
 