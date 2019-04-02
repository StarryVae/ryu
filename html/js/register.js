/**
 * 
 */
String.prototype.Trim = function() {  
var m = this.match(/^\s*(\S+(\s+\S+)*)\s*/);  
return (m == null) ? "" : m[1];  
} 

String.prototype.isMobile = function() {  
return (/^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})/.test(this.Trim()));  
}  

String.prototype.isTel = function() 
{ 
//"���ݸ�ʽ: ���Ҵ���(2��3λ)-����(2��3λ)-�绰����(7��8λ)-�ֻ���(3λ)" 
//return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?/.test(this.Trim())); 
return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?/.test(this.Trim())); 
} 

function check_validate1() {  
	//�ж�������ʽ��
	var partten = /^(\d{3,4}\-)?\d{7,8}$/i;   //������ʽ�� 010-98909899
	//var partten = /^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/; û���м��Ƕ� -�� ������ʽ�� 01098909899
	var zuoji=partten.test( document.form1.tel.value);
	//�ж��ֻ���ʽ������
	var re = /^1\d{10}$/i;
	var shouji=re.test( document.form1.tel.value);
	if(zuoji || shouji){
		//
		return true;
		
	}else{
	 alert("������ĵ绰��������������������֮���-")
	  document.form1.tel.value="";
	 return false;
	}
	 
}  

function checkFriendlyName()
{
	var filter = /^[\s]+$/;
	var friendlyName = document.form1.name.value;
	if (friendlyName.length > 40||friendlyName.length <2) {
		alert("��λ���Ƶĳ���2-32���ַ���");
		document.form1.name.value="";
		return false;
	} 
	return true;
}
function checkFriendlyNameq()
{
	var filter = /^[\s]+$/;
	var friendlyName = document.form1.addr.value;
	if (friendlyName.length > 40||friendlyName.length <2) {
		alert("��λ��ַ�ĳ���2-32���ַ���");
		document.form1.addr.value="";
		return false;
	} 
	return true;
}
function isputpwd()
{
	var filter1 = /^[\s]+$/;
	var friendlypwd = document.form1.pwd.value;
	if (friendlypwd.length > 18||friendlypwd.length<6) {
		alert("���볤������6��18���ַ�֮�䣡");
		return false;
	} 
	return true;
}
function checkamend()
{   //alert('hi');
	var pwd0=document.form1.pwd0.value;
	var pwd1=document.form1.pwd.value;
	var pwd2=document.form1.pwd2.value;
	if(pwd0.length==0)
	{
		alert("ԭ���벻��Ϊ�գ�");	
		return false;
		
	}
	if (pwd1!=pwd2) {
		alert("���벻ƥ�䣡");
		document.form1.pwd2.value="";
		return false;
	} 
	if (pwd1.length > 18||pwd1.length<6) {
		alert("���볤������6��18���ַ�֮�䣡");
		return false;
	} 
	return true;
	
}
function judepwd()
{
	var friendlypasswd = document.form1.passwd.value;
	var friendlypasswd1 = document.form1.passwd1.value;
	if (friendlypasswd!=friendlypasswd1) {
		alert("The password is not match");
		document.form1.passwd1.value="";
		return false;
	} 	
}
function Charstring(iN)  //�����ַ��������� 
{             
	if (iN>=48 && iN <=57)                
		return 1; 
	if (iN>=65 && iN <=90)              
		return 2;
	if (iN>=97 && iN <=122)             
		return 4;
	else
		return 8;         
}

function modetotal(num)    //�������ǰ����һ���м���ģʽ
{  
	modes=0;
	for (i=0;i<4;i++){
	if (num & 1) 
		modes++;
		num>>>=1;
}
	return modes;
}

function checkpwd(spwd) //���������ǿ�ȼ���
{   
	if (spwd.length<=4)
		return 0;                         
		Modes=0;
	for (i=0;i<spwd.length;i++){         
	Modes|=Charstring(spwd.charCodeAt(i));
	}
	return modetotal(Modes);
} 



function isValidEmail(inEmail)
{
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (filter.test(inEmail)) return true;
	else return false;
}

function checkEmail()
{
	var email = document.form1.email.value;
	if (email != "") {
		userFinalEmail = email;
		if (!isValidEmail(email)) {
			alert("����д�ĵ����ʼ���ַ, ���ܲ���һ����Ч���ʼ���ַ������������ύ��");
			document.form1.email.value="";
			return false;		
		}
		else if (email.length > 60) {
			alert("������ĵ����ʼ���ַ���ȳ���������Χ������������ύ��");
			document.form1.email.value=""
			return false;
			
		}		
	}
	return true;
}
function pwdstrong(pwd)  
//���û��ſ������ϵİ��������������ʧȥ����ʱ�����ݲ�ͬ�İ�ȫ������ʾ��ͬ����ɫ
{       
	O_color="#cccccc";              
	L_color="#ffff00";               
	M_color="#DC440F";                
	H_color="#FF0000";                  
	if (pwd==null||pwd==''){             
	Lcolor=Mcolor=Hcolor=O_color;   
	} 
	else
	{
		S_level=checkpwd(pwd);        
		switch(S_level) {
		case 0:
			Lcolor=Mcolor=Hcolor=O_color;  
		case 1:
			Lcolor=L_color;
			Mcolor=Hcolor=O_color;           
			break;
		case 2:
			Lcolor=Mcolor=M_color;
			Hcolor=O_color;           
			break;
		default:
		Lcolor=Mcolor=Hcolor=H_color;
		}
	 } 
	document.getElementById("pwd_L").style.background=Lcolor;    
	document.getElementById("pwd_M").style.background=Mcolor; 
	document.getElementById("pwd_H").style.background=Hcolor; 
	return;
}
/*function check_validate1(){

var temps=document.form1.tel.value;
if (isNaN(temps)){
alert("�������������м䲻��� -");
document.form1.tel.value="";
return false;
}
return true;
}*/
function checksubmit()
{   
	//alert('hi');
	if(document.form1.email.value.length==0)
	{
		alert("����д����");
		return false;
	}
//	if(document.form1.town.value.length==0)   //ע��ʱ��λ��������ȥ��
//	{
//		alert("��ѡ�����");
//		return false;
//	}
	if(document.form1.companyid.value.length==0)
	{
		alert("�������û�id");
		return false;
	}
	if(document.form1.contact.value.length==0)
	{
		alert("��������ϵ��");
		return false;
	}
	if(checkFriendlyName()==false)
	{
		return false;
	}
	if(checkFriendlyNameq()==false)
	{
		return false;
	}
	if(checkEmail()==false)
	{
		return false;
	}
	if(isputpwd()==false)
	{
		return false;
	}
	if(judepwd()==false)
	{
		return false;
	}
	if(check_validate1()==false)
	{
		return false;
	}
	if(check_postcode()==false)
	{   //alert('hi');
		return false;
	}
	
	return true;
}
function check_postcode()
{
var temps=document.form1.postcode.value;//��֤��������
if (isNaN(temps)){
alert("�ʱ��������6λ����");
document.form1.postcode.value="";
return false;
}
if(temps.length!=6)
{
	alert("�ʱ೤��Ϊ6λ");
	document.form1.postcode.value="";
	return false;
}
return true;
}