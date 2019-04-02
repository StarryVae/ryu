/**
 * 
 */
$(function() {
     var $table = $('#table'),
        $button = $('#button');
   $(document).ready(function() {
 //   $(function () {
        $button.click(function () {
            var ids = $.map($table.bootstrapTable('getSelections'), function (row) {
                return row.id;
            });
            $table.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });
            var Id = Number(ids);
         //  var Id=JOSN.stringify(ids);
          // document.write(ids);
          
	        $.ajax({                   //ajax
				type:'post',          //提交方式 ，get，post两种，常用post
				url:"DeleteSNAT",        //提交的servlet路径，与form中的action类似
				data:{"ids":Id},
				dataType:'text',
				success:function(data){  //执行成功
					alert('Delete success!');   //提示信息
					location.href ="SNAT.jsp";
				},
				error:function(){   //失败
					alert('erroe occured!!!');
					
					
				}
//				});	
        	});
        });
   });
});

