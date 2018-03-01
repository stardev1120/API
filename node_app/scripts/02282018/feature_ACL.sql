<!DOCTYPE html>
<html lang="en" dir="ltr">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Script-Type" content="text/javascript">
<meta name="robots" content="noindex">
<meta name="referrer" content="origin-when-crossorigin">
<title>Export: umbrella_dev_db - mariadb - Adminer</title>
<link rel="stylesheet" type="text/css" href="?file=default.css&amp;version=4.3.1&amp;driver=mysql">
<script type="text/javascript" src="?file=functions.js&amp;version=4.3.1&amp;driver=mysql"></script>
<link rel="shortcut icon" type="image/x-icon" href="?file=favicon.ico&amp;version=4.3.1&amp;driver=mysql">
<link rel="apple-touch-icon" href="?file=favicon.ico&amp;version=4.3.1&amp;driver=mysql">
<link rel="stylesheet" type="text/css" href="adminer.css">

<body class="ltr nojs" onkeydown="bodyKeydown(event);" onclick="bodyClick(event);">
<script type="text/javascript">
document.body.className = document.body.className.replace(/ nojs/, ' js');
var offlineMessage = 'You are offline.';
</script>

<div id="help" class="jush-sql jsonly hidden" onmouseover="helpOpen = 1;" onmouseout="helpMouseout(this, event);"></div>

<div id="content">
<p id="breadcrumb"><a href="?server=mariadb">MySQL</a> &raquo; <a href='?server=mariadb&amp;username=root' accesskey='1' title='Alt+Shift+1'>mariadb</a> &raquo; <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db">umbrella_dev_db</a> &raquo; Export
<h2>Export: umbrella_dev_db</h2>
<div id='ajaxstatus' class='jsonly hidden'></div>

<form action="" method="post">
<table cellspacing="0">
<tr><th>Output<td><label><input type='radio' name='output' value='text' checked>open</label><label><input type='radio' name='output' value='file'>save</label><label><input type='radio' name='output' value='gz'>gzip</label>
<tr><th>Format<td><label><input type='radio' name='format' value='sql' checked>SQL</label><label><input type='radio' name='format' value='csv'>CSV,</label><label><input type='radio' name='format' value='csv;'>CSV;</label><label><input type='radio' name='format' value='tsv'>TSV</label>
<tr><th>Database<td><select name='db_style'><option selected><option>USE<option>DROP+CREATE<option>CREATE</select><label><input type='checkbox' name='routines' value='1'>Routines</label><label><input type='checkbox' name='events' value='1'>Events</label><tr><th>Tables<td><select name='table_style'><option><option selected>DROP+CREATE<option>CREATE</select><label><input type='checkbox' name='auto_increment' value='1'>Auto Increment</label><label><input type='checkbox' name='triggers' value='1' checked>Triggers</label><tr><th>Data<td><select name='data_style'><option><option>TRUNCATE+INSERT<option selected>INSERT<option>INSERT+UPDATE</select></table>
<p><input type="submit" value="Export">
<input type="hidden" name="token" value="835563:356331">

<table cellspacing="0">
<thead><tr><th style='text-align: left;'><label class='block'><input type='checkbox' id='check-tables' onclick='formCheck(this, /^tables\[/);'>Tables</label><th style='text-align: right;'><label class='block'>Data<input type='checkbox' id='check-data' onclick='formCheck(this, /^data\[/);'></label></thead>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='AdminCollectDistributes' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">AdminCollectDistributes</label><td align='right'><label class='block'><span id='Rows-AdminCollectDistributes'></span><input type='checkbox' name='data[]' value='AdminCollectDistributes' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='AdminUserAccesses' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">AdminUserAccesses</label><td align='right'><label class='block'><span id='Rows-AdminUserAccesses'></span><input type='checkbox' name='data[]' value='AdminUserAccesses' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='AdminuserCountries' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">AdminuserCountries</label><td align='right'><label class='block'><span id='Rows-AdminuserCountries'></span><input type='checkbox' name='data[]' value='AdminuserCountries' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='AdminUsers' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">AdminUsers</label><td align='right'><label class='block'><span id='Rows-AdminUsers'></span><input type='checkbox' name='data[]' value='AdminUsers' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='CollectionHistories' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">CollectionHistories</label><td align='right'><label class='block'><span id='Rows-CollectionHistories'></span><input type='checkbox' name='data[]' value='CollectionHistories' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='Collections' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">Collections</label><td align='right'><label class='block'><span id='Rows-Collections'></span><input type='checkbox' name='data[]' value='Collections' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='Companies' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">Companies</label><td align='right'><label class='block'><span id='Rows-Companies'></span><input type='checkbox' name='data[]' value='Companies' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='Countries' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">Countries</label><td align='right'><label class='block'><span id='Rows-Countries'></span><input type='checkbox' name='data[]' value='Countries' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='CountryInvestments' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">CountryInvestments</label><td align='right'><label class='block'><span id='Rows-CountryInvestments'></span><input type='checkbox' name='data[]' value='CountryInvestments' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='CountrySettings' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">CountrySettings</label><td align='right'><label class='block'><span id='Rows-CountrySettings'></span><input type='checkbox' name='data[]' value='CountrySettings' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='CreditScoreHistories' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">CreditScoreHistories</label><td align='right'><label class='block'><span id='Rows-CreditScoreHistories'></span><input type='checkbox' name='data[]' value='CreditScoreHistories' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='DistributionCenters' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">DistributionCenters</label><td align='right'><label class='block'><span id='Rows-DistributionCenters'></span><input type='checkbox' name='data[]' value='DistributionCenters' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='FeatureACLs' checked onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">FeatureACLs</label><td align='right'><label class='block'><span id='Rows-FeatureACLs'></span><input type='checkbox' name='data[]' value='FeatureACLs' checked onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='Loans' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">Loans</label><td align='right'><label class='block'><span id='Rows-Loans'></span><input type='checkbox' name='data[]' value='Loans' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='LoansHistories' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">LoansHistories</label><td align='right'><label class='block'><span id='Rows-LoansHistories'></span><input type='checkbox' name='data[]' value='LoansHistories' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='NonSupportedCountryLeads' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">NonSupportedCountryLeads</label><td align='right'><label class='block'><span id='Rows-NonSupportedCountryLeads'></span><input type='checkbox' name='data[]' value='NonSupportedCountryLeads' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='PaymentMethods' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">PaymentMethods</label><td align='right'><label class='block'><span id='Rows-PaymentMethods'></span><input type='checkbox' name='data[]' value='PaymentMethods' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='Roles' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">Roles</label><td align='right'><label class='block'><span id='Rows-Roles'></span><input type='checkbox' name='data[]' value='Roles' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='SequelizeMeta' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">SequelizeMeta</label><td align='right'><label class='block'><span id='Rows-SequelizeMeta'></span><input type='checkbox' name='data[]' value='SequelizeMeta' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='SimBankAccounts' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">SimBankAccounts</label><td align='right'><label class='block'><span id='Rows-SimBankAccounts'></span><input type='checkbox' name='data[]' value='SimBankAccounts' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='UserActivityLogs' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">UserActivityLogs</label><td align='right'><label class='block'><span id='Rows-UserActivityLogs'></span><input type='checkbox' name='data[]' value='UserActivityLogs' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='UserPaymentMethods' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">UserPaymentMethods</label><td align='right'><label class='block'><span id='Rows-UserPaymentMethods'></span><input type='checkbox' name='data[]' value='UserPaymentMethods' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<tr><td><label class='block'><input type='checkbox' name='tables[]' value='Users' onclick="checkboxClick(event, this); formUncheck(&#039;check-tables&#039;);">Users</label><td align='right'><label class='block'><span id='Rows-Users'></span><input type='checkbox' name='data[]' value='Users' onclick="checkboxClick(event, this); formUncheck(&#039;check-data&#039;);"></label>
<script type='text/javascript'>ajaxSetHtml('?server=mariadb&username=root&db=umbrella_dev_db&script=db');</script>
</table>
</form>
</div>

<form action="" method="post">
<p class="logout">
<input type="submit" name="logout" value="Logout" id="logout">
<input type="hidden" name="token" value="835563:356331">
</p>
</form>
<div id="menu">
<h1>
<a href='https://www.adminer.org/' target='_blank' id='h1'>Adminer</a> <span class="version">4.3.1</span>
<a href="https://www.adminer.org/#download" target="_blank" id="version">4.6.2</a>
</h1>
<script type="text/javascript" src="?file=jush.js&amp;version=4.3.1&amp;driver=mysql"></script>
<script type="text/javascript">
var jushLinks = { sql: [ '?server=mariadb&username=root&db=umbrella_dev_db&table=$&', /\b(AdminCollectDistributes|AdminUserAccesses|AdminuserCountries|AdminUsers|CollectionHistories|Collections|Companies|Countries|CountryInvestments|CountrySettings|CreditScoreHistories|DistributionCenters|FeatureACLs|Loans|LoansHistories|NonSupportedCountryLeads|PaymentMethods|Roles|SequelizeMeta|SimBankAccounts|UserActivityLogs|UserPaymentMethods|Users)\b/g ] };
jushLinks.bac = jushLinks.sql;
jushLinks.bra = jushLinks.sql;
jushLinks.sqlite_quo = jushLinks.sql;
jushLinks.mssql_bra = jushLinks.sql;
bodyLoad('5.5');
</script>
<form action="">
<p id="dbs">
<input type="hidden" name="server" value="mariadb"><input type="hidden" name="username" value="root"><span title='database'>DB</span>: <select name='db' onmousedown='dbMouseDown(event, this);' onchange='dbChange(this);'><option value=""><option>information_schema<option>mysql<option>performance_schema<option selected>umbrella_dev_db</select><input type='submit' value='Use' class='hidden'>
<input type="hidden" name="dump" value=""></p></form>
<p class='links'><a href='?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;sql='>SQL command</a>
<a href='?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;import='>Import</a>
<a href='?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;dump=' id='dump' class='active '>Export</a>
<a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;create=">Create table</a>
<ul id='tables' onmouseover='menuOver(this, event);' onmouseout='menuOut(this);'>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=AdminCollectDistributes" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=AdminCollectDistributes" class='structure' title='Show structure'>AdminCollectDistributes</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=AdminUserAccesses" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=AdminUserAccesses" class='structure' title='Show structure'>AdminUserAccesses</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=AdminuserCountries" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=AdminuserCountries" class='structure' title='Show structure'>AdminuserCountries</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=AdminUsers" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=AdminUsers" class='structure' title='Show structure'>AdminUsers</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=CollectionHistories" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=CollectionHistories" class='structure' title='Show structure'>CollectionHistories</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=Collections" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=Collections" class='structure' title='Show structure'>Collections</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=Companies" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=Companies" class='structure' title='Show structure'>Companies</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=Countries" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=Countries" class='structure' title='Show structure'>Countries</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=CountryInvestments" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=CountryInvestments" class='structure' title='Show structure'>CountryInvestments</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=CountrySettings" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=CountrySettings" class='structure' title='Show structure'>CountrySettings</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=CreditScoreHistories" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=CreditScoreHistories" class='structure' title='Show structure'>CreditScoreHistories</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=DistributionCenters" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=DistributionCenters" class='structure' title='Show structure'>DistributionCenters</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=FeatureACLs" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=FeatureACLs" class='structure' title='Show structure'>FeatureACLs</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=Loans" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=Loans" class='structure' title='Show structure'>Loans</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=LoansHistories" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=LoansHistories" class='structure' title='Show structure'>LoansHistories</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=NonSupportedCountryLeads" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=NonSupportedCountryLeads" class='structure' title='Show structure'>NonSupportedCountryLeads</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=PaymentMethods" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=PaymentMethods" class='structure' title='Show structure'>PaymentMethods</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=Roles" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=Roles" class='structure' title='Show structure'>Roles</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=SequelizeMeta" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=SequelizeMeta" class='structure' title='Show structure'>SequelizeMeta</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=SimBankAccounts" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=SimBankAccounts" class='structure' title='Show structure'>SimBankAccounts</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=UserActivityLogs" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=UserActivityLogs" class='structure' title='Show structure'>UserActivityLogs</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=UserPaymentMethods" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=UserPaymentMethods" class='structure' title='Show structure'>UserPaymentMethods</a>
<li><a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;select=Users" class='select'>select</a> <a href="?server=mariadb&amp;username=root&amp;db=umbrella_dev_db&amp;table=Users" class='structure' title='Show structure'>Users</a>
</ul>
</div>
<script type="text/javascript">setupSubmitHighlight(document);</script>
