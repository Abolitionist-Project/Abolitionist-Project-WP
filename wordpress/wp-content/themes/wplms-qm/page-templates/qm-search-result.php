<div ng-app="instantSearch" ng-controller="InstantSearchController" id="searchResultRegion">
   
    <input type="text" ng-model="searchString" placeholder="Enter your filter terms..." id="filterSearchResult" />  

    <ul>        
        <li ng-repeat="c in correlations | searchFor:searchString">            
            <div class="resultVariableName">{{c.variable}}<span class="correlationValue">{{c.correlation}}</span></div>
            <div class="resultCategoryName">{{c.category}}</div>
        </li>
    </ul>
    
    <button ng-click="loadData()" id="loadSearchResult">Refresh</button>
    
</div>