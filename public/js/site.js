

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
        output.push('<i class="bi bi-star-fill" aria-hidden="true" style="color: gold;"></i>&nbsp;');
    
      // If there is a half a star, append it
      if (i == .5) output.push('<i class="bi bi-star-half" aria-hidden="true" style="color: gold;"></i>&nbsp;');
    
      // Fill the empty stars
      for (let i = (5 - rating); i >= 1; i--)
        output.push('<i class="bi bi-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');
    
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



    $('#addNewPostButton').on('click',function () {

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
      formData.set("longitude", $('#longitude').val());
      formData.set("latitude", $('#latitude').val());
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

function dateCheck(from,to,check) {

  var fDate,lDate,cDate;
  fDate = Date.parse(from);
  lDate = Date.parse(to);
  cDate = Date.parse(check);

  if((cDate <= lDate && cDate >= fDate)) {
      return true;
  }
  return false;
}
  $('#booking').on('click',function(){
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

$('#submitPassword').on('click',function(){
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

function userSpace(){
  //Some code
  window.location = 'http://localhost:3000/space/user' ;    
 
}



function fav(id)
{
  var requestConfig = {
    method: 'POST',
    url: 'user/savedSpaces/'+id,
  };

  $.ajax(requestConfig).then(function(responseMessage){
    
  });
}

$(".editable").each(function(i) {
  var $this = $(this);
  $this.attr("id", "orig-" + i);
  
  var $edit = $("<i />")
  .addClass('bi bi-pencil-fill')
  .attr("id", "update-" + i)
  .on('click',function() {
      var $input = $('<input type="text" />')
          .attr("id", "edit" + i)
          .val($this.text());
      
      var $save = $('<a class="bi bi-pencil-fill"></a>')
          .on('click',function() {
            //ajax call /comments/edit
              var $new = $("<p />").text($input.val());
              $input.replaceWith($new);
              $(this).replaceWith($edit);


              var commentId =  $('#commentId')[0].innerText;
              var requestConfig = {
                method: 'POST',
                url: '/comments/edit/'+ commentId,
                contentType: 'application/json',
                data: JSON.stringify({
                  comment: $new[0].innerHTML,
                })           
              };
              $.ajax(requestConfig).then(function(responseMessage) {
                alert('inserted');
                });

          });

      $(this).replaceWith($save);
      $this.replaceWith($input);

  });

 $(this).after($edit)
})
 //delete comment
 $(".deleteComment").on('click',function(e){
   e.preventDefault();
  var commentId =  $('.commentId')[0].innerText;
  var requestConfig = {
    method: 'post',
    url: '/comments/delete/'+ commentId,         
  };
  $.ajax(requestConfig).then(function(responseMessage) {
     $('.'+commentId).hide();
    });
 })
  
 

