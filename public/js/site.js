

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
    // function deleteSpace(data)
    // {
    //   window.location = 'http://localhost:3000/space/remove/' + data ;
    // }
    // if(form){
    //   var formData = new FormData(form);
    $('#updateSpace').click(function () {
      var form = document.getElementById('static-update-form');
  
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
      formData.set("id",$('#editSpaceId').val());
      
      formData.delete('photoArr');
  
      xhr.open('post', 'http://localhost:3000/space/edit');
      xhr.send(formData);
  
      xhr.onload = function () {
          console.log(xhr.responseText);
        
          var Timeout = setTimeout(function () {
              window.location.reload();
          }, 500);
      }
  });
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
//   file.onchange = function () {
//       for (let i = 0; i < this.files.length; i++) {
//           formData.append('photo' + i, this.files[i]); // add photos' path to formData
//           fileCount ++;
//       }
//       if(fileCount == 1){
//           $('#picTips').text('You have chosen '+fileCount+' photo');
//           $('#picTips').show();
//       } else if(fileCount > 1 && fileCount <=4){
//           $('#picTips').text('You have chosen '+fileCount+' photos');
//           $('#picTips').show();
//       } else {
//           $('#picTips').text('You can only upload 4 photos at most');
//           $('#picTips').show();
//       }
//   };
function dateCheck(from,to,check) {

  var fDate,lDate,cDate;
  fDate = Date.parse(from);
  lDate = Date.parse(to);
  cDate = Date.parse(check);


  // when user choose photos
  // file.onchange = function () {
  //     for (let i = 0; i < this.files.length; i++) {
  //         formData.append('photo' + i, this.files[i]); // add photos' path to formData
  //         fileCount ++;
  //     }
  //     if(fileCount == 1){
  //         $('#picTips').text('You have chosen '+fileCount+' photo');
  //         $('#picTips').show();
  //     } else if(fileCount > 1 && fileCount <=4){
  //         $('#picTips').text('You have chosen '+fileCount+' photos');
  //         $('#picTips').show();
  //     } else {
  //         $('#picTips').text('You can only upload 4 photos at most');
  //         $('#picTips').show();
  //     }
  // };


  if((cDate <= lDate && cDate >= fDate)) {
      return true;
  }
  return false;
}
  $('#booking').click( function(){
    $('.error').empty();
    var form = document.getElementById('bookingForm');
      let checkInDate =  $('#check-in').val();
      let checkOutDate =  $('#check-out').val();
      let spaceId = $('#spaceId').text();
      let pricePerDay = $('#pricePerDay').text();

      // input valoidation
      if(!checkInDate)
      {
        return $("<p/>").text('please provide check in date').appendTo(( '.error' ));
      }
      if(!checkOutDate)
      {
       return $("<p/>").text('please provide check out date').appendTo(( '.error' ));
      }
      let totalPrice = daysBetween(checkInDate, checkOutDate);
       totalPrice = pricePerDay * totalPrice

  
  // Check -out date should be greater than or equal to check in
      if (Date.parse(checkOutDate) <= Date.parse(checkInDate)) {
        $("<p/>").text('check out date should be greater than or equal to chekc in date').appendTo(( '.error' ));
        return;
     }
     let bookedArray = $('#bookings')[0].innerText;
     //check of check - in date
     bookedArray = $.parseJSON(bookedArray)
     for(let i = 0; i < bookedArray.length ;i++)
     {
        if( dateCheck (checkInDate,checkOutDate,bookedArray[i][0]))
        {
           $("<p/>").text('Please select Proper Range of date.').appendTo(( '.error' ));
          
          return;
        }   
         
     }
     ConfirmDialog('Are you sure');

function ConfirmDialog(message) {
   $('<div id="dialog"></div>').appendTo('body')
    .html('<div><h6>' + 'Total price for this booking will be $'+ totalPrice + '. Clicking on yes will complete your booking' + '?</h6></div>');
   
    $('#dialog').dialog({
      modal: true,
      title: 'Confirm booking',
      zIndex: 10000,
      autoOpen: true,
      width: 'auto',
      resizable: false,
      buttons: {
        Yes: function() {
          $(this).dialog("close");
          // $('body').append('<h1>Confirm Dialog Result: <i>Yes</i></h1>');
              // alert(daysBetween($('#first').val(), $('#second').val()));
              var requestConfig = {
                method: 'POST',
                url: '/bookings/'+ spaceId,
                contentType: 'application/json',
                data: JSON.stringify({
                    startDate: checkInDate,
                    endDate: checkOutDate,
                    spaceId: spaceId,
                    totalPrice: totalPrice
                })           
              };
              $.ajax(requestConfig).then(function(responseMessage) {
                $('.dateDisplay').datepicker('setDate', null)
                location.reload();
                });
        },
        No: function() {
          $('body').append('<h1>Confirm Dialog Result: <i>No</i></h1>');
          $('.dateDisplay').datepicker('setDate', null)
          
          $(this).dialog("close");
        }
      },
      close: function(event, ui) {
        $(this).remove();
      }
    });
};  
  });

  
  //Days calculation.
      
  function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.round((treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay);
}

$('.dropdown-item').click( function(e){
  let val = e.target.innerText;
  var requestConfig = {
    method: 'Get',
    url: 'space/filter/'+ val,      
  };
  $.ajax(requestConfig).then(function(responseMessage) {
    $("body").html(responseMessage);
    });
});

function disableDates(check_in){
$('.dateDisplay').datepicker({
  dateFormat: 'mm/dd/yy',
  minDate: 0,
  beforeShowDay: function(date) {
    var string = jQuery.datepicker.formatDate('mm/dd/yy', date);
    for (var i = 0; i < check_in.length; i++) {
      if (Array.isArray(check_in[i])) {
        var from = new Date(check_in[i][0].replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1"))
        var to = new Date(check_in[i][1].replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1"))
        // var from1 = new Date(check_in[i][0]);
        // var to1 = new Date(check_in[i][1]);
        var current = new Date(string);
        if (current >= from && current <= to) return false;
      }
    }
    return [check_in.indexOf(string) == -1]
  }
})
}

$('#passwordReset').click(function(){
  $('#passwordDiv').removeAttr('hidden');
  $('#passwordDiv').show();
});

$('#submitPassword').click(function(){
  let oldPassword = $('#oldPassword').val();
  let newPassword = $('#newPassword').val();
  let newPassword1 = $('#newPassword1').val();

  if(newPassword == newPassword1){
    var requestConfig = {
      method: 'POST',
      url: '/user/profile/password',
      contentType: 'application/json',
      data: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    };
  
  $.ajax(requestConfig).then(function(responseMessage){
    if(responseMessage == true) $('#passwordDiv').hide();
  });
}
});


