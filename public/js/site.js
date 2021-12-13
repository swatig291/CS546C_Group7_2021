

document.addEventListener("DOMContentLoaded", function(){
  $('.error').empty();

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
      $('.error').empty();
      let spaceName = $('#spaceName').val();
      let length = $('#length').val();
      let width = $('#width').val();
      let height = $('#height').val();
      let price = $('#price').val();
      let streetAddress = $('#streetAddress').val();
      let city = $('#city').val();
      let state = $('#state').val();
      let zip = $('#zip').val();
      let longitude = $('#longitude').val();
      let latitude = $('#latitude').val();
      let description = $('#description').val();
     
      let hasError = false;
      //firstName validation
      if (!spaceName || spaceName.trim().length == 0) {
          $("<p/>").addClass("error").text('spaceName cannnot be empty.').appendTo('#spaceNameD');
          hasError = true;
      }
      if (!length || length.trim().length == 0 ||length < 0) {
          $("<p/>").addClass("error").text('Invalid length').appendTo('#lengthD');
          hasError = true;
      }
      if (!width || width.trim().length == 0 || width < 0) {
          $("<p/>").addClass("error").text('Invalid width').appendTo('#widthD');
          hasError = true;
      }
      if (!height || height.trim().length == 0 || height < 0) {
          $("<p/>").addClass("error").text('Invalid height').appendTo('#heightD');
          hasError = true;
      }
      if (!price || price.trim().length == 0 || price < 1) {
          $("<p/>").addClass("error").text('price cannnot be empty or less than 1.').appendTo('#priceD');
          hasError = true;
      }
      if (!streetAddress || streetAddress.trim().length == 0) {
          $("<p/>").addClass("error").text('streetAddress cannnot be empty.').appendTo('#streetAddressD');
          hasError = true;
      }
      if (!city || city.trim().length == 0) {
          $("<p/>").addClass("error").text('city cannnot be empty.').appendTo('#cityD');
          hasError = true;
      }
      if (!state || state.trim().length == 0) {
          $("<p/>").addClass("error").text('state cannnot be empty.').appendTo('#stateD');
          hasError = true;
      }
      if (!zip || zip.trim().length == 0) {
          $("<p/>").addClass("error").text('zip cannnot be empty.').appendTo('#zipD');
          hasError = true;
      }
      if (!description) {
          $("<p/>").addClass("error").text('description cannnot be empty.').appendTo('#descriptionD');
          hasError = true;
      }
      if (!longitude || longitude.trim().length == 0) {
          $("<p/>").addClass("error").text('longitude cannnot be empty.').appendTo('#longitudeD');
          hasError = true;
      }
      if (!latitude || latitude.trim().length == 0) {
          $("<p/>").addClass("error").text('latitude cannnot be empty.').appendTo('#latitudeD');
          hasError = true;
      }
     
      if(!hasError){
          
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
        var data = JSON.parse(this.responseText);
        if(data.hasErrors)
        {
         $.each(data.errors, function( k, v ) {
           $("<p/>").addClass("error").text(data.errors).appendTo('.error-apend');
         });
        }
      } 
     }
});



$('#addNewPostButton').on('click',function () {
//validation
$('.error').empty();
// event.preventDefault();
let spaceName = $('#spaceName').val();
let length = $('#length').val();
let width = $('#width').val();
let height = $('#height').val();
let price = $('#price').val();
let streetAddress = $('#streetAddress').val();
let city = $('#city').val();
let state = $('#state').val();
let zip = $('#zip').val();
let longitude = $('#longitude').val();
let latitude = $('#latitude').val();
let description = $('#description').val();
let hasError = false;
//firstName validation
if (!spaceName || spaceName.trim().length == 0) {
    $("<p/>").addClass("error").text('spaceName cannnot be empty.').appendTo('#spaceNameD');
    hasError = true;
}
if (!length || length.trim().length == 0 ||length < 0) {
    $("<p/>").addClass("error").text('Invalid length').appendTo('#lengthD');
    hasError = true;
}
if (!width || width.trim().length == 0 || width < 0) {
    $("<p/>").addClass("error").text('Invalid width').appendTo('#widthD');
    hasError = true;
}
if (!height || height.trim().length == 0 || height < 0) {
    $("<p/>").addClass("error").text('Invalid height').appendTo('#heightD');
    hasError = true;
}
if (!price || price.trim().length == 0 || price < 1) {
    $("<p/>").addClass("error").text('price cannnot be empty or less than 1.').appendTo('#priceD');
    hasError = true;
}
if (!streetAddress || streetAddress.trim().length == 0) {
    $("<p/>").addClass("error").text('streetAddress cannnot be empty.').appendTo('#streetAddressD');
    hasError = true;
}
if (!city || city.trim().length == 0) {
    $("<p/>").addClass("error").text('city cannnot be empty.').appendTo('#cityD');
    hasError = true;
}
if (!state || state.trim().length == 0) {
    $("<p/>").addClass("error").text('state cannnot be empty.').appendTo('#stateD');
    hasError = true;
}
if (!zip || zip.trim().length == 0) {
    $("<p/>").addClass("error").text('zip cannnot be empty.').appendTo('#zipD');
    hasError = true;
}
if (!description) {
    $("<p/>").addClass("error").text('description cannnot be empty.').appendTo('#descriptionD');
    hasError = true;
}
if (!longitude || longitude.trim().length == 0) {
    $("<p/>").addClass("error").text('longitude cannnot be empty.').appendTo('#longitudeD');
    hasError = true;
}
if (!latitude || latitude.trim().length == 0) {
    $("<p/>").addClass("error").text('latitude cannnot be empty.').appendTo('#latitudeD');
    hasError = true;
}
if (!description || description.trim().length == 0) {
  $("<p/>").addClass("error").text('description cannnot be empty.').appendTo('#descriptionD');
  hasError = true;
}
if(!hasError){
   
      // validation end
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
         var data = JSON.parse(this.responseText);
         if(data.hasErrors)
         {
          $.each(data.errors, function( k, v ) {
            $("<p/>").addClass("error").text(data.errors).appendTo('.error-apend');
          });
         }
        
       
      }
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

$('#passwordForm').on('submit',function(event){
  event.preventDefault();
  $('.error').empty();

  let oldPassword = $('#oldPassword').val();
  let newPassword = $('#newPassword').val();
  let newPassword1 = $('#newPassword1').val();
  let hasError = false;

  if(oldPassword.trim().length<6 || oldPassword.indexOf(' ')>=0){
    $("<p/>").addClass( "error" ).text('Old Password is invalid').appendTo('#oldPasswordDiv');
    hasError =true;
  }
  if(newPassword.trim().length<6 || newPassword.indexOf(' ')>=0){
    $("<p/>").addClass( "error" ).text('New Password is invalid').appendTo('#newPasswordDiv');
    hasError =true;
  }
  if(newPassword1.trim().length<6 || newPassword1.indexOf(' ')>=0){
    $("<p/>").addClass( "error" ).text('New Password is invalid').appendTo('#newPassword1Div');
    hasError =true;
  }
  if(newPassword != newPassword1){
    $("<p/>").addClass( "error" ).text('New Password is invalid').appendTo('#newPassword1Div');
    hasError =true;
  }
  
  if(!hasError){
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
    
  });
}
});

function userSpace(){
  //Some code
  window.location = 'http://localhost:3000/space/user' ;    
 
}

$('.favorites').on('click',function () {

  let id = $('.spaceId').text();
  {
    var requestConfig = {
      method: 'POST',
      url: $(this).data('href')
    };
  }

    $.ajax(requestConfig).then(function(responseMessage){
    alert('here');
      var data = JSON.parse(this.responseMessage);
        if(data.login)
        {
          window.location = 'http://localhost:3000/user/login' ;   
        }       
    });
});

$('.unfavorite').on('click',function () {

  let id = $('.spaceId').text();
  {
    var requestConfig = {
      method: 'POST',
      url: $(this).data('href')
    };
  }

    $.ajax(requestConfig).then(function(responseMessage){
     
    });
});

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

 
})
$( document ).ready(function() {
    //delete comment
    $(".commentCardBody").on('click','.deleteCardItem',function(e){
        e.preventDefault();
        var confrimDelete = confirm("Are you sure, you want to delete this comment?");
        if (confrimDelete == true) {
            var parentObj = $(this).parents('.commentCardBody')
            var requestConfig = {
                method: 'post',
                url: $(this).data('href'),         
            };
            $.ajax(requestConfig).then(function(responseMessage) {
                $(parentObj).remove()
            });
        }
    })

    //edit comment
    $('.commentCardBody').on('click', '.editComment',function(){
        var commentId = $(this).data('commentid')
        var parentObj = $(this).parents('.commentCardBody')
        $('.readModeBox', parentObj).slideUp(function(){
            $('.readModeIcons', parentObj).hide()
        })
        $('.editModeBox', parentObj).slideDown(function(){
            $('.editModeIcons', parentObj).show()
        });       
    })

    $('.commentCardBody').on('click', '.saveComment',function(){
        var commentId = $(this).data('commentid')
        var parentObj = $(this).parents('.commentCardBody')

        var commentText = $.trim($(".editCommentBox").val())
        let hasError = false;
        //
        if(!commentText || commentText.length ==0){
          $("<p/>").addClass( "error" ).text('Comment is empty. Nothing to post').appendTo('#editCommentBox');
          hasError = true;
        }
        //

        var commentText = $.trim($(".editCommentBox", parentObj).val())

        console.log(commentText)
        var requestConfig = {
            method: 'post',
            url: '/comments/edit/'+ commentId, 
            contentType: 'application/json',
            data: JSON.stringify({
                comment: commentText
            })        
        };
        $.ajax(requestConfig).then(function(responseMessage) {
            $('.commentText', parentObj).text(commentText)
            $('.editModeBox', parentObj).slideUp(function(){
                $('.editModeIcons', parentObj).hide()
            });
            $('.readModeBox', parentObj).slideDown(function(){
                $('.readModeIcons', parentObj).show()
            })
        });   
    })

    //cancel comment
    $('.commentCardBody').on('click', '.cancelComment',function(){
   
      var parentObj = $(this).parents('.commentCardBody')
      var commentText = $.trim($(".editCommentBox", parentObj).val())
      
    
          $('.commentText', parentObj).text(commentText)
          $('.editModeBox', parentObj).slideUp(function(){
              $('.editModeIcons', parentObj).hide()
          });
          $('.readModeBox', parentObj).slideDown(function(){
              $('.readModeIcons', parentObj).show()
          })
       
  })


    $('.commentCardBody').on('click', '.saveReview',function(){
        var commentId = $(this).data('commentid')
        var parentObj = $(this).parents('.commentCardBody')
        var commentText = $.trim($(".editCommentBox", parentObj).val())
        var rating = $('.rating option:selected', parentObj).text()
        var requestConfig = {
            method: 'post',
            url: '/reviews/edit/'+ commentId, 
            contentType: 'application/json',
            data: JSON.stringify({
              review: commentText,
                rating: rating
                // rating: $('.starRating').val()
            })        
        };
        $.ajax(requestConfig).then(function(responseMessage) {
            $('.readRating',parentObj).text('Rating: '+ rating)
            $('.commentText', parentObj).text(commentText)
            $('.editModeBox', parentObj).slideUp(function(){
                $('.editModeIcons', parentObj).hide()
            });
            $('.readModeBox', parentObj).slideDown(function(){
                $('.readModeIcons', parentObj).show()
            })
        });
      //cancel Review
          


    })


    //comments and review validation
    $('#comment-form').on('submit', (event) => {
      $('.error').empty();
      event.preventDefault();
      let hasError = false;
      let comment = $('#comment').val();

      if(!comment || comment.trim().length==0){
        $("<p/>").addClass( "error" ).text('Comment is empty. Nothing to post').appendTo('#commentDiv');
        hasError =true;
      }

      if(!hasError){
        $('#comment-form').unbind('submit').submit();
      }

    })


    $('.commentCardBody').on('click', '.cancelReview',function(){                        
      var parentObj = $(this).parents('.commentCardBody')
      
      $('.editModeBox', parentObj).slideUp(function(){
          $('.editModeIcons', parentObj).hide()
      });
      $('.readModeBox', parentObj).slideDown(function(){
          $('.readModeIcons', parentObj).show()
      })

     
    $('#review-form').on('submit', (event) => {
      $('.error').empty();
        event.preventDefault();
        let review = $('#postReview').find('textarea').val();
        let rating = $('#postRating').find('select').val();
        let hasError = false;
        if (!review || review.match(/^[ ]*$/)) {
            $("<p/>").addClass("error").text('Invalid review.').appendTo('#postReview');
            hasError = true;
        }
        if (rating == 0) {
            $("<p/>").addClass("error").text('Invalid rating.').appendTo('#postRating');
            hasError = true;
        }
        if(!hasError){
            $('#review-form').unbind('submit').submit();
         }
    });
  
})

})


