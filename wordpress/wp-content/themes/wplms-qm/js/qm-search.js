var SearchPage = function() {
    
    var selectOutputAsType = 'effect';
    
    var quantimodoVariables = {};
    
    var correlations = [];

    var initEvents = function()
    { 
        
        jQuery("#searchResultButton").on('click', function() { 
            if(jQuery("#searchVariableForResultHidden").val() == null || jQuery("#searchVariableForResultHidden").val() == "") {
                return;
            } 
            
            var variableName = jQuery('#searchVariableForResultHidden').val();
            if(SearchPage.selectOutputAsType == 'cause') {
                Quantimodo.getPublicCorrelationsWithCause({'cause' : variableName}, function(correlations) { 
                    SearchPage.correlations = [];
                    jQuery.each(correlations, function(_, correlation) {                        
                        SearchPage.correlations.push({ correlation : correlation.correlationCoefficient, variable : correlation.effect, category : correlation.effectCategory });
                    });
                    jQuery("#loadSearchResult").click();
                });
            } else {
                Quantimodo.getPublicCorrelationsWithEffect({'effect' : variableName}, function(correlations) { 
                    SearchPage.correlations = [];
                    jQuery.each(correlations, function(_, correlation) {
                        SearchPage.correlations.push({ correlation : correlation.correlationCoefficient, variable : correlation.cause, category : correlation.causeCategory });
                    });
                    jQuery("#loadSearchResult").click();
                });
            }   
            
        });
        
        jQuery("#askQuantimodo").on('click', function() { 
            if(jQuery("#searchVariableForResultHidden").val() == null || jQuery("#searchVariableForResultHidden").val() == "") {
                return;
            } else {
                jQuery("#searchVariableForResult").val(jQuery("#searchVariable").val());
            }  
            
            
            jQuery(".searchFormByDefault").hide();
            jQuery(".searchFormForResult").show();
            if(jQuery(".variablePickerUL") != null) {
                jQuery(".variablePickerUL").remove();
                initAutoCompleteForResult();
            }
            
            var variableName = jQuery('#searchVariableForResultHidden').val();
            if(SearchPage.selectOutputAsType == 'cause') {
                Quantimodo.getPublicCorrelationsWithCause({'cause' : variableName}, function(correlations) { 
                    SearchPage.correlations = [];
                    jQuery.each(correlations, function(_, correlation) {                        
                        SearchPage.correlations.push({ correlation : correlation.correlationCoefficient, variable : correlation.effect, category : correlation.effectCategory });
                    });
                    jQuery("#loadSearchResult").click();
                    jQuery("#searchResultRegion").show();
                });
            } else {
                Quantimodo.getPublicCorrelationsWithEffect({'effect' : variableName}, function(correlations) { 
                    SearchPage.correlations = [];
                    jQuery.each(correlations, function(_, correlation) {
                        SearchPage.correlations.push({ correlation : correlation.correlationCoefficient, variable : correlation.cause, category : correlation.causeCategory });
                    });
                    jQuery("#loadSearchResult").click();
                    jQuery("#searchResultRegion").show();
                });
            }   
            
        });
        
        jQuery("input:radio[name=selectOutputAsType]").click(function() {
            SearchPage.selectOutputAsType = $(this).val();
        });
           
    };
    
    var initVariables = function()
    {
        Quantimodo.getPublicVariables({}, function(variables)
        {
            SearchPage.quantimodoVariables = {};
            jQuery.each(variables, function(_, variable)
            {
                var category = SearchPage.quantimodoVariables[variable.category];
                
                if (category === undefined)
                {
                    SearchPage.quantimodoVariables[variable.category] = [variable];
                }
                else
                {
                    category.push(variable);
                }
            });
            jQuery.each(Object.keys(SearchPage.quantimodoVariables), function(_, category)
            {
                SearchPage.quantimodoVariables[category] = SearchPage.quantimodoVariables[category].sort(function(a, b)
                {
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
                
            });
           initAutoComplete();
        });        
    };

    var initAutoComplete = function() {
        jQuery.widget("custom.catcomplete", jQuery.ui.autocomplete, {
            _renderMenu: function(ul, items) {
                ul.addClass("variablePickerUL");
                var that = this,
                currentCategory = "";
                jQuery.each(items, function(index, item) {
                    if (item.category != currentCategory) {
                        ul.append("<li class='ui-autocomplete-category variablePickerCategory' originalName='"+ item.originalName +"'>" + item.category + "</li>");
                        currentCategory = item.category;
                    }
                    that._renderItemData(ul, item);
                });
            }
        });

        var varnames = [];
			jQuery.each(Object.keys(SearchPage.quantimodoVariables).sort(function(a, b)
			{
				return a.toLowerCase().localeCompare(b.toLowerCase());
			}), function(_, category)
			{
				var variables = SearchPage.quantimodoVariables[category];
				for(var n = 0; n < variables.length; n++)
				{
					var currentVariable = variables[n];
					varnames.push({label: currentVariable.name, originalName: currentVariable.originalName, category: currentVariable.category});
				}
			});

        

        jQuery("#searchVariable").catcomplete({
            source: varnames,
            select: function(event, ui) {
                 jQuery("#searchVariableForResultHidden").val(ui.item.originalName);
            },
            focus: function( event, ui ) {}
        });        
    };
    
    var initAutoCompleteForResult = function() {
        jQuery.widget("custom.catcomplete", jQuery.ui.autocomplete, {
            _renderMenu: function(ul, items) {
                ul.addClass("variablePickerULForResult");
                var that = this,
                currentCategory = "";
                jQuery.each(items, function(index, item) {
                    if (item.category != currentCategory) {
                        ul.append("<li class='ui-autocomplete-category variablePickerCategory' originalName='"+ item.originalName +"'>" + item.category + "</li>");
                        currentCategory = item.category;
                    }
                    that._renderItemData(ul, item);
                });
            }
        });

        var varnames = [];
			jQuery.each(Object.keys(SearchPage.quantimodoVariables).sort(function(a, b)
			{
				return a.toLowerCase().localeCompare(b.toLowerCase());
			}), function(_, category)
			{
				var variables = SearchPage.quantimodoVariables[category];
				for(var n = 0; n < variables.length; n++)
				{
					var currentVariable = variables[n];
					varnames.push({label: currentVariable.name, originalName: currentVariable.originalName, category: currentVariable.category});
				}
			});

        

        jQuery("#searchVariableForResult").catcomplete({
            source: varnames,
            select: function(event, ui) {
                jQuery("#searchVariableForResultHidden").val(ui.item.originalName);
            },
            focus: function( event, ui ) {}
        });        
    };

    return {
        correlations : correlations,
        selectOutputAsType : selectOutputAsType,
        quantimodoVariables: quantimodoVariables,
        init: function()
        {
            initVariables();
            initEvents();
        }
    };
}();

jQuery(SearchPage.init);

