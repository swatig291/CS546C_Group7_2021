

document.addEventListener("DOMContentLoaded", function(){

     let val= document.getElementsByClassName('starRate')
     for(let i = 0; i < val.length ; i++){
       let data =  document.getElementsByClassName("stars").innerHTML
      
        document.getElementsByClassName("stars")[i].innerHTML  = getStars(val[i].innerText);
           
     }
   
   
});

function getStars(rating) {

      // Round to nearest half
      rating = Math.round(rating * 2) / 2;
      let output = [];
    
      // Append all the filled whole stars
      for (var i = rating; i >= 1; i--)
        output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');
    
      // If there is a half a star, append it
      if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
    
      // Fill the empty stars
      for (let i = (5 - rating); i >= 1; i--)
        output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
    
      return output.join('');
    
    }

    function divFunction(data){
        //Some code
        window.location = 'http://localhost:3000/space/' + data ;    
       
    }
    
