/**
 * 
 */
$(function() {
     var $table = $('#table1'),
        $button = $('#button1');
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
				type:'post',          //�ύ��ʽ ��get��post���֣�����post
				url:"DeleteDNAT",        //�ύ��servlet·������form�е�action����
				data:{"ids":Id},
				dataType:'text',
				success:function(data){  //ִ�гɹ�
					alert('Delete success!');   //��ʾ��Ϣ
				//	location.href ="SNAT.jsp";
				},
				error:function(){   //ʧ��
					alert('erroe occured!!!');
					
					
				}
//				});	
        	});
        });
   });
});
