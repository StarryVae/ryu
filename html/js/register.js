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
//"兼容格式: 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)" 
//return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?/.test(this.Trim())); 
return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?/.test(this.Trim())); 
} 

function check_validate1() {  
	//判断座机格式的
	var partten = /^(\d{3,4}\-)?\d{7,8}$/i;   //座机格式是 010-98909899
	//var partten = /^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/; 没有中间那段 -的 座机格式是 01098909899
	var zuoji=partten.test( document.form1.tel.value);
	//判断手机格式可以用
	var re = /^1\d{10}$/i;
	var shouji=re.test( document.form1.tel.value);
	if(zuoji || shouji){
		//
		return true;
		
	}else{
	 alert("你输入的电话号码有误！座机请在区号之后加-")
	  document.form1.tel.value="";
	 return false;
	}
	 
}  

function checkFriendlyName()
{
	var filter = /^[\s]+$/;
	var friendlyName = document.form1.name.value;
	if (friendlyName.length > 40||friendlyName.length <2) {
		alert("单位名称的长度2-32个字符！");
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
		alert("单位地址的长度2-32个字符！");
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
		alert("密码长度请在6到18个字符之间！");
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
		alert("原密码不能为空！");	
		return false;
		
	}
	if (pwd1!=pwd2) {
		alert("密码不匹配！");
		document.form1.pwd2.value="";
		return false;
	} 
	if (pwd1.length > 18||pwd1.length<6) {
		alert("密码长度请在6到18个字符之间！");
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
function Charstring(iN)  //测试字符属于哪类 
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

function modetotal(num)    //计算出当前密码一共有几种模式
{  
	modes=0;
	for (i=0;i<4;i++){
	if (num & 1) 
		modes++;
		num>>>=1;
}
	return modes;
}

function checkpwd(spwd) //返回密码的强度级别
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
			alert("您填写的电子邮件地址, 可能不是一个有效的邮件地址，请检查后重新提交。");
			document.form1.email.value="";
			return false;		
		}
		else if (email.length > 60) {
			alert("您输入的电子邮件地址长度超过允许范围，请检查后重新提交。");
			document.form1.email.value=""
			return false;
			
		}		
	}
	return true;
}
function pwdstrong(pwd)  
//当用户放开键盘上的按键或密码输入框失去焦点时，根据不同的安全级别显示不同的颜色
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
alert("必须输入数字中间不需加 -");
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
		alert("请填写邮箱");
		return false;
	}
//	if(document.form1.town.value.length==0)   //注册时单位所属镇区去掉
//	{
//		alert("请选择城镇");
//		return false;
//	}
	if(document.form1.companyid.value.length==0)
	{
		alert("请输入用户id");
		return false;
	}
	if(document.form1.contact.value.length==0)
	{
		alert("请输入联系人");
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
var temps=document.form1.postcode.value;//验证邮政编码
if (isNaN(temps)){
alert("邮编必须输入6位数字");
document.form1.postcode.value="";
return false;
}
if(temps.length!=6)
{
	alert("邮编长度为6位");
	document.form1.postcode.value="";
	return false;
}
return true;
}