

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
    // if(form){
    //   var formData = new FormData(form);
  
    $('#addNewPostButton').click(function () {
      var form = document.getElementById('static-form');

      if(form){
          var formData = new FormData(form);
      }
      var xhr = new XMLHttpRequest();
      formData.set("spaceName", $('#spaceName').val());
      formData.set("length", $('#length').val());
      formData.set("width", $('#width').val());
      formData.set("height", $('#height').val());
      formData.set("streetAddress", $('#streetAddress').val());
      formData.set("city", $('#city').val());
      formData.set("state", $('#state').val());
      formData.set("zip", $('#zip').val());
      formData.set("price", $('#price').val());
      formData.set("description",$('#description').val());
      formData.delete('photoArr');

      xhr.open('post', 'http://localhost:3000/space/add');
      xhr.send(formData);

      xhr.onload = function () {
          console.log(xhr.responseText);
        
          var Timeout = setTimeout(function () {
              window.location.reload();
          }, 500);
      }
  });

  var form = document.getElementById('static-form');

    if(form){
        var formData = new FormData(form);
    }
  var file = document.getElementById('addImg')

  // count for photos user has chosen
  var fileCount = 0;
  $('#picTips').hide();

  // when user choose photos
  file.onchange = function () {
      for (let i = 0; i < this.files.length; i++) {
          formData.append('photo' + i, this.files[i]); // add photos' path to formData
          fileCount ++;
      }
      if(fileCount == 1){
          $('#picTips').text('You have chosen '+fileCount+' photo');
          $('#picTips').show();
      } else if(fileCount > 1 && fileCount <=4){
          $('#picTips').text('You have chosen '+fileCount+' photos');
          $('#picTips').show();
      } else {
          $('#picTips').text('You can only upload 4 photos at most');
          $('#picTips').show();
      }
  };

  $('#booking').click( function(){
    var form = document.getElementById('bookingForm');
      let checkInDate =  $('#check-in').val();
      let checkOutDate =  $('#check-out').val();
      let spaceId = $('#spaceId').val();
      let pricePerDay = $('#price').val();
      var requestConfig = {
            method: 'POST',
            url: '/bookings/',
            contentType: 'application/json',
            data: JSON.stringify({
                checkIn: checkInDate,
                checkOut: checkOutDate,
                spaceId: spaceId,
                pricePerDay: pricePerDay
            })           
    };
      $.ajax(requestConfig).then(function(responseMessage) {
                console.log(responseMessage);
                // newContent.html(responseMessage.message);
                //                alert("Data Saved: " + msg);
            });
  });