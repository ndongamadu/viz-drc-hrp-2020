function hxlProxyToJSON(input){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

let clustersEn = ['food_security', 'shelter', 'nfi', 'nutrition', 'health', 'protection', 'education', 'wash'];


function getClusterFr(cluster) {
    var fr = "";
    cluster=="food_security" ? fr = "Sécurité Alimentaire" : 
    cluster=="shelter" ? fr = "Abris" : 
    cluster=="nfi" ? fr = "Article Ménager Essentiel" : 
    cluster=="nutrition" ? fr = "Nutrition" : 
    cluster=="health" ? fr = "Santé" : 
    cluster=="protection" ? fr = "Protection" : 
    cluster=="education" ? fr = "Education" :
    cluster=="wash" ? fr = "WASH" : '';
    
    return fr;
} //getClusterFr


function getClusterEN(clusteur) {
    var en = "";
    clusteur=="Sécurité Alimentaire" ? en = "food_security" : 
    clusteur=="Abris" ? en = "shelter" : 
    clusteur=="Article Ménager Essentiel" ? en = "nfi" : 
    clusteur=="Nutrition" ? en = "nutrition" : 
    clusteur=="Santé" ? en = "health" : 
    clusteur=="Protection" ? en = "protection" : 
    clusteur=="Education" ? en = "education" :
    clusteur=="WASH" ? en = "wash" : '';
    
    return en;
} //getClusterFr




