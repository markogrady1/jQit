'use strict';
/**
 * @license MIT/GPL
 * @author Ron Valstar (http://www.sjeiti.com/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 */



/**
 * sort the table containing the repository data 
 * when a given header is clicked
 *
 */
var sortTable = function() {
	var table = document.getElementById('xtable')
	    ,tableHead = table.querySelector('thead')
	    ,tableHeaders = tableHead.querySelectorAll('th')
	    ,tableBody = table.querySelector('tbody')
	;
	tableHead.addEventListener('click',function(e){
	    var tableHeader = e.target
	        ,textContent = tableHeader.textContent
	        ,tableHeaderIndex,isAscending,order
	    ;
	    if (textContent!=='add row') {
	        while (tableHeader.nodeName!=='TH') {
	            tableHeader = tableHeader.parentNode;
	        }
	        tableHeaderIndex = Array.prototype.indexOf.call(tableHeaders,tableHeader);
	        isAscending = tableHeader.getAttribute('data-order')==='asc';
	        order = isAscending?'desc':'asc';
	        tableHeader.setAttribute('data-order',order);
	        tinysort(
	            tableBody.querySelectorAll('tr')
	            ,{
	                selector:'td:nth-child('+(tableHeaderIndex+1)+')'
	                ,order: order
	            }
	        );
	    }
	});
};